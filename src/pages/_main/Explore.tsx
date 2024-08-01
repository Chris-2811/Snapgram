import React from "react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  useGetPosts,
  useSearchPosts,
  useGetReels,
} from "@/lib/react-query/queriesAndMutations";
import GridPostList from "@/components/shared/_main/GridPostList";
import { useEffect } from "react";

function Explore() {
  const { ref, inView } = useInView();

  const [searchValue, setSearchValue] = useState("");
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(searchValue);
  const [showSearchResults, setShowSearchResults] = useState<boolean>();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  if (!posts) {
    return (
      <div>
        <div>Loading.....</div>
      </div>
    );
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setShowSearchResults(true);
  }

  const allPosts = posts.pages
    .flatMap((page) => page.map((post) => post))
    .sort((a, b) => Math.random() - 0.5);

  return (
    <div className="flex flex-col px-6 pb-10 pt-14 md:pt-[4.375rem]  lg:flex-1 lg:px-12">
      <div className=" flex w-full flex-col items-center text-center">
        <div className="w-full lg:w-[657px]">
          <h1 className="heading-lg">Search Hashtags</h1>
          <form
            onSubmit={handleSubmit}
            className="relative mx-auto  mt-[1.875rem] max-w-sm lg:mx-0"
          >
            <Input
              type="text"
              placeholder="Search Creators"
              className=" h-16 pl-[3.75rem] text-lg placeholder:text-light-400 md:max-w-full"
              value={searchValue}
              onChange={handleInputChange}
            />
            <img
              src="/assets/icons/search.svg"
              alt="search-icon"
              className="absolute left-5 top-1/2 -translate-y-1/2"
            />
          </form>
          <div className="flex w-full flex-col items-center">
            <ul
              role="list"
              className="mt-4 flex flex-col items-center gap-3 text-xs font-semibold text-light-400 md:mt-7 md:flex-row"
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
      </div>

      <div className="mt-12 flex w-full items-center justify-between md:mt-[4.5rem]">
        <h2 className="heading-md">Popular Today</h2>
        <div className="flex cursor-pointer items-center gap-4 rounded-lg bg-dark-300 px-4 py-[0.75rem]">
          <p className="font-medium">All</p>
          <img
            src="/assets/icons/filter.svg"
            alt="filter-icon"
            width={20}
            height={20}
          />
        </div>
      </div>

      {showSearchResults ? (
        searchedPosts && searchedPosts.length > 0 ? (
          <GridPostList posts={allPosts} />
        ) : (
          <div>nothing found</div>
        )
      ) : (
        <div className="mt-9">
          <GridPostList posts={allPosts} />
          {hasNextPage && (
            <div ref={ref} className="my-10 flex items-center justify-center">
              <div className="loader animate-spin">
                <img src="assets/icons/loader.svg" alt="loader" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Explore;
