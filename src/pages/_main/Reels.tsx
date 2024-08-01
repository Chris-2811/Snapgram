import React from "react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Tabbar from "@/components/ui/Tabbar";
import { useGetReels } from "@/lib/react-query/queriesAndMutations";
import Reel from "@/components/shared/_main/Reel";

function Reels() {
  const [searchValue, setSearchValue] = useState<String>("");
  const { data: reels } = useGetReels();

  function handleSubmit() {}

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  return (
    <div className="flex-1 px-[3.125rem] pb-10 pt-[4.375rem]">
      <div className="mx-auto max-w-[1070px]">
        <div className="flex flex-col items-center">
          <div className=" flex items-center gap-4">
            <img
              src="assets/icons/play.svg"
              alt="play-icon"
              className="invert-white h-9 w-9"
            />
            <h1 className="heading-lg">Search Reels</h1>
          </div>
          <form onSubmit={handleSubmit} className="relative mt-[1.875rem]">
            <Input
              type="text"
              placeholder="Search Creators"
              className="h-16 pl-[3.75rem] text-lg placeholder:text-light-400 lg:w-[657px]"
              value={searchValue}
              onChange={handleInputChange}
            />
            <img
              src="/assets/icons/search.svg"
              alt="search-icon"
              className="absolute left-5 top-1/2 -translate-y-1/2"
            />
          </form>
          <div className="flex flex-col items-center">
            <ul
              role="list"
              className="mt-7 flex items-center gap-3 text-xs font-semibold text-light-400"
            >
              <li className="rounded-[20px] border border-dark-400 px-4 py-[0.625rem]">
                #mountains
              </li>
              <li className="rounded-[20px] border border-dark-400 px-4 py-[0.625rem]">
                #webdevelopment
              </li>
              <li className="rounded-[20px] border border-dark-400 px-4 py-[0.625rem]">
                #funny
              </li>
              <li className="rounded-[20px] border border-dark-400 px-4 py-[0.625rem]">
                #sports
              </li>
            </ul>
          </div>
        </div>
        <Tabbar />
        <div className="grid lg:grid-cols-3 lg:gap-6">
          {reels?.pages[0].map((reel, index) => (
            <Reel key={index} reel={reel} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reels;
