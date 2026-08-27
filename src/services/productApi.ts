import { PRICE_MULTIPLIER } from '@constants/student';

export type CategoryId = 'all' | 'food' | 'drink' | 'study';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
};

const API_URL = 'https://fakestoreapi.com/products?limit=8';

function mapCategory(raw: string) {
  const c = (raw || '').toLowerCase();
  if (c.includes('clothing')) return { id: 'study' as const, label: 'Học tập' };
  if (c.includes('jewel')) return { id: 'drink' as const, label: 'Nước' };
  return { id: 'food' as const, label: 'Đồ ăn' };
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const raw = await res.json();

  return (raw as any[]).map(it => {
    const cat = mapCategory(it.category);
    return {
      id: it.id,
      name: it.title,
      price: Math.round(it.price * PRICE_MULTIPLIER),
      image: it.image,
      description: it.description ?? '',
      category: cat.id,
      categoryLabel: cat.label,
    };
  });
}

export function formatVnd(n: number): string {
  try {
    return n.toLocaleString('vi-VN') + ' đ';
  } catch {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  }
}
