import React from "react";
import UserCard from "@/components/shared/_main/UserCard";
import { useInView } from "react-intersection-observer";
import { HoverEffect } from "../ui/card-hover-effect";

function TopCreators({ user }: any) {
  return (
    <div className="pt-custom  sticky  top-0 hidden h-screen  w-full max-w-[465px] grow px-6 pt-10 lg:max-h-[1024px] xl:block">
      <h1 className="heading-md">Top Creators</h1>
      <HoverEffect items={user} />
    </div>
  );
}

export default TopCreators;
