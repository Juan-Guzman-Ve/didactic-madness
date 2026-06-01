import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  sku: string;
  categoryId: number;
  name: string;
  description: string;
  brand: string;
  model?: string;
  price: number; // stored in cents
  stock: number;
  specifications?: Record<string, unknown>;
  status: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  sort?: string;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

const LOW_STOCK_THRESHOLD = 5;

type ImageSpec = {
  title: string;
  subtitle: string;
  background: string;
  accent: string;
  accent2: string;
  motif: 'gpu' | 'cpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooling';
};

const CATEGORY_IMAGE_SPECS: Record<string, ImageSpec> = {
  'graphics-cards': {
    title: 'Graphics Cards',
    subtitle: 'High-end GPUs',
    background: '#0f172a',
    accent: '#38bdf8',
    accent2: '#22c55e',
    motif: 'gpu',
  },
  processors: {
    title: 'Processors',
    subtitle: 'CPU performance',
    background: '#111827',
    accent: '#f59e0b',
    accent2: '#f97316',
    motif: 'cpu',
  },
  motherboards: {
    title: 'Motherboards',
    subtitle: 'System backbone',
    background: '#0b1324',
    accent: '#8b5cf6',
    accent2: '#06b6d4',
    motif: 'motherboard',
  },
  memory: {
    title: 'Memory',
    subtitle: 'DDR5 modules',
    background: '#0f172a',
    accent: '#ec4899',
    accent2: '#8b5cf6',
    motif: 'ram',
  },
  storage: {
    title: 'Storage',
    subtitle: 'Fast NVMe drives',
    background: '#111827',
    accent: '#14b8a6',
    accent2: '#0ea5e9',
    motif: 'storage',
  },
  'power-supplies': {
    title: 'Power Supplies',
    subtitle: 'Stable wattage',
    background: '#111827',
    accent: '#f59e0b',
    accent2: '#ef4444',
    motif: 'psu',
  },
  cases: {
    title: 'Cases',
    subtitle: 'Airflow and design',
    background: '#101827',
    accent: '#60a5fa',
    accent2: '#94a3b8',
    motif: 'case',
  },
  cooling: {
    title: 'Cooling',
    subtitle: 'Thermal control',
    background: '#0f172a',
    accent: '#22c55e',
    accent2: '#06b6d4',
    motif: 'cooling',
  },
};

const PRODUCT_IMAGE_SPECS: Record<string, ImageSpec> = {
  'GPU-NVIDIA-4090': {
    title: 'RTX 4090',
    subtitle: 'NVIDIA GeForce',
    background: '#0b1020',
    accent: '#76b900',
    accent2: '#22d3ee',
    motif: 'gpu',
  },
  'GPU-AMD-7900XTX': {
    title: 'RX 7900 XTX',
    subtitle: 'AMD Radeon',
    background: '#111827',
    accent: '#f97316',
    accent2: '#ef4444',
    motif: 'gpu',
  },
  'CPU-INTEL-13900K': {
    title: 'Core i9-13900K',
    subtitle: 'Intel Processor',
    background: '#111827',
    accent: '#38bdf8',
    accent2: '#94a3b8',
    motif: 'cpu',
  },
  'CPU-AMD-7950X': {
    title: 'Ryzen 9 7950X',
    subtitle: 'AMD Ryzen',
    background: '#111827',
    accent: '#f97316',
    accent2: '#22c55e',
    motif: 'cpu',
  },
  'MB-ASUS-Z790': {
    title: 'Z790 Hero',
    subtitle: 'ROG Motherboard',
    background: '#0f172a',
    accent: '#8b5cf6',
    accent2: '#22d3ee',
    motif: 'motherboard',
  },
  'RAM-GSKILL-6000': {
    title: 'Trident Z5',
    subtitle: 'DDR5 Memory',
    background: '#111827',
    accent: '#ec4899',
    accent2: '#8b5cf6',
    motif: 'ram',
  },
  'SSD-SAMSUNG-990PRO': {
    title: '990 PRO',
    subtitle: 'NVMe SSD',
    background: '#0f172a',
    accent: '#14b8a6',
    accent2: '#0ea5e9',
    motif: 'storage',
  },
  'PSU-CORSAIR-RM1000X': {
    title: 'RM1000x',
    subtitle: 'Corsair PSU',
    background: '#111827',
    accent: '#f59e0b',
    accent2: '#ef4444',
    motif: 'psu',
  },
  'CASE-NZXT-H9': {
    title: 'H9 Flow',
    subtitle: 'NZXT Case',
    background: '#101827',
    accent: '#60a5fa',
    accent2: '#94a3b8',
    motif: 'case',
  },
  'COOL-NZXT-KRAKEN': {
    title: 'Kraken X63',
    subtitle: 'AIO Cooling',
    background: '#0f172a',
    accent: '#22c55e',
    accent2: '#06b6d4',
    motif: 'cooling',
  },
};

