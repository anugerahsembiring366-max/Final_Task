import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getProfile } from '@/serveraction/action';
import ProductDetailClient from './productdetailclient';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const user = await getProfile();
  if (!user) redirect('/login');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        <Link href="/">🏠 Beranda</Link> | 
        <Link href="/profile">👤 Profile ({user.username})</Link> | 
        <Link href="/cart">🛒 Keranjang</Link>
      </nav>

      <h1 style={{ marginTop: 0 }}>Detail Produk</h1>

      {/* Detail diambil dari CLIENT supaya tidak error di Vercel */}
      <ProductDetailClient id={params.id} />
    </div>
  );
}