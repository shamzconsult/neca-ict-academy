import connectViaMongoose from '@/lib/db';
import { Applicant } from '@/models/applicant';
import { Enrollment } from '@/models/enrollment';
import mongoose, { Types } from 'mongoose';
import { FilterQuery } from 'mongoose';
import { NextResponse } from 'next/server';
import Course from '@/models/course';
import Cohort from '@/models/cohort';

interface IApplicant {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  state: string;
  gender: string;
  profilePicture: {
    url: string;
    public_id: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ICourse {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
}

interface ICohort {
  _id: Types.ObjectId;
  name: string;
  startDate: Date;
  endDate: Date;
}

interface IEnrollment {
  _id: Types.ObjectId;
  applicant: Types.ObjectId | IApplicant;
  course: Types.ObjectId | { _id: Types.ObjectId; title: string; slug: string; description: string };
  cohort: Types.ObjectId | { _id: Types.ObjectId; name: string; startDate: Date; endDate: Date };
  level: string;
  status: string;
  cv: {
    url: string;
    public_id: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface IApplicantQuery extends FilterQuery<IApplicant> {
  $or?: Array<{
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
    phoneNumber?: { $regex: string; $options: string };
  }>;
}

interface IEnrollmentQuery extends FilterQuery<IEnrollment> {
  applicant: {
    $in: Types.ObjectId[];
  };
  status?: string;
  cohort?: Types.ObjectId;
  level?: string;
}

interface IApplicantResponse {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  level: string;
  course: string;
  cohort: string;
  enrollmentId?: Types.ObjectId;
}

export async function GET(request: Request) {
  try {
    await connectViaMongoose();

    if (!mongoose.models.Course) {
      mongoose.model('Course', Course.schema);
    }
    if (!mongoose.models.Cohort) {
      mongoose.model('Cohort', Cohort.schema);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const searchQuery = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || '';
    const cohortFilter = searchParams.get('cohort') || '';
    const levelFilter = searchParams.get('level') || '';

    const query: IApplicantQuery = {};

    if (searchQuery) {
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { phoneNumber: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const total = await Applicant.countDocuments(query);
    const applicants = await Applicant.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IApplicant[]>();

    const applicantIds = applicants.map(app => app._id);

    const enrollmentQuery: IEnrollmentQuery = {
      applicant: { $in: applicantIds },
    };
    if (statusFilter) enrollmentQuery.status = statusFilter;
    if (cohortFilter) enrollmentQuery.cohort = new Types.ObjectId(cohortFilter);
    if (levelFilter) enrollmentQuery.level = levelFilter;

    const enrollments = await Enrollment.find(enrollmentQuery)
      .populate<{ course: ICourse }>('course', 'title')
      .populate<{ cohort: ICohort }>('cohort', 'name')
      .sort({ createdAt: -1 })
      .lean<IEnrollment[]>();

    const enrichedApplicants: IApplicantResponse[] = applicants.map(applicant => {
      const applicantEnrollments = enrollments.filter(enr => {
        const enrollmentApplicantId = enr.applicant instanceof Types.ObjectId ? enr.applicant : enr.applicant._id;
        return enrollmentApplicantId.equals(applicant._id);
      });

      const latestEnrollment = applicantEnrollments[0] || null;

      return {
        ...applicant,
        status: latestEnrollment?.status || 'Not enrolled',
        level: latestEnrollment?.level || 'Not enrolled',
        course: latestEnrollment?.course && 'title' in latestEnrollment.course ? latestEnrollment.course.title : 'No course',
        cohort: latestEnrollment?.cohort && 'name' in latestEnrollment.cohort ? latestEnrollment.cohort.name : 'No cohort',
        enrollmentId: latestEnrollment?._id,
      };
    });

    let filteredApplicants = enrichedApplicants;
    if (statusFilter) {
      filteredApplicants = filteredApplicants.filter(app => app.status.toLowerCase() === statusFilter.toLowerCase());
    }
    if (levelFilter) {
      filteredApplicants = filteredApplicants.filter(app => app.level.toLowerCase() === levelFilter.toLowerCase());
    }
    if (cohortFilter) {
      filteredApplicants = filteredApplicants.filter(
        app => app.cohort === cohortFilter || app.cohort === new Types.ObjectId(cohortFilter).toString()
      );
    }
    // if (levelFilter) {
    //   filteredApplicants = filteredApplicants.filter(app => app.level === levelFilter);
    // }

    return NextResponse.json({
      success: true,
      data: filteredApplicants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching applicants',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
