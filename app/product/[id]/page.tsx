// app/product/[id]/page.tsx
import { getProductDetail, addToCartAction } from '../../../serveraction/action';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductDetail(id);

  async function handleAddToCart() {
    'use server';
    await addToCartAction(product);
    redirect('/cart'); // Otomatis ke halaman keranjang belanja
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link href="/">← Kembali ke List Produk</Link>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', marginTop: '20px', textAlign: 'center' }}>
        <img src={product.image} alt={product.title} style={{ width: '250px', height: '250px', objectFit: 'contain', marginBottom: '20px' }} />
        <h1 style={{ fontSize: '22px' }}>{product.title}</h1>
        <p style={{ color: '#777', textTransform: 'uppercase', fontSize: '12px' }}>Kategori: {product.category}</p>
        <p style={{ textAlign: 'justify', margin: '20px 0', lineHeight: '1.5' }}>{product.description}</p>
        <h2 style={{ color: '#e44d26', marginBottom: '20px' }}>Harga: ${product.price}</h2>
        
        <form action={handleAddToCart}>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            🛒 Tambah Produk ke Keranjang
          </button>
        </form>
      </div>
    </div>
  );
}
