import RegisterForm from "@/components/forms/RegisterForm";
import { getDoctorsInService } from "@/lib/actions/doctor.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Register = async () => {
  const actifsDoctors = await getDoctorsInService();
  // console.log(actifsDoctors);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <RegisterForm doctors={actifsDoctors} />
          <div className="copyright py-6 text-14-regular mt-2 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              &copy; 2024 MedicaleCare
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
