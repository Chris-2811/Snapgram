import UserCard from "@/components/shared/_main/UserCard";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import React from "react";
import { Button } from "@/components/ui/button";

function AllUsers() {
  const { data: users, fetchNextPage, hasNextPage } = useGetUsers();

  const allUsers = users?.pages.flatMap((page) => page.map((user) => user));

  return (
    <div className="flex-1 px-[3.75rem] py-20">
      <div className="flex items-center gap-2">
        <img src="/assets/icons/users.svg" alt="users" />
        <h1 className="heading-lg">All Users</h1>
      </div>
      <div className="mt-10 flex flex-wrap gap-12">
        {allUsers?.map((user) => <UserCard creator={user} size="lg" />)}
      </div>
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            onClick={() => fetchNextPage()}
            className="mt-10 w-[132px] rounded-md bg-dark-300 text-white"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default AllUsers;
