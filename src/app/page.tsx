"use client";


import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/dev/admin_kanrisha');
    // router.push('/user');  
  }, [router]);

  return null;
};

export default Home;