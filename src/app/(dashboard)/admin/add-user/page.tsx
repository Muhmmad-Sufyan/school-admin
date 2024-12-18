'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
    const [isAdminOrInstructor, setIsAdminOrInstructor] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            const token = JSON.parse(authToken);
            if (token.role === "admin") {
                setIsAdminOrInstructor(true);
            } else {
                toast.error("You must be an admin to access this page.", { position: "top-right" });
                router.push("/");  // Redirect non-admin users
            }
        } else {
            toast.error("You must be logged in to access this page.", { position: "top-right" });
            router.push("/login");  // Redirect if not logged in
        }
    }, [router]);

    useEffect(() => {
        if (isAdminOrInstructor) {
            const fetchUsers = async () => {
                try {
                    const response = await fetch('http://localhost:5000/users');
                    const data = await response.json();
                    setUsers(data);
                } catch (error) {
                    toast.error("Failed to fetch users.", { position: "top-right" });
                }
            };
            fetchUsers();
        }
    }, [isAdminOrInstructor]);

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const emailExists = users.some((user: { email: string }) => user.email === email);
        if (emailExists) {
            toast.error("User with this email already exists.", { position: "top-right" });
            return;
        }

        const newUser = {
            email,
            password,
            role,
            name,
            category
        };

        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("User created successfully!", { position: "top-right" });
                setEmail('');
                setPassword('');
                setRole('user');
                setName('');
                setCategory('');
                setUsers([...users, data]);
            } else {
                toast.error("Failed to create user. Please try again.", { position: "top-right" });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.", { position: "top-right" });
            console.error(error);
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("User deleted successfully.", { position: "top-right" });
                setUsers(users.filter(user => user.id !== id));
            } else {
                toast.error("Failed to delete user. Please try again.", { position: "top-right" });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.", { position: "top-right" });
            console.error(error);
        }
    };

    return (
        <section className="flex flex-col md:flex-row pt-6 gap-6 px-3">
            {/* Left side: User List */}
            <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Users List</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b py-2 px-4 text-left">Email</th>
                                <th className="border-b py-2 px-4 text-left">Role</th>
                                <th className="border-b py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="bg-gray-50 dark:bg-gray-700">
                                    <td className="border-b py-2 px-4">{user.email}</td>
                                    <td className="border-b py-2 px-4">{user.role}</td>
                                    <td className="border-b py-2 px-4">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right side: Add User Form */}
            <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New User</h2>
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="instructor">Instructor</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold rounded-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                    >
                        Create User
                    </button>
                </form>
            </div>

            <ToastContainer />
        </section>
    );
};

export default Page;
