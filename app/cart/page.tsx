// app/cart/page.tsx
import { getCart, updateQuantityAction, getProfile } from '../../serveraction/action';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Cart() {
  // Proteksi halaman: jika belum login, tendang ke halaman login
  const user = await getProfile();
  if (!user) {
    redirect('/login');
  }

  const cartItems = await getCart();
  const totalHarga = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <nav style={{ marginBottom: '20px' }}>
        <Link href="/">🏠 Kembali Belanja</Link> | <Link href="/profile">👤 Profile</Link>
      </nav>
      <h1>🛒 Keranjang Belanja Anda</h1>
      
      {cartItems.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', marginTop: '20px' }}>
          <p style={{ color: '#777', margin: 0 }}>Keranjang belanja Anda masih kosong.</p>
          <Link href="/" style={{ display: 'inline-block', marginTop: '15px', color: '#0070f3', textDecoration: 'underline' }}>
            Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '15px 0' }}>
              <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
              <div style={{ flex: 1, marginLeft: '20px' }}>
                <h3 style={{ fontSize: '15px', margin: '0 0 5px 0', color: '#000' }}>{item.title}</h3>
                <p style={{ color: '#e44d26', margin: 0, fontWeight: 'bold' }}>${item.price}</p>
              </div>
              
              {/* FITUR PERUBAHAN QUANTITY & TOMBOL HAPUS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Tombol Minus */}
                <form action={async () => { 'use server'; await updateQuantityAction(item.id, -1); }}>
                  <button type="submit" style={{ padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #ccc' }}>-</button>
                </form>
                
                {/* Angka Quantity */}
                <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center', color: '#000' }}>{item.quantity}</span>
                
                {/* Tombol Plus */}
                <form action={async () => { 'use server'; await updateQuantityAction(item.id, 1); }}>
                  <button type="submit" style={{ padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #ccc' }}>+</button>
                </form>

                {/* TOMBOL HAPUS BARANG (Menghapus instan dengan mengirimkan minus sebanyak kuantitas yang ada) */}
                <form action={async () => { 'use server'; await updateQuantityAction(item.id, -item.quantity); }} style={{ marginLeft: '10px' }}>
                  <button type="submit" style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    🗑️ Hapus
                  </button>
                </form>
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'right', marginTop: '30px' }}>
            <h2 style={{ color: '#000' }}>Total Tagihan: <span style={{ color: '#e44d26' }}>${totalHarga.toFixed(2)}</span></h2>
            <Link href="/checkout" style={{ display: 'inline-block', padding: '12px 30px', backgroundColor: '#ff9900', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold', marginTop: '10px' }}>
              Checkout →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
