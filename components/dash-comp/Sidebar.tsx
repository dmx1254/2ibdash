"use client";

import { sidebarInfo } from "@/types/otherTypes";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogOut, Stethoscope } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";

const Sidebar = () => {
  const pathname = usePathname();

  const logout = async () => {
    await signOut();
  };

  return (
    <div className="admin-profile-cop sticky left-0 top-0 bottom-0 max-h-screen max-md:hidden md:w-60">
      <div className="flex flex-col items-start gap-4">
        <Link href="/dashboard" className="max-md:hidden">
          <Image
            src="/assets/icons/logo-full.svg"
            height={100}
            width={100}
            alt="medicale care"
            className="mb-3 h-10 w-fit"
          />
        </Link>
        <Link href="/dashboard" className="flex self-center md:hidden">
          <Image
            src="/assets/icons/logo-icon.svg"
            height={100}
            width={100}
            alt="medicale care"
            className="mb-3 h-10 w-fit"
          />
        </Link>
        <div className="w-full flex flex-col items-start gap-2">
          {sidebarInfo.map((profil) => (
            <div key={profil.id} className="flex flex-col items-start">
              <Button
                className={clsx("cursor-pointer flex items-center gap-2", {
                  "text-green-500 opacity-90 hover:opacity-100":
                    profil.slug === pathname,

                  "hover:opacity-100": profil.slug !== pathname,
                })}
                asChild
              >
                <Link href={profil.slug} className="flex items-start gap-2">
                  <span>
                    <profil.icon size={20} />
                  </span>
                  <span>{profil.title}</span>
                </Link>
              </Button>
              {profil.subUrls &&
                profil.subUrls.map((sub) => (
                  <Button
                    key={sub.id}
                    className={clsx(
                      "cursor-pointer flex items-center gap-2 opacity-90 ml-6",
                      {
                        "text-green-500 opacity-100 hover:opacity-100":
                          sub.slug === pathname,

                        "hover:opacity-100": sub.slug !== pathname,
                      }
                    )}
                    asChild
                  >
                    <Link className="flex items-start gap-2" href={sub.slug}>
                      {sub.title}
                    </Link>
                  </Button>
                ))}
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="ghost"
        className="flex items-center gap-2 outline-none hover:text-red-500"
        onClick={logout}
      >
        <LogOut />
        <span className="text-base max-md:hidden">Déconnexion</span>
      </Button>
    </div>
  );
};

export default Sidebar;
