// app/profile/page.tsx
import { getProfile, logoutAction } from '../../serveraction/action';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// PASTIKAN ADA KATA 'export default' DI SINI
export default async function Profile() {
  const user = await getProfile();

  // Jika belum login, otomatis dialihkan kembali ke halaman login
  if (!user) {
    redirect('/login');
  }

  async function handleLogout() {
    'use server';
    await logoutAction();
    redirect('/login'); // Setelah logout, tendang ke halaman login
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <nav style={{ marginBottom: '20px' }}>
        <Link href="/">🏠 Kembali ke Beranda (List Produk)</Link>
      </nav>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9', color: '#000' }}>
        <h2 style={{ marginTop: '0px' }}>👤 Profile User Active</h2>
        <hr style={{ margin: '15px 0', border: '0.5px solid #ddd' }} />
        <p><strong>Nama Akun:</strong> {user.username}</p>
        <p><strong>Hak Akses System:</strong> {user.role}</p>
        <p><strong>Status Autentikasi:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{user.status}</span></p>
        
        <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#eaeaea', borderRadius: '5px', wordBreak: 'break-all' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Token Cookie Server:</span>
          <p style={{ fontSize: '11px', color: '#666', margin: '5px 0 0 0' }}>{user.token}</p>
        </div>

        <form action={handleLogout} style={{ marginTop: '25px' }}>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Keluar dari Akun (Logout)
          </button>
        </form>
      </div>
    </div>
  );
}
