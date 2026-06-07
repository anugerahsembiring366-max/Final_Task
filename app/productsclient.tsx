'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export default function ProductsClient(props: {
  currentSearch: string;
  currentPage: number;
  itemsLimit: number;
}) {
  const { currentSearch, currentPage, itemsLimit } = props;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setLoadError('');

        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`Gagal ambil produk (${res.status}): ${t}`);
        }

        const data = (await res.json()) as Product[];
        if (!cancelled) setAllProducts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!cancelled) setLoadError(e?.message || 'Gagal memuat produk');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!currentSearch) return allProducts;
    const q = currentSearch.toLowerCase();
    return allProducts.filter((p) => p.title.toLowerCase().includes(q));
  }, [allProducts, currentSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsLimit));

  const products = useMemo(() => {
    const safePage = Math.min(Math.max(currentPage, 1), totalPages);
    const startIndex = (safePage - 1) * itemsLimit;
    return filteredProducts.slice(startIndex, startIndex + itemsLimit);
  }, [filteredProducts, currentPage, itemsLimit, totalPages]);

  if (loading) {
    return (
      <div style={{ padding: '20px 0', textAlign: 'center', color: '#666' }}>
        Memuat produk dari API...
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ padding: '20px 0', textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
        {loadError}
      </div>
    );
  }

  return (
    <>
      {/* List Produk Menyusun ke Bawah */}
      {products.length === 0 ? (
        <div style={{ padding: '5px', textAlign: 'center', color: '#666', margin: '40px 0' }}>
          <h3>❌ Produk "{currentSearch}" tidak ditemukan.</h3>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ccc',
                  padding: '15px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#fff',
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: '80px', height: '80px', objectFit: 'contain', flexShrink: 0 }}
                />
                <div style={{ flex: 1, marginLeft: '20px', marginRight: '20px' }}>
                  <h3 style={{ fontSize: '15px', margin: '0 0 5px 0', color: '#000', fontWeight: '600' }}>
                    {product.title}
                  </h3>
                  <p style={{ fontWeight: 'bold', color: '#e44d26', margin: 0 }}>${product.price}</p>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#777',
                      backgroundColor: '#eee',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginTop: '5px',
                    }}
                  >
                    {product.category}
                  </span>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Link
                    href={`/product/${product.id}`}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#0070f3',
                      color: 'white',
                      padding: '10px 20px',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    Detail Produk
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Navigasi Pagination */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '15px',
              marginTop: '20px',
              borderTop: '1px solid #eee',
              paddingTop: '20px',
            }}
          >
            {currentPage > 1 ? (
              <Link
                href={`/?search=${encodeURIComponent(currentSearch)}&page=${currentPage - 1}`}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: '#0070f3',
                  fontWeight: 'bold',
                }}
              >
                ⬅️ Sebelum
              </Link>
            ) : (
              <span style={{ padding: '8px 16px', border: '1px solid #eee', borderRadius: '4px', color: '#ccc' }}>
                ⬅️ Sebelum
              </span>
            )}

            <span style={{ color: '#000', fontWeight: 'bold' }}>
              Halaman {Math.min(Math.max(currentPage, 1), totalPages)} dari {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={`/?search=${encodeURIComponent(currentSearch)}&page=${currentPage + 1}`}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: '#0070f3',
                  fontWeight: 'bold',
                }}
              >
                Selanjutnya ➡️
              </Link>
            ) : (
              <span style={{ padding: '8px 16px', border: '1px solid #eee', borderRadius: '4px', color: '#ccc' }}>
                Selanjutnya ➡️
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}