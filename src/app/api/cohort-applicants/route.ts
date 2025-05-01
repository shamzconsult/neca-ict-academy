import connectViaMongoose from "@/lib/db";
import { Applicant } from "@/models/applicant";
import { FilterQuery } from "mongoose";
import { NextResponse } from "next/server";

interface ApplicantQuery extends FilterQuery<Document> {
    status?: string | { $in: string[] };
    $or?: Array<{
      firstName?: { $regex: string; $options: string };
      lastName?: { $regex: string; $options: string };
      email?: { $regex: string; $options: string };
      phoneNumber?: { $regex: string; $options: string };
    }>;
  }

export async function GET(request: Request) {
  try {
    await connectViaMongoose();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const searchQuery = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || '';

    const query: ApplicantQuery= {};

    if (statusFilter) {
        query.status = statusFilter;
      }
    
    if (searchQuery) {
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { phoneNumber: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    const total = await Applicant.countDocuments(query);

    const applicants = await Applicant.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: applicants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json(
      { success: false, message: "Error fetching applicants" },
      { status: 500 }
    );
  }
}

