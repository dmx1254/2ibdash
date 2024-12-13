import PatientModel from "@/lib/models/patient.model";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
  try {
    const isActifDoctors = await PatientModel.find({
      role: "DOCTOR",
    })
      .select("_id")
      .select("name")
      .select("speciality")
      .select("profile")
      .select("createdAt")
      .select("updatedAt");
    return NextResponse.json(isActifDoctors);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch doctors" + error },
      { status: 500 }
    );
  }
}
