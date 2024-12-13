"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { CreateAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";
import { ActifRegisterDoctor, Status } from "@/types";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const AppointmentForm = ({
  type,
  userId,
  patientId,
  appointment,
  setOpen,
  name,
  phone,
  doctors,
  loading,
}: {
  type: "create" | "cancel" | "schedule";
  userId: string;
  patientId: string | undefined;
  appointment: Appointment;
  setOpen: (open: boolean) => void;
  name?: string;
  phone: string | undefined;
  doctors: ActifRegisterDoctor[];
  loading?: boolean;
}) => {
  const translateStatusToFr = (status: string): string => {
    return status === "pending"
      ? "En attente"
      : status === "scheduled"
      ? "Programmé"
      : status === "cancelled"
      ? "Annulé"
      : "";
  };

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof CreateAppointmentSchema>>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof CreateAppointmentSchema>) {
    setIsLoading(true);
    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
        break;
    }

    try {
      if (patientId && phone ) {
        if (type === "create") {
          const appointmentData = {
            userId,
            patientId,
            primaryPhysician: values.primaryPhysician,
            primaryPhysicianId: "",
            schedule: new Date(values.schedule),
            reason: values.reason,
            note: values.note,
            name: name || "",
            phone,
            status: status as Status,
          };
          const appointment = await createAppointment(appointmentData);

          if (appointment) {
            form.reset();
            router.push(
              `/patients/${userId}/success?appointmentId=${appointment._id}`
            );
          } else {
            toast.error("Error: Quelque chose s'est mal passée", {
              style: { color: "red" },
            });
          }
        } else {
          if (appointment?._id) {
            const appointmentToUpdate = {
              userId,
              appointmentId: appointment?._id,
              phone,
              appointment: {
                primaryPhysician: values.primaryPhysician,
                schedule: new Date(values.schedule),
                status: status as Status,
                cancellationReason: values?.cancellationReason || "",
              },
              type,
            };

            const updatedAppointment = await updateAppointment(
              appointmentToUpdate
            );
            if (updatedAppointment) {
              setOpen(false);
              form.reset();
              toast.success(
                `Le rendez-vous avec ${
                  updatedAppointment.name
                } a été ${translateStatusToFr(
                  updatedAppointment.status
                )} avec succès.`,
                {
                  style: {
                    color: "#22c55e",
                    background: "#0D0F10",
                    border: "1px solid #363A3D",
                  },
                }
              );
            }
          }
        }
      }
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message, {
          style: { color: "red" },
        });
      }
    }
    setIsLoading(false);
  }

  let buttonLabel;

  switch (type) {
    case "cancel":
      buttonLabel = "Annuler le rendez-vous";
      break;
    case "create":
      buttonLabel = "Créer un rendez-vous";
      break;
    case "schedule":
      buttonLabel = "Confirmer un rendez-vous";
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header-prof">Nouveau Rendez-vous</h1>
            <p className="text-dark-700">
              Demander un nouveau rendez-vous en 10 secondes
            </p>
          </section>
        )}
        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Docteur"
              placeholder="Choisir un docteur"
            >
              {doctors?.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.profile}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Date de rendez-vous prévue"
              showTimeSelect
              dateFormat="dd/MM/yyyy - HH:mm aa"
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Motif du rendez-vous"
                placeholder="Entrez le motif du rendez-vous"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Remarques"
                placeholder="Saisir des notes"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Raison de l'annulation"
            placeholder="Entrez le motif de l'annulation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
