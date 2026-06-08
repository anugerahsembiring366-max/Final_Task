'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export default function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErr('');

        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`Gagal ambil detail (${res.status}): ${t}`);
        }

        const data = (await res.json()) as Product;
        if (!cancelled) setProduct(data);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || 'Gagal memuat detail produk');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p style={{ color: '#666' }}>Memuat detail produk...</p>;
  if (err) return <p style={{ color: 'red', fontWeight: 'bold' }}>{err}</p>;
  if (!product) return <p>Produk tidak ditemukan.</p>;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, background: '#fff' }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <img src={product.image} alt={product.title} style={{ width: 140, height: 140, objectFit: 'contain' }} />
        <div>
          <h2 style={{ margin: 0, color: '#000' }}>{product.title}</h2>
          <p style={{ fontWeight: 'bold', color: '#e44d26' }}>${product.price}</p>
          <div style={{ fontSize: 12, color: '#555' }}>
            <span style={{ background: '#eee', padding: '2px 6px', borderRadius: 4 }}>{product.category}</span>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 16, color: '#111' }}>{product.description}</p>
    </div>
  );
}