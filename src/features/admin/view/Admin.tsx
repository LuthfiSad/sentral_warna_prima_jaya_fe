import { CONFIG_MENU_ADMIN } from "@features/admin/config";
import Footer from "@features/admin/components/Footer";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";
import Sidenav from "../components/Sidenav";
import { openSidenavAtom } from "../store/sidenav";
import { RxHamburgerMenu } from "react-icons/rx";
import { allRoutes } from "@core/utils/routes";
import { toast } from "react-toastify";
import { dataUserAtom } from "../store/dataUser";
import { UserModel } from "@core/model/user";

const AdminView: React.FC = () => {
  const [openSidenav, setOpenSidenav] = useAtom(openSidenavAtom);
  const [, setDataUser] = useAtom(dataUserAtom);
  const auth = useAuth();
  // const auth = { isLoading: false, data: { data: { role: "KARYAWAN" } } };
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState<{
    redirect: boolean;
    path: string;
  }>({ redirect: false, path: "" });
  const [oldPath, setOldPath] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1140) {
        setOpenSidenav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpenSidenav]);

  useEffect(() => {
    // Reset redirect state on location change
    setShouldRedirect({ redirect: false, path: "" });

    if (auth?.isLoading || !auth?.data) return;
    setDataUser(auth.data.data as UserModel);

    const currentRoute = allRoutes.find((route) => {
      if (route.path.includes(":")) {
        const pathPattern = route.path.replace(/:\w+/g, "[^/]+");
        const regex = new RegExp(`^${pathPattern}$`);
        return regex.test(location.pathname);
      }
      return route.path === location.pathname;
    });

    const oldRoute = allRoutes.find((route) => {
      if (route.path.includes(":")) {
        const pathPattern = route.path.replace(/:\w+/g, "[^/]+");
        const regex = new RegExp(`^${pathPattern}$`);
        return regex.test(oldPath);
      }
      return route.path === oldPath;
    });

    if (!currentRoute) {
      setShouldRedirect({ redirect: true, path: "/" });
      return;
    }

    const userRole = auth.data.data?.is_admin ? "ADMIN" : "KARYAWAN";

    function capitalize(str: string): string {
      return str
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }

    if (!currentRoute.role.includes(userRole!)) {
      let redirectPath = "/";

      switch (userRole) {
        case "ADMIN":
          redirectPath = "/";
          toast.error(
            "You don't have permission, you are not " +
              currentRoute?.role?.map((role) => capitalize(role))?.join(", "),
            {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              theme: "dark",
            }
          );
          break;
        case "KARYAWAN":
          redirectPath = oldRoute?.role?.includes(userRole)
            ? oldRoute.path
            : "/";
          toast.error(
            "You don't have permission, you are not " +
              currentRoute?.role?.map((role) => capitalize(role))?.join(", "),
            {
              position: "top-right",
              autoClose: 3000,
              pauseOnHover: true,
              theme: "dark",
            }
          );
          break;
      }

      setShouldRedirect({ redirect: true, path: redirectPath });
    }
    setOldPath(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location.pathname,
    auth?.data?.data?.is_admin,
    auth?.isLoading,
    auth?.data,
  ]);

  useEffect(() => {}, [location.pathname]);

  const handleOpenSidenav = () => setOpenSidenav(!openSidenav);

  // Handle loading state
  if (auth?.isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        LOADING...
      </div>
    );
  }

  // Handle unauthenticated state
  if (!auth?.data) {
    return <Navigate to="/login" replace />;
  }

  // Handle redirect based on permissions
  if (shouldRedirect.redirect) {
    return <Navigate to={shouldRedirect.path} replace />;
  }

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        openSidenav={openSidenav}
        setOpenSidenav={handleOpenSidenav}
        Menus={CONFIG_MENU_ADMIN}
        user={auth?.data?.data?.is_admin ? "ADMIN" : "KARYAWAN"}
      />
      <div className="p-4 min-h-screen flex flex-col xl:ml-80 justify-between">
        <div>
          <header className="mb-3">
            <button
              onClick={handleOpenSidenav}
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
