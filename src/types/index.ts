/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: UserRole;
  address?: string;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  brand: string;
  images: string[];
  price: number;
  previousPrice?: number;
  discount?: number;
  stockQuantity: number;
  sku: string;
  shortDescription: string;
  fullDescription: string;
  specifications: Record<string, string>;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  isPopular: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stockQuantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  mobileNumber: string;
  email?: string;
  address: string;
  district: string;
  area: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  note?: string;
  createdAt: number;
  updatedAt: number;
}

export interface LegalPage {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface SiteSettings {
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  deliveryChargeInside: number;
  deliveryChargeOutside: number;
}
