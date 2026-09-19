/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category } from '../types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Mobile', slug: 'mobile' },
  { id: '2', name: 'Accessories', slug: 'accessories' },
  { id: '3', name: 'Electronics', slug: 'electronics' },
  { id: '4', name: 'Electric', slug: 'electric' },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max',
    category: 'mobile',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800'],
    price: 150000,
    previousPrice: 160000,
    stockQuantity: 10,
    sku: 'APP-I15PM-256',
    shortDescription: 'Latest iPhone with titanium body and A17 Pro chip.',
    fullDescription: 'The iPhone 15 Pro Max is the most powerful iPhone ever, featuring a titanium design, the A17 Pro chip, a customizable Action button, and a more versatile Pro camera system.',
    specifications: {
      'Display': '6.7-inch Super Retina XDR',
      'Processor': 'A17 Pro Chip',
      'Storage': '256GB'
    },
    status: 'active',
    isFeatured: true,
    isPopular: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy Buds 2 Pro',
    category: 'accessories',
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800'],
    price: 15000,
    previousPrice: 18000,
    stockQuantity: 25,
    sku: 'SAM-B2P-BLK',
    shortDescription: 'High-fidelity audio with active noise cancellation.',
    fullDescription: 'Galaxy Buds2 Pro deliver studio-quality sound with 24-bit Hi-Fi audio, Intelligent Active Noise Cancellation, and Enhanced 360 Audio.',
    specifications: {
      'Connectivity': 'Bluetooth 5.3',
      'Battery Life': 'Up to 29 hours',
      'Water Resistance': 'IPX7'
    },
    status: 'active',
    isFeatured: true,
    isPopular: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'p3',
    name: 'Sony WH-1000XM5',
    category: 'electronics',
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1618366712277-7bc841680d2b?auto=format&fit=crop&q=80&w=800'],
    price: 35000,
    stockQuantity: 5,
    sku: 'SNY-XM5-SLV',
    shortDescription: 'Best-in-class noise cancelling headphones.',
    fullDescription: 'The WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality.',
    specifications: {
      'Driver Unit': '30mm',
      'Battery Life': 'Up to 30 hours',
      'Charging': 'USB-C'
    },
    status: 'active',
    isFeatured: false,
    isPopular: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];
