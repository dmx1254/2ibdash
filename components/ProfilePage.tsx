"use client";

import { profileInfo } from "@/types/otherTypes";
import React, { useEffect, useState } from "react";
import { Link, scroller } from "react-scroll";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { ActifRegisterDoctor, Patient, User } from "@/types";
import PersonalInformations from "./profile/PersonalInformations";
import MedicalesInformations from "./profile/MedicalesInformations";
import IdentityVerification from "./profile/IdentityVerification";
import MyAppointment from "./profile/MyAppointment";
import clsx from "clsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AppointmentForm from "./forms/AppointmentForm";
import { useRouter } from "next/navigation";

import { signOut } from "next-auth/react";

const UserProfile = ({
  userId,
  patient,
  doctors,
}: {
  userId: string;
  patient: Patient;
  doctors: ActifRegisterDoctor;
}) => {
  const router = useRouter();
  const [isSlugActive, setIsSlugActive] = useState<string>(
    "informations-personnelles"
  );

  useEffect(() => {
    const hash =
      typeof window !== "undefined" && window.location.hash.substring(1); // Détecte le fragment dans l'URL lors du montage du composant
    if (hash) {
      setIsSlugActive(hash);
      scroller.scrollTo(hash, {
        duration: 500,
        smooth: true,
        offset: -50,
      });
    }
  }, []);

  //   console.log(patient);
  const handleSlug = (activeSlug: string) => {
    setIsSlugActive(activeSlug);
    const currentPath = window.location.pathname;
    const newPath = `${currentPath}#${activeSlug}`;
    router.push(newPath);
  };

  //   const handleSetActive = (slug: string) => {
  //     console.log(to);
  //   };

  const logout = async () => {
    await signOut();
  };

  return (
    <div className="flex space-y-14" id="informations-personnelles">
      <div className="admin-profile-cop h-screen max-h-screen">
        <div className="flex flex-col items-start gap-4">
          {profileInfo.map((profil) => (
            <Button
              key={profil.id}
              variant="ghost"
              className={clsx(
                "cursor-pointer flex items-center gap-2 text-white/70",
                {
                  "bg-green-600 w-full": profil.slug === isSlugActive,
                  "hover:bg-dark-300": profil.slug !== isSlugActive,
                }
              )}
              onClick={() => handleSlug(profil.slug)}
              asChild
            >
              <Link
                to={`${profil.slug}`}
                activeClass="active"
                spy={true}
                smooth={true}
                offset={-50}
                duration={500}
                style={{ display: "block", width: "100%" }}
                // onSetActive={handleSetActive}
              >
                <p className="flex items-center gap-2">
                  <profil.icon size={22} />
                  <span className="text-[16px] max-md:hidden">
                    {profil.title}
                  </span>
                </p>
              </Link>
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2 outline-none hover:text-red-500 text-white/70"
          onClick={logout}
        >
          <LogOut />
          <span className="max-md:hidden">Logout</span>
        </Button>
      </div>
      <main className="admin-main remove-scrollbar container my-auto">
        <section className="w-full space-y-4">
          <h1 className="header">Bienvenue 👋</h1>
          <p className="font-extrabold text-14-regular text-green-500">
            {patient.name}
          </p>
        </section>

        <section className="w-full space-y-4 stat-card">
          <section className="space-y-4">
            <div className="mb-3 space-y-1">
              <h2 className="sub-header">Informations Personnelles</h2>
            </div>
          </section>

          <PersonalInformations patient={patient} />
          <section className="space-y-4" id="informations-medicales">
            <div className="mb-3 space-y-1">
              <h2 className="sub-header">Informations Médicales</h2>
            </div>
          </section>

          <MedicalesInformations patient={patient} />
          {/* <section className="space-y-4" id="verification-identite">
            <div className="mb-3 space-y-1">
              <h2 className="sub-header">Verification d'identités</h2>
            </div>
          </section>
          <IdentityVerification patient={patient} /> */}
          <section
            className="space-y-0 invisible"
            id="mes-rendez-vous"
          ></section>

          <Accordion type="single" collapsible className="select-none">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger>
                <div className="mb-6 space-y-1">
                  <h2 className="sub-header">Mes rendez vous</h2>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <section className="space-y-4" id="mes-rendez-vous">
                  <MyAppointment patient={patient} userId={userId} />
                </section>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex">
            <section className="w-full max-w-[860px] remove-scrollbar my-auto -mt-6">
              <div className="sub-p-container flex-1 justify-between">
                {/* <Image
                  src="/assets/icons/logo-full.svg"
                  height={1000}
                  width={1000}
                  alt="medicale care"
                  className="mb-12 h-10 w-fit"
                /> */}
                <AppointmentForm
                  type="create"
                  userId={userId}
                  patientId={userId}
                  name={patient.name}
                  phone={patient.phone}
                  doctors={doctors}
                />
                {/* <p className="copyright py-8">&copy; 2024 MedicaleCare</p> */}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
