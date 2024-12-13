import { LucideIcon, Server, ShoppingBag, Stethoscope, UsersRound } from "lucide-react";
import {
  UserRound,
  HeartPulse,
  Calendar,
  House,
  CalendarCheck,
  BriefcaseMedical,
  ShieldPlus,
} from "lucide-react";

interface SubU {
  id: string;
  title: string;
  slug: string;
  icon?: LucideIcon;
}

type profilePerso = {
  id: string;
  title: string;
  slug: string;
  icon: LucideIcon;
  subUrls?: SubU[];
};

export const profileInfo: profilePerso[] = [
  {
    id: "koaps30",
    title: "Informations Personnelles",
    slug: "informations-personnelles",
    icon: UserRound,
  },
  {
    id: "pawxd74",
    title: "Informations Medicales",
    slug: "informations-medicales",
    icon: HeartPulse,
  },

  {
    id: "zaplq25",
    title: "Mes rendez-vous",
    slug: "mes-rendez-vous",
    icon: Calendar,
  },
];

export const sidebarInfo: profilePerso[] = [
  {
    id: "koaps30",
    title: "Home",
    slug: "/dashboard",
    icon: House,
  },
  {
    id: "pawxd74",
    title: "Rendez vous",
    slug: "/dashboard/rendez-vous",
    icon: CalendarCheck,
    // HeartPulse
  },
  {
    id: "lpqza69",
    title: "Clients",
    slug: "/dashboard/clients",
    icon: UsersRound,
  },
  {
    id: "zazlq25",
    title: "Docteurs",
    slug: "/dashboard/docteurs",
    icon: BriefcaseMedical,
  },
  {
    id: "laqlq25",
    title: "Commandes",
    slug: "#",
    icon: ShoppingBag,
    subUrls: [
      {
        id: "lpqza619",
        title: "Achats",
        slug: "/dashboard/commandes/achats",
      },
      {
        id: "lpaqza69",
        title: "Ventes",
        slug: "/dashboard/commandes/ventes",
      },
      {
        id: "lpaqgqc19",
        title: "Echanges",
        slug: "/dashboard/commandes/echanges",
      },
    ],
  },
  {
    id: "opazq25",
    title: "Serveurs",
    slug: "#",
    icon: Server,
    subUrls: [
      {
        id: "lpqzkla19",
        title: "Achats",
        slug: "/dashboard/serveurs/achats",
      },
      {
        id: "lpaqgtai9",
        title: "Ventes",
        slug: "/dashboard/serveurs/ventes",
      },
    ],
  },
  {
    id: "zayga25",
    title: "Ajouter un patient",
    slug: "/dashboard/nouveau-patient",
    icon: ShieldPlus,
  },
  {
    id: "lpawv47",
    title: "Dossier médical ",
    slug: "/dashboard/dossier-medical",
    icon: Stethoscope,
  },
];
