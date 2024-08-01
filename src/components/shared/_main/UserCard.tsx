import React from "react";
import { Button } from "@/components/ui/button";

interface UserCardProps {
  size?: String;
  creator: any;
}

function UserCard({ creator, size }: UserCardProps) {
  return (
    <div
      className={`grid place-items-center rounded-[20px] border border-dark-400 bg-transparent px-[2.125rem] py-6 ${
        size === "lg" && "w-[303px] px-[4.375rem] py-10 text-center"
      }`}
    >
      <div className="">
        <img
          src={creator.photoUrl}
          alt="avatar"
          className={`h-[54px] w-[54px] rounded-full object-cover ${
            size === "lg" && "h-[90px] w-[90px]"
          }`}
        />
      </div>
      <h3
        className={`font-semibold ${size === "lg" && "mt-4 text-xl font-bold"}`}
      >
        {creator.name}
      </h3>
      <small
        className={`mb-5 mt-2 text-light-300 ${
          size === "lg" && " font-medium"
        }`}
      >
        @{creator.username}
      </small>
      <Button className="mt-3 block bg-primary" size="sm">
        Follow
      </Button>
    </div>
  );
}

export default UserCard;
