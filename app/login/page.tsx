// app/login/page.tsx
'use client';

import { saveLoginToCookie } from '@/serveraction/action';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  const router = useRouter();

  // Ambil 10 data user dari API langsung di browser (client), bukan server action
  useEffect(() => {
    fetch('https://fakestoreapi.com/users')
      .then((res) => res.json())
      .then((data) => setAvailableUsers(Array.isArray(data) ? data.slice(0, 10) : []))
      .catch(() => console.log('Gagal memuat data user'));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const username = (formData.get('username')?.toString() || '').trim();
    const password = (formData.get('password')?.toString() || '').trim();

    try {
      // LOGIN ke fakestore dilakukan di CLIENT (browser)
      const res = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.text();
        setErrorMsg(`Login gagal (${res.status}): ${err}`);
        return;
      }

      const data = await res.json();

      if (!data?.token) {
        setErrorMsg('Login gagal: token tidak ada di response API.');
        return;
      }

      // Simpan token ke httpOnly cookie via server action (tidak call API luar)
      await saveLoginToCookie(data.token, username);

      router.push('/');
      router.refresh();
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat login.');
    }
  }

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '400px',
        margin: '50px auto',
        fontFamily: 'sans-serif',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      }}
    >
      <h2 style={{ marginTop: '0px', color: '#333' }}>🔑 Login User</h2>

      {errorMsg && (
        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Kolom Input Username */}
        <div style={{ marginBottom: '10px' }}>
          <label
            style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            defaultValue="mor_2314"
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              color: '#000',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Kolom Input Password */}
        <div style={{ marginBottom: '10px' }}>
          <label
            style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}
          >
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            defaultValue="83r5^_"
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              color: '#000',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Kotak Centang Tampilkan Password */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="tampilkanPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
          />
          <label
            htmlFor="tampilkanPassword"
            style={{ fontSize: '14px', color: '#555', cursor: 'pointer', userSelect: 'none' }}
          >
            Tampilkan Password
          </label>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            marginBottom: '20px',
          }}
        >
          Masuk Sekarang
        </button>
      </form>

      {/* Checkbox tampilkan daftar user */}
      <div
        style={{
          paddingTop: '15px',
          borderTop: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '15px',
        }}
      >
        <input
          type="checkbox"
          id="tampilkanDaftarUser"
          checked={showUserList}
          onChange={() => setShowUserList(!showUserList)}
          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
        />
        <label
          htmlFor="tampilkanDaftarUser"
          style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Tampilkan 10 Akun Testing Resmi API
        </label>
      </div>

      {showUserList && (
        <div style={{ paddingLeft: '5px' }}>
          {availableUsers.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
              Memuat akun testing dari API...
            </p>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '180px',
                overflowY: 'auto',
                paddingRight: '5px',
              }}
            >
              {availableUsers.map((u: any) => (
                <div
                  key={u.id}
                  style={{
                    background: '#f5f5f5',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#333',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <strong>Nama:</strong>{' '}
                  {u.name ? `${u.name.firstname} ${u.name.lastname}` : u.email} <br />
                  <strong>Username:</strong>{' '}
                  <code
                    style={{
                      background: '#fff',
                      padding: '2px 4px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                    }}
                  >
                    {u.username}
                  </code>{' '}
                  | <strong>Password:</strong>{' '}
                  <code
                    style={{
                      background: '#fff',
                      padding: '2px 4px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                    }}
                  >
                    {u.password}
                  </code>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}