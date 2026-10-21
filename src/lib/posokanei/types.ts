export interface Retailer {
  id: string;
  name: string;
  country: string;
  logo_url: string | null;
  website: string | null;
}

export interface RetailerPrice {
  retailer: string;
  retailer_display_name: string;
  retailer_name: string;
  price: number;
  price_normalized: number;
  is_discount: boolean;
  discount_percentage: number | null;
  last_updated: string;
  country: string;
}

export interface PriceStats {
  min_price: number;
  max_price: number;
  avg_price: number;
  min_unit_price: number;
  retailer_count: number;
  last_computed?: string | null;
}

export interface DailyPrice {
  date: string;
  country: string;
  price: number;
  unit_price: number;
}

export interface PriceHistory {
  retailers: string[];
  daily_prices: Record<string, DailyPrice[]>;
  date_range: {
    start: string;
    end: string;
  };
  available_countries: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  category_ids: string[];
  subcategory?: string;
  description?: string | null;
  image_url?: string | null;
  has_image: boolean;
  unit: string;
  unit_quantity: number;
  private_label: boolean;
  price_drop: boolean;
  price_drop_percentage?: number | null;
  price_drop_from?: number | null;
  price_drop_to?: number | null;
  price_stats?: PriceStats | null;
  retailers: string[];
  retailer_prices: RetailerPrice[];
  available_countries: string[];
  is_international: boolean;
  history?: PriceHistory | null;
}

export interface ProductPage {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  query_time_ms?: number | null;
}

export interface CategoryNode {
  category_id: string;
  name: string;
  name_en?: string;
  depth: number;
  hidden: boolean;
  image_url?: string | null;
  children?: CategoryNode[];
  total_product_count?: number;
  product_count?: number;
}

export interface ProductSearchQuery {
  title: string;
  category_id?: string;
  category_ids?: string[];
  page?: number;
  page_size?: number;
  sort_by?: "unit_price" | "price" | "name";
  sort_order?: "asc" | "desc";
  retailer?: string;
}
