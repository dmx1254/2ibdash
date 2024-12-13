import React, { Suspense } from "react";
import { columns } from "@/components/patientable/columns";
import { DataTable } from "@/components/patientable/DataTable";
// import { getAllPatients } from "@/lib/actions/patient.actions";
import PatientStatCard from "@/components/PatientStatCard";

import { Users, UserCheck, TriangleAlert } from "lucide-react";
import PatientSearch from "@/components/PatientSearch";
import DateFilterPatient from "@/components/DateFilterPatient";
import { getPatients } from "@/lib/api/patient";
import LatestInvoicesSkeleton from "@/components/skelettons/skeletons";

const PatientPage = async ({
  searchParams,
}: {
  searchParams?: {
    patient?: string;
    startDate?: string;
    endDate?: string;
    genre?: string;
    identicationType?: string;
    page?: number;
  };
}) => {
  const patient = searchParams?.patient || "";
  const startDate = searchParams?.startDate || "";
  const endDate = searchParams?.endDate || "";
  const genre = searchParams?.genre || "";
  const identicationType = searchParams?.identicationType || "";
  const currentPageStr = searchParams?.page || 1;
  const currentPage = Number(currentPageStr);
  const data = await getPatients(
    patient,
    startDate,
    endDate,
    genre,
    identicationType,
    currentPage
  );

  // console.log(data);

  return (
    <div className="mx-auto flex w-full flex-col space-y-14">
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Bienvenue 👋</h1>
          <p className="text-dark-700">
            Gerer et personnaliser les patients de votre choix.
          </p>
        </section>
        <section className="admin-stat">
          <PatientStatCard
            type="appointments"
            count={data?.patientsCount}
            label="Total Patients"
            w={32}
            h={32}
            icon={<Users size={32} className="text-[#a16207]" />}
          />
          <PatientStatCard
            type="pending"
            count={data?.patientsActif}
            label="Patients en ligne"
            icon={<UserCheck size={32} className="text-[#24AE7C]" />}
            w={32}
            h={32}
          />
          <PatientStatCard
            type="cancelled"
            count={data?.patientsBan}
            label="Patients Bannis"
            icon={<TriangleAlert size={32} className="text-[#FFD147]" />}
            w={32}
            h={32}
          />
        </section>
        <section className="w-full flex items-center justify-between">
          <PatientSearch doctors={null || []} />
          <DateFilterPatient />
        </section>
        <Suspense
          key={patient + currentPage}
          fallback={<LatestInvoicesSkeleton />}
        >
          <DataTable
            totalPages={data?.totalPages || 1}
            itemsperPage={8}
            currentPage={currentPage}
            columns={columns}
            data={data?.patients}
          />
        </Suspense>
      </main>
    </div>
  );
};

export default PatientPage;
