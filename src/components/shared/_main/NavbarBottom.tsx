import React from "react";
import { bottombarLinks } from "@/constants";
import { NavLink, useLocation } from "react-router-dom";

function NavbarBottom() {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 rounded-t-[20px] bg-dark-400 lg:hidden">
      <div className="px-7 py-[0.875rem] md:px-10">
        <nav className="secondary-navigation">
          <ul className="flex items-center justify-between">
            {bottombarLinks.map((link, index) => {
              const isActive = pathname === link.route;

              return (
                <li
                  key={index}
                  className={`${
                    isActive && "bg-primary"
                  } w-[60px] rounded-[10px] px-2 py-[0.625rem] text-[0.625rem] font-bold `}
                >
                  <NavLink to={link.route} className=" block rounded-[10px]">
                    <div className="flex flex-col items-center gap-[0.375rem]">
                      <img
                        src={link.imgURL}
                        alt=""
                        className={`${isActive && "invert-white"} `}
                      />
                      <p>{link.label}</p>
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default NavbarBottom;
