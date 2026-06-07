// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { clearCartAction } from '@/serveraction/action';
import Link from 'next/link';

export default function Checkout() {
  const [mainCategory, setMainCategory] = useState('bank');
  const [specificMethod, setSpecificMethod] = useState('Mandiri Virtual Account');
  const [status, setStatus] = useState<'pending' | 'show_qris' | 'success'>('pending');

  const handleCategoryChange = (category: string) => {
    setMainCategory(category);
    if (category === 'bank') setSpecificMethod('Mandiri Virtual Account');
    if (category === 'ewallet') setSpecificMethod('GoPay');
    if (category === 'qris') setSpecificMethod('QRIS Dinamis');
  };

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mainCategory === 'qris') {
      setStatus('show_qris');
    } else {
      await clearCartAction();
      setStatus('success');
    }
  }

  async function handleQrisPaid() {
    await clearCartAction();
    setStatus('success');
  }

  return (
    <div style={{ padding: '20px', maxWidth: '450px', margin: '40px auto', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
      
      {/* KONDISI 1: FORM PEMILIHAN METODE */}
      {status === 'pending' && (
        <form onSubmit={handlePaymentSubmit}>
          <h2 style={{ color: '#000', marginTop: '0px' }}>💳 Checkout Payment</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Silakan tentukan jenis pembayaran Anda.</p>
          
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#000' }}>Pilih Tipe Pembayaran:</label>
            <select value={mainCategory} onChange={(e) => handleCategoryChange(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#000', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' }}>
              <option value="bank">🏦 Bank Transfer (Virtual Account)</option>
              <option value="ewallet">📱 E-Wallet (Dompet Digital)</option>
              <option value="qris">⚡ Scan QRIS</option>
            </select>
          </div>

          {mainCategory === 'bank' && (
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#000' }}>Pilih Bank Virtual Account:</label>
              <select value={specificMethod} onChange={(e) => setSpecificMethod(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #0070f3', color: '#000', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' }}>
                <option value="Mandiri Virtual Account">Mandiri Virtual Account (VA)</option>
                <option value="BCA Virtual Account">BCA Virtual Account (VA)</option>
                <option value="BRI Virtual Account">BRI Virtual Account (VA)</option>
                <option value="BNI Virtual Account">BNI Virtual Account (VA)</option>
              </select>
            </div>
          )}

          {mainCategory === 'ewallet' && (
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#000' }}>Pilih Aplikasi E-Wallet:</label>
              <select value={specificMethod} onChange={(e) => setSpecificMethod(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ff9900', color: '#000', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' }}>
                <option value="GoPay">GoPay</option>
                <option value="OVO">OVO</option>
                <option value="Dana">Dana</option>
                <option value="ShopeePay">ShopeePay</option>
              </select>
            </div>
          )}

          {mainCategory === 'qris' && (
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#000' }}>Pilih Opsi QRIS:</label>
              <select value={specificMethod} onChange={(e) => setSpecificMethod(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #28a745', color: '#000', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' }}>
                <option value="QRIS Dinamis">Scan QRIS GPN (Otomatis)</option>
              </select>
            </div>
          )}

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            Konfirmasi & Bayar Sekarang
          </button>

          {/* TOMBOL KEMBALI KE KERANJANG BELANJA */}
          <Link href="/cart" style={{ display: 'block', width: '100%', padding: '12px', boxSizing: 'border-box', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            ← Kembali ke Keranjang
          </Link>
        </form>
      )}

      {/* KONDISI 2: TAMPILAN GAMBAR QRIS INTERAKTIF */}
      {status === 'show_qris' && (
        <div style={{ padding: '10px' }}>
          <h3 style={{ color: '#000', margin: '0 0 10px 0' }}>📸 Scan Kode QRIS Anda</h3>
          <p style={{ color: '#555', fontSize: '13px', marginBottom: '15px' }}>Silakan scan QR Code di bawah ini menggunakan aplikasi E-Wallet atau Mobile Banking Anda.</p>
          
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '2px dashed #ccc', display: 'inline-block', marginBottom: '15px' }}>
            <img 
              src="https://qrserver.com" 
              alt="QRIS QR Code Simulator" 
              style={{ width: '200px', height: '200px', display: 'block' }}
            />
            <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#d9534f', fontSize: '14px' }}>NMI: ID1020304050607</div>
          </div>
          
          <button onClick={handleQrisPaid} style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
            Saya Sudah Membayar 👍
          </button>

          {/* TOMBOL BATALKAN QRIS DAN KEMBALI KE MENU CHECKOUT UTAMA */}
          <button type="button" onClick={() => setStatus('pending')} style={{ width: '100%', padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            ❌ Batalkan Pembayaran
          </button>
        </div>
      )}

      {/* KONDISI 3: HALAMAN PEMBAYARAN BERHASIL */}
      {status === 'success' && (
        <div style={{ padding: '20px' }}>
          <h1 style={{ fontSize: '50px', margin: 0 }}>🎉</h1>
          <h2 style={{ color: 'green', marginTop: '10px' }}>Pembayaran Berhasil!</h2>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.5' }}>
            Simulasi transaksi via <strong>{specificMethod}</strong> sukses diverifikasi oleh sistem simulator.
          </p>
          <div style={{ marginTop: '25px' }}>
            <Link href="/" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
