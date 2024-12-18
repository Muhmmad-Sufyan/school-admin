'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  photo?: string;
};

const UserViewPage = ({params}:any) => {
  // console.log('sagadsgkfadslgflsdhgflhdsflhdsglfhads' , params);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params.id;

  const [users, setUsers] = useState<User[]>([]); 
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {

      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
      setLoading(false)
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0 && userId) {
      const selectedUser = users.find((user) => user.id.toString() === userId);
      setUser(selectedUser || null);
    }
  }, [users, userId]);

  if (loading) {
    return <p className="text-center mt-4">Loading user details...</p>;
  }

  if (!user) {
    return <p className="text-center mt-4">User not found.</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <button
        onClick={() => router.push("/list/students")}
        className="text-blue-500 hover:underline mb-4"
      >
        &larr; Back to Users
      </button>
      <div className="flex flex-col items-center">
        <Image
          src={user.photo || "/placeholder.png"}
          alt={user.name}
          width={120}
          height={120}
          className="rounded-full object-cover mb-4"
        />
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-500">{user.role}</p>
        <div className="w-full mt-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Email:</span>
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex justify-between mb-2">
              <span className="font-medium">Phone:</span>
              <span>{user.phone}</span>
            </div>
          )}
          {user.address && (
            <div className="flex justify-between mb-2">
              <span className="font-medium">Address:</span>
              <span>{user.address}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => router.push(`/admin/users/edit?id=${user.id}`)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Edit User
        </button>
      </div>
    </div>
  );
};

export default UserViewPage;