function imageDataUrl(spec: ImageSpec, width: number, height: number): string {
  const svg = buildSvg(spec, width, height);
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildSvg(spec: ImageSpec, width: number, height: number): string {
  const motif = buildMotif(spec.motif);
  const isWide = width > height;
  const viewBox = isWide ? '0 0 1200 900' : '0 0 900 900';

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${escapeXml(spec.title)}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${spec.background}" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${spec.accent}" />
          <stop offset="100%" stop-color="${spec.accent2}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <circle cx="${isWide ? 950 : 650}" cy="160" r="160" fill="${spec.accent}" opacity="0.16" />
      <circle cx="${isWide ? 220 : 210}" cy="${isWide ? 690 : 680}" r="190" fill="${spec.accent2}" opacity="0.14" />
      <rect x="60" y="60" width="${isWide ? 1080 : 780}" height="${isWide ? 780 : 780}" rx="42" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
      ${motif}
      <text x="90" y="${isWide ? 170 : 155}" fill="#ffffff" font-size="34" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="1.5">${escapeXml(spec.title)}</text>
      <text x="90" y="${isWide ? 220 : 205}" fill="rgba(255,255,255,0.68)" font-size="24" font-family="Arial, Helvetica, sans-serif">${escapeXml(spec.subtitle)}</text>
      <rect x="90" y="${isWide ? 260 : 250}" width="220" height="10" rx="5" fill="url(#accent)" />
    </svg>
  `.replace(/\s{2,}/g, ' ').trim();
}

function buildMotif(kind: ImageSpec['motif']): string {
  switch (kind) {
    case 'gpu':
      return `
        <rect x="530" y="320" width="420" height="250" rx="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.10)" />
        <rect x="590" y="380" width="180" height="130" rx="18" fill="url(#accent)" opacity="0.9" />
        <rect x="802" y="392" width="90" height="105" rx="14" fill="rgba(255,255,255,0.10)" />
        <circle cx="650" cy="445" r="42" fill="rgba(2,6,23,0.5)" />
        <circle cx="650" cy="445" r="18" fill="rgba(255,255,255,0.85)" />
        <rect x="500" y="410" width="34" height="58" rx="8" fill="${escapeXmlAttr('#ffffff')}" opacity="0.55" />
        <rect x="500" y="490" width="34" height="58" rx="8" fill="${escapeXmlAttr('#ffffff')}" opacity="0.55" />
      `;
    case 'cpu':
      return `
        <rect x="530" y="300" width="280" height="280" rx="36" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
        <rect x="595" y="365" width="150" height="150" rx="20" fill="url(#accent)" />
        <g fill="rgba(255,255,255,0.65)">
          ${chipPins(520, 338, 8, 9)}
          ${chipPins(520, 520, 8, 9)}
          ${chipPins(557, 265, 8, 9, true)}
          ${chipPins(737, 265, 8, 9, true)}
        </g>
      `;
    case 'motherboard':
      return `
        <rect x="470" y="260" width="500" height="420" rx="32" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.10)" />
        <rect x="545" y="330" width="190" height="190" rx="22" fill="url(#accent)" opacity="0.92" />
        <rect x="785" y="320" width="120" height="300" rx="18" fill="rgba(255,255,255,0.08)" />
        <rect x="505" y="560" width="390" height="52" rx="14" fill="rgba(255,255,255,0.12)" />
        <circle cx="630" cy="425" r="46" fill="rgba(2,6,23,0.45)" />
        <circle cx="630" cy="425" r="18" fill="rgba(255,255,255,0.9)" />
      `;
    case 'ram':
      return `
        <rect x="510" y="325" width="100" height="320" rx="18" fill="rgba(255,255,255,0.10)" />
        <rect x="630" y="325" width="100" height="320" rx="18" fill="rgba(255,255,255,0.10)" />
        <rect x="530" y="370" width="60" height="240" rx="12" fill="url(#accent)" />
        <rect x="650" y="370" width="60" height="240" rx="12" fill="url(#accent)" />
        <rect x="490" y="290" width="280" height="24" rx="12" fill="rgba(255,255,255,0.18)" />
      `;
    case 'storage':
      return `
        <rect x="515" y="350" width="320" height="180" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
        <rect x="565" y="392" width="220" height="36" rx="10" fill="url(#accent)" opacity="0.9" />
        <circle cx="555" cy="470" r="18" fill="rgba(255,255,255,0.65)" />
        <rect x="840" y="390" width="32" height="110" rx="12" fill="rgba(255,255,255,0.14)" />
      `;
    case 'psu':
      return `
        <rect x="500" y="330" width="360" height="220" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="635" cy="440" r="68" fill="rgba(2,6,23,0.45)" stroke="url(#accent)" stroke-width="12" />
        <circle cx="635" cy="440" r="28" fill="rgba(255,255,255,0.9)" />
        <rect x="865" y="376" width="36" height="90" rx="12" fill="rgba(255,255,255,0.14)" />
      `;
    case 'case':
      return `
        <rect x="560" y="265" width="260" height="430" rx="30" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
        <rect x="615" y="315" width="150" height="250" rx="18" fill="rgba(255,255,255,0.05)" />
        <rect x="615" y="585" width="150" height="60" rx="14" fill="url(#accent)" opacity="0.88" />
        <circle cx="690" cy="370" r="36" fill="rgba(255,255,255,0.14)" />
      `;
    case 'cooling':
      return `
        <rect x="500" y="320" width="420" height="220" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="605" cy="430" r="72" fill="rgba(2,6,23,0.45)" stroke="url(#accent)" stroke-width="10" />
        <circle cx="775" cy="430" r="72" fill="rgba(2,6,23,0.45)" stroke="url(#accent)" stroke-width="10" />
        <circle cx="605" cy="430" r="24" fill="rgba(255,255,255,0.85)" />
        <circle cx="775" cy="430" r="24" fill="rgba(255,255,255,0.85)" />
        <rect x="470" y="585" width="470" height="20" rx="10" fill="rgba(255,255,255,0.14)" />
      `;
  }
}

function chipPins(x: number, y: number, count: number, size: number, vertical = false): string {
  return Array.from({ length: count }, (_, index) => {
    const offset = index * (size + 6);
    const width = vertical ? size : 10;
    const height = vertical ? 10 : size;
    const left = vertical ? x + offset : x + offset;
    const top = vertical ? y : y + offset;
    return `<rect x="${left}" y="${top}" width="${width}" height="${height}" rx="3" />`;
  }).join('');
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeXmlAttr(value: string): string {
  return escapeXml(value);
}

function specForCategory(slug: string): ImageSpec {
  return CATEGORY_IMAGE_SPECS[slug] ?? {
    title: slug,
    subtitle: 'PC hardware',
    background: '#111827',
    accent: '#38bdf8',
    accent2: '#8b5cf6',
    motif: 'case',
  };
}

function productSpecFromSku(sku: string): ImageSpec {
  return PRODUCT_IMAGE_SPECS[sku] ?? specForCategory(categorySlugFromSku(sku));
}

function categorySlugFromSku(sku: string): string {
  if (sku.startsWith('GPU-')) return 'graphics-cards';
  if (sku.startsWith('CPU-')) return 'processors';
  if (sku.startsWith('MB-')) return 'motherboards';
  if (sku.startsWith('RAM-')) return 'memory';
  if (sku.startsWith('SSD-')) return 'storage';
  if (sku.startsWith('PSU-')) return 'power-supplies';
  if (sku.startsWith('CASE-')) return 'cases';
  if (sku.startsWith('COOL-')) return 'cooling';
  return 'cases';
}

export function productImageUrl(sku: string): string {
  return imageDataUrl(productSpecFromSku(sku), 800, 800);
}

export function categoryImageUrl(slug: string): string {
  return imageDataUrl(specForCategory(slug), 400, 300);
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function stockBadgeClass(stock: number): Record<string, boolean> {
  return {
    out: stock === 0,
    low: stock > 0 && stock < LOW_STOCK_THRESHOLD,
  };
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private productsSignal = signal<Product[]>([]);
  private metaSignal = signal<PaginationMeta | null>(null);
  private loadingSignal = signal(false);
  private categoriesSignal = signal<Category[]>([]);

  readonly products = this.productsSignal.asReadonly();
  readonly meta = this.metaSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly categories = this.categoriesSignal.asReadonly();

  async loadProducts(filters: ProductFilters = {}): Promise<void> {
    this.loadingSignal.set(true);
    try {
      const params = this.buildParams(filters);
      const response = await firstValueFrom(
        this.http.get<ApiListResponse<Product>>(`${this.apiUrl}/products`, { params })
      );
      this.productsSignal.set(response.data);
      this.metaSignal.set(response.meta);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getProduct(id: number): Promise<Product> {
    return firstValueFrom(
      this.http.get<Product>(`${this.apiUrl}/products/${id}`)
    );
  }

  async loadCategories(): Promise<void> {
    if (this.categoriesSignal().length > 0) return;
    const response = await firstValueFrom(
      this.http.get<ApiListResponse<Category>>(`${this.apiUrl}/categories`, {
        params: { limit: '50' },
      })
    );
    this.categoriesSignal.set(response.data);
  }

  private buildParams(filters: ProductFilters): Record<string, string> {
    const params: Record<string, string> = {};
    if (filters.page) params['page'] = String(filters.page);
    if (filters.limit) params['limit'] = String(filters.limit);
    if (filters.categoryId) params['categoryId'] = String(filters.categoryId);
    if (filters.minPrice !== undefined) params['minPrice'] = String(filters.minPrice);
    if (filters.maxPrice !== undefined) params['maxPrice'] = String(filters.maxPrice);
    if (filters.brand) params['brand'] = filters.brand;
    if (filters.inStock !== undefined) params['inStock'] = String(filters.inStock);
    if (filters.sort) params['sort'] = filters.sort;
    if (filters.search) params['search'] = filters.search;
    return params;
  }
}
