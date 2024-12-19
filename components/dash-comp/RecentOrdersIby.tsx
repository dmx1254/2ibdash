import { getFiveRecentOrders } from "@/lib/actions/appointment.actions";
import { Orderbuy } from "@/lib/types/types";
import FiveRecentsOrdersIby from "../ui/FiveAppointments";

export async function RecentOrdersIby() {
  const fiveRecentsOrders: Orderbuy[] = await getFiveRecentOrders();
  return (
    <div className="space-y-8">
      {fiveRecentsOrders?.map((ord) => (
        <FiveRecentsOrdersIby key={ord._id} order={ord} />
      ))}
    </div>
  );
}