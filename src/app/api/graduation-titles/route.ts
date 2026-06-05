import connectViaMongoose from "@/lib/db";
import { GraduationTitle } from "@/models/graduation-title";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectViaMongoose();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const query = activeOnly ? { active: true } : {};
    const titles = await GraduationTitle.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: titles.map((title) => ({
        _id: String(title._id),
        name: title.name,
        slug: title.slug,
        description: title.description ?? "",
        scope: title.scope,
        maxWinners: title.maxWinners,
        badgeColor: title.badgeColor,
        active: title.active,
        sortOrder: title.sortOrder,
        createdAt: title.createdAt,
        updatedAt: title.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching graduation titles:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching graduation titles" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectViaMongoose();
    const body = await request.json();
    const { name, description, scope, maxWinners, badgeColor, active, sortOrder } =
      body as {
        name?: string;
        description?: string;
        scope?: "course" | "cohort";
        maxWinners?: number;
        badgeColor?: string;
        active?: boolean;
        sortOrder?: number;
      };

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Title name is required" },
        { status: 400 },
      );
    }

    const title = await GraduationTitle.create({
      name: name.trim(),
      description: description?.trim() ?? "",
      scope: scope ?? "course",
      maxWinners: maxWinners ?? 1,
      badgeColor: badgeColor ?? "#27156F",
      active: active ?? true,
      sortOrder: sortOrder ?? 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: title._id.toString(),
          name: title.name,
          slug: title.slug,
          description: title.description,
          scope: title.scope,
          maxWinners: title.maxWinners,
          badgeColor: title.badgeColor,
          active: title.active,
          sortOrder: title.sortOrder,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating graduation title:", error);
    return NextResponse.json(
      { success: false, message: "Error creating graduation title" },
      { status: 500 },
    );
  }
}
