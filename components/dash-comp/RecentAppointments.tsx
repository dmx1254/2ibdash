import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFiveRecentAppointments } from "@/lib/actions/appointment.actions";
import FiveAppointments from "../ui/FiveAppointments";
import { AppointmentResponse } from "@/types";

export async function RecentAppointments() {
  const FiveRecentsApps: AppointmentResponse[] =
    await getFiveRecentAppointments();
  return (
    <div className="space-y-8">
      {FiveRecentsApps?.map((apps) => (
        <FiveAppointments key={apps._id} recentAppointments={apps} />
      ))}
    </div>
  );
}
