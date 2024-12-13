import StatCard from "@/components/StatCard";
// import { getAppointmentList } from "@/lib/actions/appointment.actions";
import React from "react";
import { columns } from "@/components/doctortable/columns";
import { DataTable } from "@/components/doctortable/DataTable";
import { getAllDoctors } from "@/lib/actions/patient.actions";
import AddDocteur from "@/components/docteurAction/AddDocteur";

const DocteurPage = async () => {
  //   const appointments = await getRecentAppointmentList();
  const docteurs = await getAllDoctors();
    // console.log(docteurs);
  return (
    <div className="relative mx-auto flex w-full flex-col space-y-14">
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Bienvenue 👋</h1>
          <p className="text-dark-700">
            Manager et customiser un docteur
          </p>
        </section>
        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={docteurs?.allDoctorsCount}
            label="Total des docteurs"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={docteurs?.docteursInServiceCount}
            label="Docteurs en service"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={docteurs?.docteursOutServiceCount}
            label="Docteurs hors service"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        <DataTable columns={columns} data={docteurs?.allDoctors} />
      </main>
      <AddDocteur />
    </div>
  );
};

export default DocteurPage;
