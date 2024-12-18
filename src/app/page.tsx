'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  category: string;
}

const Homepage = () => {
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [checkOutTime, setCheckOutTime] = useState<string>('');
  const [savedCheckInTime, setSavedCheckInTime] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      router.push('/login');
    } else {
      const token = JSON.parse(authToken);

      const fetchUserData = async () => {
        try {
          const userResponse = await axios.get(
            `http://localhost:5000/users/${token.id}`
          );
          setUser(userResponse.data);

          const today = new Date().toISOString().split('T')[0];
          const timeResponse = await axios.get(
            `http://localhost:5000/timecount/${token.id}?date=${today}`
          );
          if (timeResponse.data && timeResponse.data.checkInTime) {
            setSavedCheckInTime(timeResponse.data.checkInTime);
            if (timeResponse.data.checkOutTime) {
              setCheckOutTime(timeResponse.data.checkOutTime);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchUserData();
    }
  }, [router]);

  const handleCheckIn = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      router.push('/login');
      return;
    }
    const token = JSON.parse(authToken);
    const now = new Date();
    const formattedTime = now.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    setCheckInTime(formattedTime);

    try {
      await axios.post('http://localhost:5000/timecount', {
        id: token.id,
        name: token.name,
        role: token.role,
        checkInTime: now.toISOString(),
      });
      setSavedCheckInTime(now.toISOString());
      alert('Check-in time saved successfully!');
    } catch (error) {
      console.error('Error saving check-in time:', error);
    }
  };

  const handleCheckOut = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      router.push('/login');
      return;
    }
    const token = JSON.parse(authToken);

    const now = new Date();
    const formattedTime = now.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    setCheckOutTime(formattedTime)

    try {
      const checkInDate = new Date(savedCheckInTime!);
      const diffInMillis = now.getTime() - checkInDate.getTime();
      const diffInHours = diffInMillis / (1000 * 3600);

      if (diffInHours < 8) {
        setMessage(
          'You are going early. Your work duration is less than 8 hours.'
        );
      } else {
        setMessage('');
      }

      const today = new Date().toISOString().split('T')[0];
      await axios.put(`http://localhost:5000/timecount/${token.id}?date=${today}`, {
        id: token.id,
        name: token.name,
        role: token.role,
        checkInTime: checkInTime,
        checkOutTime: formattedTime,
        diffInHours,
      });

      setCheckOutTime(formattedTime);
      alert('Check-out time saved successfully!');
    } catch (error) {
      console.error('Error saving check-out time:', error);
    }
  };


  return (
    <div className="p-4">
      <Navbar />
      <h1 className="text-2xl font-semibold text-center">Check-in/Check-out Form</h1>

      {user ? (
        <div className="mt-6 text-center">
          <p className="text-xl font-medium">Welcome, {user.name}!</p>
          <p className="text-lg text-gray-500">{user.category}</p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading user data...</p>
      )}

      {!savedCheckInTime ? (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleCheckIn}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
          >
            Check In
          </button>
        </div>
      ) : (
        <p className="text-center mt-4 text-green-500">
          Check-in time: {new Date(savedCheckInTime).toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </p>
      )}

      {savedCheckInTime && !checkOutTime && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleCheckOut}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
          >
            Check Out
          </button>
        </div>
      )}

      {checkOutTime && (
        <p className="text-center mt-4 text-green-500">
          Check-out time: {checkOutTime}
        </p>
      )}

      {message && <p className="text-red-500 text-center mt-4">{message}</p>}
    </div>
  );
};

export default Homepage;
