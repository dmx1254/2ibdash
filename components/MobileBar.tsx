"use client";

import React, { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import clsx from "clsx";
import { sidebarInfo } from "@/types/otherTypes";
import { usePathname } from "next/navigation";

const MobileBar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <span className="border-none outline-none flex md:hidden">
          <Menu size={30} />
        </span>
      </SheetTrigger>
      <SheetContent side="left" className="bg-dark-300 border-dark-500 h-full">
        <SheetHeader>
          <SheetTitle>
            <Link href="/dashboard" className="">
              <Image
                src="/assets/icons/logo-full.svg"
                height={100}
                width={100}
                alt="medicale care"
                className="mb-3 h-10 w-fit"
              />
            </Link>
          </SheetTitle>
          {/* <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription> */}
        </SheetHeader>
        <div className="flex flex-col items-start justify-between h-full pb-12">
          <div className="w-full flex flex-col items-start gap-2">
            {sidebarInfo.map((profil) => (
              <div className="flex flex-col items-start">
                <Button
                  key={profil.id}
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

          <Button
            variant="ghost"
            className="flex items-center gap-2 outline-none hover:text-red-500 text-[#7A7C7E]"
          >
            <LogOut />
            <span className="">Logout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileBar;
