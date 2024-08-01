import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div>
      <section className="flex flex-col md:flex-row h-screen">
        <div className="flex-1 flex items-start lg:items-center pt-40 lg:pt-0 justify-center bg-dark-100">
          <Outlet />
        </div>
        <img
          src="/assets/images/side-img.svg"
          alt=""
          className="hidden lg:block md:w-1/2 h-screen object-cover"
        />
      </section>
    </div>
  );
}

export default AuthLayout;
