import { NextResponse } from "next/server";
import connectViaMongoose from "@/lib/db";
import { Enrollment } from "@/models/enrollment";
import { statusOptionsMap } from "@/const";

export async function GET() {
  try {
    await connectViaMongoose();

    const [
      totalApplicants,
      totalDeclined,
      totalAdmitted,
      totalGraduated,
      totalPending,
    ] = await Promise.all([
      Enrollment.countDocuments({}),
      Enrollment.countDocuments({ status: statusOptionsMap.declined }),
      Enrollment.countDocuments({ status: statusOptionsMap.admitted }),
      Enrollment.countDocuments({ status: statusOptionsMap.graduated }),
      Enrollment.countDocuments({ status: statusOptionsMap.pending }),
    ]);

    const stats = [
      { name: "Total Applicants", value: totalApplicants },
      { name: "Total Pending", value: totalPending },
      { name: "Total Declined", value: totalDeclined },
      { name: "Total Admitted", value: totalAdmitted },
      { name: "Total Graduated", value: totalGraduated },
    ];

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.toString() },
      { status: 500 }
    );
  }
}
