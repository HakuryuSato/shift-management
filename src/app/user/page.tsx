"use client";

import { UserHome } from "@/components/user/UserHome";
import { SessionProvider } from "next-auth/react";

const Home = () => {
  return (
    <SessionProvider>
      <UserHome />
    </SessionProvider>
  );
};

export default Home;