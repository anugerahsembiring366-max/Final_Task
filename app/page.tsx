// app/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getProfile } from '@/serveraction/action';
import ProductsClient from './productsclient';

interface HomeProps {
  searchParams: { search?: string; page?: string } | Promise<{ search?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Proteksi halaman: Jika belum login, lempar otomatis ke /login
  const user = await getProfile();
  if (!user) redirect('/login');

  const resolvedParams = await searchParams;
  const currentSearch = resolvedParams.search || '';
  const currentPage = parseInt(resolvedParams.page || '1') || 1;
  const itemsLimit = 6;

  // Form search tetap server (cuma redirect, tidak call API luar)
  async function handleSearchSubmit(formData: FormData) {
    'use server';
    const query = (formData.get('query') as string) || '';
    redirect(`/?search=${encodeURIComponent(query)}&page=1`);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        <Link href="/">🏠 Beranda</Link> |<Link href="/profile">👤 Profile ({user.username})</Link> |<Link href="/cart">🛒 Keranjang</Link>
      </nav>

      <div style={{ background: '#e2f0d9', padding: '10px 15px', borderRadius: '5px', marginBottom: '20px', color: '#385723' }}>
        👋 Selamat datang kembali, <strong>{user.username}</strong>!
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
        <h1 style={{ margin: 0 }}>List Produk Toko Online</h1>

        <form action={handleSearchSubmit} style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text"
            name="query"
            defaultValue={currentSearch}
            placeholder="Cari nama produk..."
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', width: '220px', color: '#000' }}
          />
          <button
            type="submit"
            style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔍 Cari
          </button>

          {currentSearch && (
            <Link
              href="/"
              style={{ padding: '8px 10px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Produk diambil dari CLIENT (browser) supaya tidak error di Vercel */}
      <ProductsClient currentSearch={currentSearch} currentPage={currentPage} itemsLimit={itemsLimit} />
    </div>
  );
}