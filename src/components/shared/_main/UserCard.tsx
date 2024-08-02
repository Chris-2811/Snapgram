import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface UserCardProps {
  size?: String;
  creator: any;
}

function UserCard({ creator, size }: UserCardProps) {
  console.log("creator", creator);
  return (
    <div
      className={`border-dark-500 grid h-[190px] w-[190px]  place-items-center rounded-[20px] border bg-transparent ${
        size === "lg" && "w-[303px] px-[4.375rem] py-10 text-center"
      }`}
    >
      <div className="grid h-[142px] grid-rows-[auto_1fr_auto] place-items-center">
        <div>
          <Link to={`/profile/${creator.id}`}>
            <img
              src={creator.photoUrl}
              alt="avatar"
              className={`h-[54px] w-[54px] rounded-full object-cover ${
                size === "lg" && "h-[90px] w-[90px]"
              }`}
            />
          </Link>
        </div>
        <div className="row-start-2 row-end-3 mt-[0.6125rem] self-start text-center leading-none">
          <h3
            className={`text-sm font-semibold leading-[1.4] text-white ${size === "lg" && "mt-4 text-xl font-bold"}`}
          >
            {creator.fullName}
          </h3>
          {creator.username && (
            <small
              className={` text-xs font-medium leading-[1.4] text-light-300 ${size === "lg" && " font-medium"}`}
            >
              @ {creator.username}
            </small>
          )}
        </div>
        <Button className="mt-3 block bg-primary" size="sm">
          Follow
        </Button>
      </div>
    </div>
  );
}

export default UserCard;
