"use client";
import React from "react";
import StoryItem from "@/components/ui/StoryItem";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";

function Stories() {
  const { user } = useContext(AuthContext);
  const { data: userData } = useGetUserById(user?.uid);

  console.log(user);
  console.log(user?.photoURL);
  console.log(userData?.photoUrl);

  return (
    <div className="flex gap-3 pb-8">
      <StoryItem avatar={user?.photoURL} />
      <StoryItem />
      <StoryItem />
      <StoryItem />
    </div>
  );
}

export default Stories;
