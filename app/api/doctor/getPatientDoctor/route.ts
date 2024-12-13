import PatientModel from "@/lib/models/patient.model";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

connectDB();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const doctor = await PatientModel.findOne({
      role: "DOCTOR",
      name: data.primaryPhysician,
    })
      .select("_id")
      .select("name")
      .select("speciality")
      .select("profile")
      .select("createdAt")
      .select("updatedAt");
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch patient doctor" + error },
      { status: 500 }
    );
  }
}
