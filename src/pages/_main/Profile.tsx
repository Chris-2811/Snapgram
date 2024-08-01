import GridPostList from "@/components/shared/_main/GridPostList";
import AuthContext from "@/context/AuthContext";
import {
  useGetPostsById,
  useGetReels,
  useGetReelsById,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutations";
import React, { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Tabbar from "@/components/ui/Tabbar";
import { Button } from "@/components/ui/button";
import Reel from "@/components/shared/_main/Reel";

function Profile() {
  const [isActive, setActive] = useState("posts");
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { data: userData } = useGetUserById(id);
  const { data: posts, fetchNextPage, hasNextPage } = useGetPostsById(id);
  const { data: reels } = useGetReelsById(id);

  const isCurrentUser = id === user?.uid;

  const allPosts = posts?.pages.flatMap((page) => page.map((post) => post));

  return (
    <div className="flex-1s px-[3.75rem] pt-20">
      <div className=" flex gap-[1.875rem]">
        <img
          src={
            userData?.photoUrl
              ? userData.photoUrl
              : "/assets/icons/profile-placeholder.svg"
          }
          alt="profile-picture"
          className="h-[150px] w-[150px] rounded-full "
        />
        <div>
          <div className="flex gap-10">
            <h1 className="heading-lg">{userData?.name}</h1>
            {isCurrentUser ? (
              <Link
                to={`/update-profile/${user?.uid}`}
                className="flex items-center gap-2"
              >
                <img src="/assets/icons/edit.svg" alt="edit" className="w-5" />
                <p>Edit Profile</p>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Button className="h-[38px] w-[84px] bg-primary">Follow</Button>
                <Button className="h-[38px] w-[84px] bg-light-200 text-dark-200">
                  Message
                </Button>
              </div>
            )}
          </div>
          <div className="text-light-400">@{userData?.username}</div>
          <div className="mt-[1.375rem] flex items-center gap-10">
            <div className={`${!isCurrentUser && "flex items-center gap-2"}`}>
              <div className="text-xl font-medium tracking-[-1px] text-primary ">
                273
              </div>
              <p className="mt-0.5 text-lg font-medium">Posts</p>
            </div>
            <div className={`${!isCurrentUser && "flex items-center gap-2"}`}>
              <div className="text-xl font-medium tracking-[-1px]  text-primary">
                273
              </div>
              <p className="mt-0.5 text-lg font-medium">Followers</p>
            </div>
            <div className={`${!isCurrentUser && "flex items-center gap-2"}`}>
              <div className="text-xl font-medium tracking-[-1px]  text-primary">
                273
              </div>
              <p className="mt-0.5 text-lg font-medium">Following</p>
            </div>
          </div>

          <div className="mb-10 mt-6 lg:max-w-[628px]">{userData?.bio}</div>
        </div>
      </div>

      <Tabbar setActive={setActive} isActive={isActive} />

      <div className="mt-[3.5rem]">
        {isActive === "posts" && posts && <GridPostList posts={allPosts} />}
        {isActive === "reels" && reels && (
          <div className="grid gap-6 lg:grid-cols-3">
            {reels.pages[0].map((reel) => (
              <Reel reel={reel} />
            ))}
          </div>
        )}
        <div className="relative z-50 mt-[2.125rem] flex h-20 justify-center ">
          {hasNextPage && (
            <Button
              onClick={() => fetchNextPage()}
              className="w-[132px] bg-dark-300 text-white"
            >
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
