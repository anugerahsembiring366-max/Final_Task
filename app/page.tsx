// app/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getProducts, getProfile } from '@/serveraction/action';

interface HomeProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // 1. Proteksi halaman: Jika belum login, lempar otomatis ke /login
  const user = await getProfile();
  if (!user) {
    redirect('/login');
  }

  // 2. Ambil parameter pencarian dan halaman dari URL
  const resolvedParams = await searchParams;
  const currentSearch = resolvedParams.search || "";
  const currentPage = parseInt(resolvedParams.page || "1") || 1;
  const itemsLimit = 6; // Menampilkan 6 produk per halaman

  // 3. Ambil data dari Server Action
  const { products, totalPages } = await getProducts(currentSearch, currentPage, itemsLimit);

  // 4. Fungsi Server Action untuk form pencarian
  async function handleSearchSubmit(formData: FormData) {
    'use server';
    const query = formData.get('query') as string;
    redirect(`/?search=${encodeURIComponent(query)}&page=1`);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Menu Navigasi Atas */}
      <nav style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        <Link href="/">🏠 Beranda</Link> | 
        <Link href="/profile">👤 Profile ({user.username})</Link> | 
        <Link href="/cart">🛒 Keranjang</Link>
      </nav>

      <div style={{ background: '#e2f0d9', padding: '10px 15px', borderRadius: '5px', marginBottom: '20px', color: '#385723' }}>
        👋 Selamat datang kembali, <strong>{user.username}</strong>!
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
        <h1 style={{ margin: 0 }}>List Produk Toko Online</h1>
        
        {/* Form Pencarian */}
        <form action={handleSearchSubmit} style={{ display: 'flex', gap: '5px' }}>
          <input 
            type="text" 
            name="query" 
            defaultValue={currentSearch} 
            placeholder="Cari nama produk..." 
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', width: '220px', color: '#000' }}
          />
          <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            🔍 Cari
          </button>
          {currentSearch && (
            <Link href="/" style={{ padding: '8px 10px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}>
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* List Produk Menyusun ke Bawah */}
      {products.length === 0 ? (
        <div style={{ padding: '5px', textAlign: 'center', color: '#666', margin: '40px 0' }}>
          <h3>❌ Produk "{currentSearch}" tidak ditemukan.</h3>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            {products.map((product) => (
              <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                <img src={product.image} alt={product.title} style={{ width: '80px', height: '80px', objectFit: 'contain', flexShrink: 0 }} />
                <div style={{ flex: 1, marginLeft: '20px', marginRight: '20px' }}>
                  <h3 style={{ fontSize: '15px', margin: '0 0 5px 0', color: '#000', fontWeight: '600' }}>{product.title}</h3>
                  <p style={{ fontWeight: 'bold', color: '#e44d26', margin: 0 }}>${product.price}</p>
                  <span style={{ fontSize: '11px', color: '#777', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '5px' }}>{product.category}</span>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Link href={`/product/${product.id}`} style={{ display: 'inline-block', backgroundColor: '#0070f3', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Detail Produk
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Navigasi Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            {currentPage > 1 ? (
              <Link href={`/?search=${encodeURIComponent(currentSearch)}&page=${currentPage - 1}`} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>
                ⬅️ Sebelum
              </Link>
            ) : (
              <span style={{ padding: '8px 16px', border: '1px solid #eee', borderRadius: '4px', color: '#ccc', cursor: 'not-allowed' }}>
                ⬅️ Sebelum
              </span>
            )}

            <span style={{ color: '#000', fontWeight: 'bold' }}>
              Halaman {currentPage} dari {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link href={`/?search=${encodeURIComponent(currentSearch)}&page=${currentPage + 1}`} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>
                Selanjutnya ➡️
              </Link>
            ) : (
              <span style={{ padding: '8px 16px', border: '1px solid #eee', borderRadius: '4px', color: '#ccc', cursor: 'not-allowed' }}>
                Selanjutnya ➡️
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
