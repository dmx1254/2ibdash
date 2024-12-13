import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

import PatientModel from "@/lib/models/patient.model";

connectDB();

export async function POST(req: Request) {
  try {
    const dataSearch = await req.json();
    const matchConditions: any = {};
    const bloodgroup = dataSearch.bloodgroup;
    const identificationType = dataSearch.identificationType;
    const name = dataSearch.name;
    const gender = dataSearch.gender;
    const primaryPhysician = dataSearch.primaryPhysician;

    if (name && name.trim() !== "") {
      matchConditions.name = { $regex: name, $options: "i" };
    }

    if (bloodgroup && bloodgroup.trim() !== "") {
      matchConditions.bloodgroup = { $regex: bloodgroup, $options: "i" };
    }

    if (identificationType && identificationType.trim() !== "") {
      matchConditions.identificationType = {
        $regex: identificationType,
        $options: "i",
      };
    }

    if (gender && gender.trim() !== "") {
      matchConditions.gender = {
        $regex: gender,
        $options: "i",
      };
    }

    if (primaryPhysician && primaryPhysician.trim() !== "") {
      matchConditions.primaryPhysician = {
        $regex: primaryPhysician,
        $options: "i",
      };
    }
    const result = await PatientModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $match: {
          role: "PATIENT",
        },
      },
    ]);

    const totalDocuments = await PatientModel.countDocuments(matchConditions);

    return NextResponse.json(
      { patient: result, totalDocuments: totalDocuments },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
