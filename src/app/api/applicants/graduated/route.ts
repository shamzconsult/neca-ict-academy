import connectViaMongoose from "@/lib/db";
import {
  getGraduatesPage,
  parseGraduatesQueryParams,
} from "@/lib/graduates.server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectViaMongoose();
    const { searchParams } = new URL(request.url);
    const params = parseGraduatesQueryParams(searchParams);
    const result = await getGraduatesPage(params);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      filters: result.filters,
      total: result.pagination.total,
    });
  } catch (error) {
    console.error("Error fetching graduated applicants:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching graduated applicants",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
