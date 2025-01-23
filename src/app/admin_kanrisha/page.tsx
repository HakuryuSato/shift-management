"use client";

import { AdminHome } from "@/components/admin/AdminHome";
import { SessionProvider } from "next-auth/react";

const Home = () => {
  return (
    <SessionProvider>
      <AdminHome />
    </SessionProvider>
  );
};

export default Home;