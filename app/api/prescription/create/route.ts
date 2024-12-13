import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

connectDB();

import PrescriptionModel from "@/lib/models/prescriptions.models";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await PrescriptionModel.create(data);
    return NextResponse.json(
      {
        successMessage: `Prescription pour le patient ${result.patient.name} a été créée`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
