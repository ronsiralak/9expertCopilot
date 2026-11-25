export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  emoji: string;
  stock: number;
  description: string;
}

export interface CartItem
  extends Pick<Product, "id" | "name" | "price">,
    Partial<Omit<Product, "id" | "name" | "price">> {
  quantity: number;
  [productField: string]: unknown;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** An applied coupon, after its code has been normalized. */
export interface CouponCode {
  code: string;
  percent: number;
}
