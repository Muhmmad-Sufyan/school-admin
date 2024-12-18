'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/login");
    } else {
      const token = JSON.parse(authToken);
      setUserRole(token.role);
      setUserName(token.name)
    }
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logged out successfully!", {
      position: "top-right",
    });
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  const handleAddUser = () => {
    if (userRole === "admin") {
      router.push("/admin/add-user");
    } else {
      toast.error("You do not have permission to add a user.", {
        position: "top-right",
      });
    }
  };

  const handleNavigateAdminPage = () => {
    if (userRole === "admin" || userRole === "instructor") {
      router.push("/admin");
    } else {
      toast.error("You do not have permission to access this page.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full relative">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{userName}</span>
          <span className="text-[10px] text-gray-500 text-right">{userRole}</span>
        </div>

        {/* Avatar and Dropdown */}
        <div className="relative">
          <Image
            src="/avatar.png"
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-full cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
              <button
                className="absolute top-2 right-2 text-sm text-white p-1 bg-red-500"
                onClick={() => setDropdownOpen(false)} // Close on X click
              >
                x
              </button>
              {userRole === "admin" && (
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleAddUser}
                >
                  Add User
                </button>
              )}
              {userRole === "admin" || userRole === "instructor" ? (
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleNavigateAdminPage}
                >
                  Admin Dashboard
                </button>
              ) : null}
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => toast.info("Profile Clicked!", { position: "top-right" })}
              >
                Profile
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => toast.info("Settings Clicked!", { position: "top-right" })}
              >
                Settings
              </button>
              <button
                className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default Navbar;
