import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { Overview } from "@/components/dash-comp/overview";
import { RecentAppointments } from "@/components/dash-comp/RecentAppointments";
import { SearchParamProps } from "@/types";
import PasskeyModal from "@/components/PasskeyModal";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/option";
import { ibenOrdersCounts } from "@/lib/actions/appointment.actions";

import {
  CalendarCheck2,
  BriefcaseMedical,
  ShoppingCart,
  ShoppingBasket,
} from "lucide-react";
import {
  getPatientDevicesTypes,
  getPatientVisit,
  getUsersCounts,
} from "@/lib/actions/patient.actions";
import { getibytradeOrdersCount } from "@/lib/actions/doctor.actions";
import { PieChartVisitors } from "@/components/PieChartVisitors";
import { BarCharDeskMob } from "@/components/BarCharDeskMob";
import Count from "@/components/Count";

export const metadata: Metadata = {
  title: "Medicalecare Dashboard",
  description: "Medicalecare dashboard for health appintments",
};

export default async function DashboardPage({
  searchParams,
}: SearchParamProps) {
  const session = await getServerSession(options);
  const totalIbenOrders = await ibenOrdersCounts();
  const totalUsers = await getUsersCounts();
  const totalIbyOrders = await getibytradeOrdersCount();
  const visites = await getPatientVisit();
  const devices = await getPatientDevicesTypes();
  const isAdmin = !!searchParams.isAdmin;

  // console.log(visites);

  return (
    <>
      <div className="flex-col md:flex">
        {isAdmin && <PasskeyModal />}
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-8 md:pt-6">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="stat-card-admin bg-appointments border-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">
                      Commande de ventes
                    </CardTitle>
                    <ShoppingCart size={28} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-32-bold text-white">
                      <Count count={totalIbenOrders} duration={3} />
                    </div>
                    <p className="text-xs text-green-500 mt-2">
                      +20.1% par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>

                <Card className="stat-card-admin bg-appointments border-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">
                      Utilisateurs
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-7 w-7 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-32-bold">
                      <Count count={totalUsers} duration={10} />
                    </div>
                    <p className="text-xs text-green-500 mt-2">
                      +18% par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>
                <Card className="stat-card-admin bg-appointments border-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">
                      Commande d'achats
                    </CardTitle>
                    <ShoppingBasket size={28} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-32-bold">
                      <Count count={totalIbyOrders} duration={6} />
                    </div>
                    <p className="text-xs text-green-500 mt-2">
                      +39% par rapport au mois dernier
                    </p>
                  </CardContent>
                </Card>
                <Card className="stat-card-admin bg-appointments border-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">
                      Utilisateurs actif
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-7 w-7 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-32-bold">
                      <Count count={124} duration={5} />
                    </div>
                    <p className="text-xs text-green-500 mt-2">
                      +78 depuis la dernière heure
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-dark-500">
                  <CardHeader>
                    <CardTitle>Rendez vous</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-4 md:col-span-3 border-dark-500">
                  <CardHeader>
                    <CardTitle>Rendez vous recents</CardTitle>
                    <CardDescription className="text-xs text-green-500">
                      Vos {5} derniers rendez-vous vous attendent.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentAppointments />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <div className="w-full flex items-center max-lg:flex-col gap-8">
              <PieChartVisitors desktopData={visites} />
              <BarCharDeskMob chartData={devices} />
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
}
