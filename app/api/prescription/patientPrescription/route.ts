import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

connectDB();

import PrescriptionModel from "@/lib/models/prescriptions.models";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await PrescriptionModel.find({
      patientId: data.patientId,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
