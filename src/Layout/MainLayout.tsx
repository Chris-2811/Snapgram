import NavbarBottom from '@/components/shared/_main/NavbarBottom';
import NavbarSide from '@/components/shared/_main/NavbarSide';
import NavbarTop from '@/components/shared/_main/NavbarTop';
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface AuthLayOutProps {
  children: ReactNode;
}

function MainLayout() {
  return (
    <div className="lg:flex">
      <NavbarTop />
      <NavbarSide />
      <Outlet />

      <NavbarBottom />
    </div>
  );
}

export default MainLayout;
