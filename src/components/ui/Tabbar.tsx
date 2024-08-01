import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function Tabbar({
  setActive,
  isActive,
}: {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  isActive: string;
}) {
  const { pathname } = useLocation();

  function handleTabClick(e: React.MouseEvent) {
    setActive(e.currentTarget.id);
  }

  return (
    <div className="mb-[3.625rem] mt-12 flex items-center justify-between   ">
      <div className="flex items-center gap-0 overflow-hidden  rounded-[10px] bg-dark-200">
        {pathname === "/reels" ? (
          <h1>hello reels</h1>
        ) : (
          <>
            <div
              id="posts"
              onClick={handleTabClick}
              className={`${
                isActive === "posts" && "bg-dark-400"
              } flex cursor-pointer items-center gap-[0.625rem] px-[3.125rem] py-3`}
            >
              <img src="/assets/icons/posts.svg" alt="posts" />
              <p className="font-medium">Posts</p>
            </div>
            <div
              id="reels"
              onClick={handleTabClick}
              className={`${
                isActive === "reels" && "bg-dark-400"
              } flex cursor-pointer items-center gap-[0.625rem] px-[3.125rem] py-3`}
            >
              <img src="/assets/icons/play.svg" alt="reels" />
              <p className="font-medium">Reels</p>
            </div>
            {pathname === "/saved-posts" ? (
              <div
                id="collections"
                onClick={handleTabClick}
                className={`${
                  isActive === "collections" && "bg-dark-400"
                } flex cursor-pointer items-center gap-[0.625rem] px-[3.125rem] py-3`}
              >
                <img src="/assets/icons/folder-favorite.svg" alt="collection" />
                <p className="font-medium">Collections</p>
              </div>
            ) : (
              <div
                id="collections"
                onClick={handleTabClick}
                className={`${
                  isActive === "collections" && "bg-dark-400"
                } flex cursor-pointer items-center gap-[0.625rem] px-[3.125rem] py-3`}
              >
                <img src="/assets/icons/tag.svg" alt="collection" />
                <p className="font-medium">Tagged</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-[0.625rem]">
        <p>All</p>
        <img src="/assets/icons/filter.svg" alt="filter" />
      </div>
    </div>
  );
}

export default Tabbar;
