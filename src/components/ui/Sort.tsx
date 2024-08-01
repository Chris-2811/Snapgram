import React from "react";

function Sort() {
  return (
    <div
      className="flex w-[4.625rem] cursor-pointer items-center justify-center gap-[0.625rem] rounded-md bg-dark-300 px-4 py-3
    "
    >
      <p className="font-xs font-semibold leading-[1.33]">All</p>
      <img src="/assets/icons/filter.svg" alt="filter" />
    </div>
  );
}

export default Sort;
