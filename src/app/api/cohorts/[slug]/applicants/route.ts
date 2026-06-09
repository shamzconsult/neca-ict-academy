import connectViaMongoose from "@/lib/db";
import {
  findCohortBySlug,
  getCohortApplicantsPage,
  parseApplicantsQueryParams,
} from "@/lib/cohort-applicants.server";
import { NextResponse } from "next/server";
import { Parser } from "json2csv";

export async function GET(
  request: Request,
  { params }: { params: Promise<Record<string, unknown>> },
) {
  try {
    await connectViaMongoose();
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get("download") === "1";
    const queryParams = parseApplicantsQueryParams(searchParams);

    const cohort = await findCohortBySlug(String(slug));
    if (!cohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 },
      );
    }

    const { data, pagination } = await getCohortApplicantsPage(
      cohort,
      queryParams,
      { paginate: !isDownload },
    );

    if (isDownload) {
      const parser = new Parser();
      const csv = parser.parse(data);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=applicants-${slug}.csv`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      cohort: {
        name: cohort.name,
        slug: cohort.slug,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        applicationStartDate: cohort.applicationStartDate,
        applicationEndDate: cohort.applicationEndDate,
        active: cohort.active,
        courses: cohort.courses,
        createdAt: cohort.createdAt,
      },
      data,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching applicants",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
