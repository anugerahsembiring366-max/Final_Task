// serveraction/action.ts
'use server';

import { cookies } from 'next/headers';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

// 1. Mengambil Semua Produk dengan Fitur Search & Pagination langsung di Server
export async function getProducts(
  search: string = "",
  page: number = 1,
  limit: number = 8 // Menampilkan 8 produk per halaman
): Promise<{ products: Product[]; totalPages: number }> {
  const res = await fetch('https://fakestoreapi.com/products', { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal mengambil data produk dari API');
  
  let allProducts: Product[] = await res.json();

  // Logika Filter Search (Pencarian nama produk)
  if (search) {
    allProducts = allProducts.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Hitung total halaman berdasarkan hasil filter pencarian
  const totalPages = Math.ceil(allProducts.length / limit);

  // Logika Pagination (Memotong daftar produk sesuai nomor halaman)
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    totalPages: totalPages || 1, // Minimal halaman adalah 1 jika data kosong
  };
}

// 2. Mengambil Detail Satu Produk Langsung dari API
export async function getProductDetail(id: string): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!res.ok) throw new Error('Gagal mengambil detail produk dari API');
  return res.json();
}

// 3. Login User & Simpan Token di Cookie via API (Sudah Diperbaiki Endpoint-nya)
export async function loginAction(formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    // SEKARANG URL SUDAH DIKOREKSI MENJADI LENGKAP KE /auth/login
    const res = await fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      return { success: false, message: 'Username atau password salah.' };
    }

    const data = await res.json();
    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set('user_token', data.token, { httpOnly: true });
      cookieStore.set('username', username as string, { httpOnly: true });
      return { success: true, message: 'Login Berhasil!' };
    }
    return { success: false, message: 'Gagal mendapatkan token.' };
  } catch {
    return { success: false, message: 'Terjadi kesalahan pada jaringan atau server API.' };
  }
}

// 4. Logout (Hapus Cookie)
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('user_token');
  cookieStore.delete('username');
  cookieStore.delete('shopping_cart');
}

// 5. Mengambil Data Profil User dari Cookie
export async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get('user_token')?.value;
  const username = cookieStore.get('username')?.value;

  if (!token) return null;
  return { username, role: 'Customer', status: 'Active Account', token };
}

// 6. Mengambil Data Keranjang Belanja dari Cookie Spesifik per User
export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value || 'guest'; // Ambil username aktif
  
  // Nama cookie disesuaikan dengan nama user yang login
  const cartData = cookieStore.get(`shopping_cart_${username}`)?.value;
  return cartData ? JSON.parse(cartData) : [];
}

// 7. Tambah Produk ke Keranjang Belanja Spesifik per User
export async function addToCartAction(product: Product) {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value || 'guest';
  const currentCart = await getCart();
  
  const existingItem = currentCart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    currentCart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  // Simpan ke cookie khusus milik user tersebut
  cookieStore.set(`shopping_cart_${username}`, JSON.stringify(currentCart));
}

// 8. Perubahan Quantity Pembelian Spesifik per User
export async function updateQuantityAction(id: number, amount: number) {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value || 'guest';
  let currentCart = await getCart();

  currentCart = currentCart.map((item) => {
    if (item.id === id) {
      const newQty = item.quantity + amount;
      return { ...item, quantity: newQty };
    }
    return item;
  }).filter((item) => item.quantity > 0);

  // Update ke cookie khusus milik user tersebut
  cookieStore.set(`shopping_cart_${username}`, JSON.stringify(currentCart));
}

// 9. Kosongkan Keranjang setelah Checkout Spesifik per User
export async function clearCartAction() {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value || 'guest';
  cookieStore.delete(`shopping_cart_${username}`);
}

export async function getAllUsers(): Promise<ApiUser[]> {
  try {
    // Memastikan endpoint URL mengarah lengkap ke /users
    const res = await fetch('https://fakestoreapi.com/users', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json(); 
  } catch {
    return [];
  }
}