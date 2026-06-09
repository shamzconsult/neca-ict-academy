import connectViaMongoose from "@/lib/db";
import {
  findCohortBySlug,
  getCohortApplicantsPage,
  parseApplicantsQueryParams,
} from "@/lib/cohort-applicants.server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<Record<string, unknown>> },
) {
  try {
    await connectViaMongoose();
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const queryParams = parseApplicantsQueryParams(searchParams);

    const cohort = await findCohortBySlug(String(slug));
    if (!cohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 },
      );
    }

    const applicantsResult = await getCohortApplicantsPage(cohort, queryParams);

    return NextResponse.json({
      success: true,
      data: applicantsResult.data,
      pagination: applicantsResult.pagination,
    });
  } catch (error) {
    console.error("Error fetching cohort applicants:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching cohort applicants",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
