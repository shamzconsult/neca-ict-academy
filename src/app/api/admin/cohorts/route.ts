import { getAllCohorts } from "@/services/admin/admin.server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cohorts = await getAllCohorts();
    return NextResponse.json({ success: true, data: cohorts });
  } catch (error) {
    console.error("Error fetching admin cohorts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching cohorts",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
