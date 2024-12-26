import { CONFIG_MENU_ADMIN } from "@features/admin/config";
import Footer from "@features/admin/components/Footer";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { Navigate, Outlet, ScrollRestoration } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import { openSidenavAtom } from "../store/sidenav";
import { RxHamburgerMenu } from "react-icons/rx";

const AdminView: React.FC = () => {
  const [openSidenav, setOpenSidenav] = useAtom(openSidenavAtom);
  const auth = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1140) {
        setOpenSidenav(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setOpenSidenav]);

  if (auth?.isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        LOADING...
      </div>
    );
  }

  if (!auth?.data) {
    return <Navigate to={"/login"} replace />;
  }

  const handleOpenSidenav = () => setOpenSidenav(!openSidenav);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        openSidenav={openSidenav}
        setOpenSidenav={handleOpenSidenav}
        Menus={CONFIG_MENU_ADMIN}
      />
      <div className="p-4 min-h-screen flex flex-col xl:ml-80 justify-between">
        <div>
          <header className="mb-3">
            <button
              onClick={() => handleOpenSidenav()}
              className="burger-btn d-block d-xl-none"
            >
              <RxHamburgerMenu />
            </button>
          </header>
          <Outlet />
          <ScrollRestoration />
        </div>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminView;
