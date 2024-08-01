import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function NavbarTop() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative border-b border-b-dark-400 lg:hidden">
      <div className="container-sm flex items-center justify-between py-5">
        <Link to="/">
          <img
            src="/assets/images/logo.svg"
            alt="company-logo"
            className="w-[131px]"
          />
        </Link>
        <div className="flex items-center gap-5">
          <img
            src="/assets/images/profile.png"
            alt="avatar"
            className="w-[1.875rem]"
          />
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer rounded-md bg-dark-400 p-2"
          >
            {!isOpen ? (
              <img
                src="/assets/icons/menu-02.svg"
                alt={isOpen ? "close-menu" : "open-menu"}
              />
            ) : (
              <div className="relative h-6 w-6">
                <div className="absolute left-1/2 h-full w-0.5 origin-center -rotate-45 transform bg-primary"></div>
                <div className="absolute left-1/2 h-full w-0.5 origin-center rotate-45 transform bg-primary"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full  bg-black  px-9 pb-12 pt-10">
          <div className="absolute inset-0 "></div>
          <nav aria-label="primary-navigation">
            <ul role="list" className="inline-block space-y-[2.125rem]">
              <li>
                <Link to="explore">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/icons/wallpaper.svg"
                      alt=""
                      className="w-[1.125rem]"
                    />
                    <p>Explore</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="">
                  <div className="flex items-center gap-2">
                    <img src="/assets/icons/bell.svg" alt="" />
                    <p>Notifications</p>
                  </div>
                </Link>
              </li>
              <li>
                {" "}
                <Link to="">
                  <div className="flex items-center gap-2">
                    <img src="/assets/icons/settings.svg" alt="" />
                    <p>Settings</p>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          <Button
            variant="destructive"
            size="lg"
            className="mt-8 w-full max-w-[303px]"
          >
            <div className="flex items-center gap-2">
              <img src="/assets/icons/logout-light.svg" alt="" className="" />
              <p>Logout</p>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}

export default NavbarTop;
