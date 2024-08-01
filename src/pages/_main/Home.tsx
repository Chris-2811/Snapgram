import React, { useEffect } from "react";
import {
  useGetPosts,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutations";
import PostCard from "@/components/shared/_main/PostCard";
import UserCard from "@/components/shared/_main/UserCard";
import { useInView } from "react-intersection-observer";
import Sort from "@/components/ui/Sort";
import Stories from "@/components/shared/_main/Stories";

function Home() {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
    fetchNextPage,
    hasNextPage,
  } = useGetPosts();

  const {
    data: users,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && posts) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  const allUsers = users?.pages.flatMap((page) => page.map((user) => user));

  return (
    <div className="lg:flex lg:flex-1">
      <div className=" px-4 pt-[1.625rem] md:px-10 lg:px-[3.25rem] lg:pt-[3.75rem]  ">
        <div className="lg:w-[600px] ">
          <div>
            <Stories />
          </div>
          <div className="flex w-full items-center justify-between">
            <h2 className="heading-md">Home Feed</h2>
            <Sort />
          </div>
          <div>
            {isPostLoading && !posts ? (
              <h1 className="bg-red">Loading...</h1>
            ) : (
              posts && (
                <ul role="list" className="mt-10 flex flex-col gap-10 ">
                  {posts.pages.flatMap((page) =>
                    page.map((post) => (
                      <li key={post.id}>
                        <PostCard post={post} />
                      </li>
                    )),
                  )}
                </ul>
              )
            )}
          </div>
          {hasNextPage && (
            <div ref={ref} className="my-10 flex items-center justify-center">
              <div className="loader animate-spin">
                <img src="assets/icons/loader.svg" alt="loader" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=" hidden px-6 pt-12 xl:block">
        <h1 className="heading-md">Top Creators</h1>
        <ul className="mt-10 grid grid-cols-2 gap-6">
          {allUsers?.slice(0, 8).map((creator, index) => (
            <li key={index}>
              <UserCard creator={creator} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
