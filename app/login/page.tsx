
'use client';

import { useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

// Definisikan tipe untuk respons API berdasarkan spesifikasi DummyJSON
interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

// Definisikan tipe untuk respons error
interface ErrorResponse {
  message?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [response, setResponse] = useState<LoginResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res: AxiosResponse<LoginResponse> = await axios.post(
        'https://dummyjson.com/auth/login',
        {
          username,
          password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setResponse(res.data);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-black">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Masukkan username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Masukkan password"
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2 px-4 bg-gray-200 text-black font-semibold rounded-md shadow ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
            }`}
          >
            {loading ? 'Sedang login...' : 'Login'}
          </button>
        </div>
        {response && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            <p>
              <strong>Berhasil!</strong>
            </p>
            <p>ID: {response.id}</p>
            <p>Username: {response.username}</p>
            <p>Email: {response.email}</p>
            <p>Nama Depan: {response.firstName}</p>
            <p>Nama Belakang: {response.lastName}</p>
            <p>Jenis Kelamin: {response.gender}</p>
            <p>Access Token: {response.accessToken.slice(0, 20)}...</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            <p>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
