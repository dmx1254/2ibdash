import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

import PatientModel from "@/lib/models/patient.model";

connectDB();

export async function GET() {
  try {
    const patients = await PatientModel.find({
      role: "PATIENT",
    }).limit(10);
    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
