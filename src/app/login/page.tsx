'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/login");
      return;
    }

    const token = JSON.parse(authToken);
    if (token.role === "user") {
      toast.info("You do not have permission to access the admin page.", {
        position: "top-right",
        autoClose: 1500,
      });
      router.push("/");
    } else if (token.role === "admin") {
      toast.info("Welcome to the admin page", {
        position: "top-right",
        autoClose: 1500,
      });
      router.push("/admin");
    }
  }, [router]);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: users } = await axios.get("http://localhost:5000/users");
      const user = users.find(
        (user: any) => user.email === email && user.password === password
      );

      if (user) {
        localStorage.setItem("authToken", JSON.stringify({ id: user.id, role: user.role, name: user.name, category: user.category }));
        setTimeout(() => {
          toast.success("Logged in successfully!", {
            position: "top-right",
          });
        }, 1000);

        setTimeout(() => {
          if (user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }, 1500);

      } else {
        setError("Invalid email or password");

        setTimeout(() => {
          toast.error("Invalid email or password", {
            position: "top-right",
          });
        }, 2000);
      }
    } catch (err) {
      setError("Failed to connect to the server");
      // Delay the error toast by 2 seconds
      setTimeout(() => {
        toast.error("Failed to connect to the server", {
          position: "top-right",
        });
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-200 py-20 p-4 md:p-20 lg:p-32">
      <div className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg mx-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-700 mb-6">Please sign in to your account</p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </form>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
