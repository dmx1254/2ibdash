"use client";

import React, { useState } from "react";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { updateIsDoctorStatus } from "@/lib/actions/patient.actions";

const UpdateDoctorStatus = ({
  id,
  doctorStatus,
}: {
  id: string;
  doctorStatus: boolean;
}) => {
  const handleChangeCheck = async (isChecked: boolean) => {
    // console.log(checked);
    // setIsChecked(checked);

    try {
      const updatedDoctorStatus = await updateIsDoctorStatus(id, isChecked);
      if (updatedDoctorStatus) {
        new Promise((resolve) => {
          setTimeout(() => {
            toast.success(
              `Le status du docteur ${updatedDoctorStatus.name} a été mis jour`,
              {
                style: {
                  color: "#22c55e",
                  background: "#0D0F10",
                  border: "1px solid #363A3D",
                },
              }
            );
            resolve(undefined);
          }, 1000);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Switch
        customColorSwitch={doctorStatus}
        checked={doctorStatus}
        className="data-[state=checked]:bg-yellow-900 data-[state=unchecked]:bg-dark-400"
        onCheckedChange={handleChangeCheck}
      />
    </div>
  );
};

export default UpdateDoctorStatus;
