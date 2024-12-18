'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  photo?: string;
};

const AdminUserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {

      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
      setLoading(false)
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center mt-4">Loading users...</p>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-4">All Users</h1>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border border-gray-200">Photo</th>
            <th className="p-3 border border-gray-200">Name</th>
            <th className="p-3 border border-gray-200">Email</th>
            <th className="p-3 border border-gray-200">Role</th>
            <th className="p-3 border border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center hover:bg-gray-50">
              <td className="p-3 border border-gray-200">
                {user.photo ? (
                  <Image
                    src={user.photo}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                )}
              </td>
              <td className="p-3 border border-gray-200">{user.name}</td>
              <td className="p-3 border border-gray-200">{user.email}</td>
              <td className="p-3 border border-gray-200 capitalize">{user.role}</td>
              <td className="p-3 border border-gray-200">
                <div className="flex justify-center gap-2">
                  <Link href={`/list/students/${user.id}`}>
                    <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => console.log(`Edit user ${user.id}`)}
                    className="px-3 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => console.log(`Delete user ${user.id}`)}
                    className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserPage;
