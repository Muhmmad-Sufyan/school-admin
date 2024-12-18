"use client";  

import { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  
  useEffect(() => {
    
    const authToken = localStorage.getItem("authToken");
    
    if (!authToken) {
      router.push("/login");  
      return;
    }

    const token = JSON.parse(authToken);
    
    
    if (token.role === "admin" || token.role === "instructor") {
      setIsAuthorized(true);
    } else {
      router.push("/");  
    }
  }, [router]);  

 
  if (!isAuthorized) {
    return <div>Loading...</div>;  
  }

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">SchooLama</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
