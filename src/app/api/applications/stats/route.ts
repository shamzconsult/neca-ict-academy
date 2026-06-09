import connectViaMongoose from "@/lib/db";
import { getApplicationStats } from "@/lib/application-stats.server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectViaMongoose();
    const { searchParams } = new URL(request.url);
    const cohortId = searchParams.get("cohortId");

    const data = await getApplicationStats(cohortId);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching application stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching application stats",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
