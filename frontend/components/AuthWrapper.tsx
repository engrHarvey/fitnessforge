"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      setLoading(false); // Set loading to false if token is found
    }
  }, [router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>; // Show loading indicator while checking
  }

  return <>{children}</>;
}
