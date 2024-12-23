import { getFiveRecentOrders } from "@/lib/actions/appointment.actions";
import { Orderbuy } from "@/lib/types/types";
import FiveRecentsOrdersIby from "../ui/FiveAppointments";

export async function RecentOrdersIby() {
  const fiveRecentsOrders: Orderbuy[] = await getFiveRecentOrders();

  if (!fiveRecentsOrders) return <div>Loading...</div>;
  return (
    <div className="space-y-8">
      {fiveRecentsOrders?.map((ord, index) => (
        <FiveRecentsOrdersIby key={ord._id} order={ord} index={index + 1} />
      ))}
    </div>
  );
}
