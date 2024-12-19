"use client";

import { ChangeEvent } from "react";
import { Search, Filter } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";

const SerachAchat = () => {
  // console.log(doctors);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const handleSearchChange = useDebouncedCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (searchTerm) {
      params.set("servername", searchTerm);
    } else {
      params.delete("servername");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 600);

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (status) {
      params.set("category", status);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleCancelFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (params.get("category")) {
      params.delete("category");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const checkIsSearchParamsData = searchParams.get("category");

  return (
    <div className="relative w-full flex items-center gap-4 max-w-sm">
      <Input
        placeholder="Rechercher un serveur..."
        id="searchInput"
        // value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleSearchChange(e.target.value)
        }
        defaultValue={searchParams.get("servername")?.toString()}
        className="w-full pl-8 max-w-80 placeholder:text-white/50 border-dark-500 bg-dark-400 text-14-regular"
      />
      <Search
        className="absolute text-dark-500 top-[24%] left-[2%]"
        size={22}
      />
      <Popover>
        <PopoverTrigger asChild>
          <button className="bg-dark-400 p-2.5 rounded-[10px]">
            <Filter size={22} className="text-white/50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-dark-300 border-dark-500 p-4 rounded-lg">
          <div className="flex flex-col space-y-4">
            {/* Status Filter */}
            <div className="w-full">
              <Label htmlFor="category" className="text-white/80 mb-2">
                Filtrer par Status
              </Label>
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger className="shad-select-trigger mt-2">
                  <SelectValue placeholder="Categorie" />
                </SelectTrigger>
                <SelectContent className="shad-select-content">
                  <SelectGroup>
                    <SelectItem value="dofus-kamas">
                      <div className="flex cursor-pointer items-center gap-2 transition-colors hover:bg-dark-400">
                        <p>Dofus kamas</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="dofus-touch">
                      <div className="flex cursor-pointer items-center gap-2 transition-colors hover:bg-dark-400">
                        <p>Dofus touch</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="dofus-retro">
                      <div className="flex cursor-pointer items-center gap-2 transition-colors hover:bg-dark-400">
                        <p>Dofus retro</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="wakfu">
                      <div className="flex cursor-pointer items-center gap-2 transition-colors hover:bg-dark-400">
                        <p>Wakfu</p>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {checkIsSearchParamsData && (
              <button
                className="w-full outline-none text-white/80 selft-center text-red-200 rounded"
                onClick={handleCancelFilter}
              >
                Annuler les filtres
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SerachAchat;