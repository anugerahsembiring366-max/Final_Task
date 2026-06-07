// app/login/page.tsx
'use client';

import { loginAction, getAllUsers } from '@/serveraction/action';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  
  // 1. State untuk mengontrol Tampilkan / Sembunyikan Password
  const [showPassword, setShowPassword] = useState(false);

  // 2. STATE BARU UNTUK MENGONTROL TAMPILKAN / SEMBUNYIKAN DAFTAR USER API
  const [showUserList, setShowUserList] = useState(false);
  
  const router = useRouter();

  // Mengambil 10 data user asli dari API saat halaman dimuat
  useEffect(() => {
    getAllUsers().then((data) => {
      setAvailableUsers(data);
    }).catch(() => {
      console.log("Gagal memuat data user");
    });
  }, []);

  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData);
    if (result.success) {
      router.push('/');
      router.refresh();
    } else {
      setErrorMsg(result.message);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginTop: '0px', color: '#333' }}>🔑 Login User</h2>
      
      {errorMsg && <p style={{ color: 'red', fontWeight: 'bold', fontSize: '14px' }}>{errorMsg}</p>}
      
      <form action={handleSubmit}>
        {/* Kolom Input Username */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>Username</label>
          <input type="text" name="username" defaultValue="mor_2314" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#000', boxSizing: 'border-box' }} />
        </div>
        
        {/* Kolom Input Password */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            defaultValue="83r5^_" 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#000', boxSizing: 'border-box' }} 
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
          <label htmlFor="tampilkanPassword" style={{ fontSize: '14px', color: '#555', cursor: 'pointer', userSelect: 'none' }}>
            Tampilkan Password
          </label>
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
          Masuk Sekarang
        </button>
      </form>

      {/* 3. KOTAK CENTANG BARU UNTUK SEMBUNYIKAN / TAMPILKAN DAFTAR USER */}
      <div style={{ paddingTop: '15px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
        <input 
          type="checkbox" 
          id="tampilkanDaftarUser" 
          checked={showUserList}
          onChange={() => setShowUserList(!showUserList)} // Membalikkan true/false saat diklik
          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
        />
        <label htmlFor="tampilkanDaftarUser" style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}>
          Tampilkan 10 Akun Testing Resmi API
        </label>
      </div>

      {/* 4. LOGIKA KONDISIONAL: DAFTAR HANYA AKAN DI-RENDER JIKA showUserList BERNILAI TRUE */}
      {showUserList && (
        <div style={{ paddingLeft: '5px' }}>
          {availableUsers.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>Memuat akun testing dari API...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px' }}>
              {availableUsers.map((u: any) => (
                <div key={u.id} style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', fontSize: '12px', color: '#333', border: '1px solid #e0e0e0' }}>
                  <strong>Nama:</strong> {u.name ? `${u.name.firstname} ${u.name.lastname}` : u.email} <br />
                  <strong>Username:</strong> <code style={{ background: '#fff', padding: '2px 4px', border: '1px solid #ddd', borderRadius: '3px' }}>{u.username}</code> | 
                  <strong> Password:</strong> <code style={{ background: '#fff', padding: '2px 4px', border: '1px solid #ddd', borderRadius: '3px' }}>{u.password}</code>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
