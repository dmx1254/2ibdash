"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { undefined, z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.actions";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { Select, SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { convertFileToBase64 } from "@/lib/utils";
import { toast } from "sonner";
import { ActifRegisterDoctor } from "@/types";
import { Eye, EyeOff } from "lucide-react";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const RegisterForm = ({ doctors }: { doctors: ActifRegisterDoctor[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const file = values.identificationDocument[0];
      const base64 = await convertFileToBase64(file);

      formData = new FormData();
      formData.append("base64File", base64);
      formData.append("fileName", file.name);
    }

    const { confirmPassword, ...patientDataWithoutConfirmPassword } = values;
    try {
      const patientData = {
        ...patientDataWithoutConfirmPassword,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData?.get("base64File") as string,
      };

      const patient = await registerPatient(patientData);
      if (patient.error) {
        toast.error(patient.error, {
          style: { color: "red" },
        });
      } else {
        if (patient.user) {
          toast.success(patient.message, {
            style: { color: "green" },
          });
          form.reset();
        } else return;
      }
      //   if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error: any) {
      console.log(error);
    }
    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Bienvenue 👋</h1>
          <p className="text-dark-700">Laisser nous en savoir plus sur vous.</p>
        </section>
        <section className="space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Informations Personnelles</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Prenom et nom"
          placeholder="Prenom et nom"
          iconSrc="/assets/icons/user.svg"
          iconAlt="name"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Telephone"
            placeholder="771234567"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date de naissance"
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Genre"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option, i) => (
                    <div key={option + i} className="radio-group">
                      <RadioGroupItem
                        value={option}
                        id={option}
                        className={`${
                          field.value === option ? "text-green-500" : ""
                        }`}
                      />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="15 rue, Liberte 6"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Profession"
            placeholder="Developpeur Web"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Personne à contacter en cas d'urgence"
            placeholder="Personne à contacter en cas d'urgence"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Numéro à contacter en cas d'urgence"
            placeholder="771234567"
          />
        </div>
        <section className="space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Informations Médicales</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Medecin principal"
          placeholder="Choisir un medecin"
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

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Fournisseur d'assurance"
            placeholder="sen Assurance"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Numéro de police d'assurance"
            placeholder="ABC12457813"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="bloodgroup"
            label="Groupe sanguin"
            placeholder="ex: O+"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="vaccination"
            label="Vaccination(le cas échéant)"
            placeholder="ex: vaccination contre le paludisme"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (le cas échéant)"
            placeholder="Poussière, chocolat, cacahuètes"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Médicaments actuels"
            placeholder="Paracetamol 500mg, Ibuprofen 200mg"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Antécédents médicaux familiaux"
            placeholder="Mon père avait du diabète"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="Antécédents médicaux"
            label="Antécédents médicaux"
            placeholder="Paludisme, Tuberculose"
          />
        </div>
        <section className="space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification et Vérification</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Type d'identification"
          placeholder="Sélectionner le type d'identification"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Numéro d'identification"
          placeholder="AO1024578"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Copie numérisée du document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="password"
            label="Mot de passe"
            placeholder="Mot de passe"
            iconSrc="/assets/icons/locker.svg"
            IconAbsView={Eye}
            IconAbsOff={EyeOff}
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="confirmPassword"
            label="Confirmer votre mot de passe"
            placeholder="Confirmer votre mot de passe"
            iconSrc="/assets/icons/locker.svg"
            IconAbsView={Eye}
            IconAbsOff={EyeOff}
          />
        </div>
        <section className="space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consentement et Confidentialité</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="Je consens au traitement de mes données"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="Je consent à la divulgation d'information"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="Je consent à la politique de confidentialité"
        />

        <SubmitButton isLoading={isLoading}>
          soumettre et continuer
        </SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
