import { Product, Recipe } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Classic Fudgy Brownies',
    description: 'Cokelat premium melimpah dengan tekstur kenyal dan kulit garing di atas.',
    longDescription: 'Menu andalan untuk hadiah, arisan, atau stok camilan keluarga. Dibuat fresh by order dengan rasa coklat yang padat, moist, dan tidak terlalu manis.',
    price: 72000,
    originalPrice: 85000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_A3lGtMpgmxBU9iKHMFL7iJqm-TI_LVh707mieiVlsyTuRJci7uMUCDVmEAt7PQLwPhYosl4H7Q57O_IlaTf-EMnNux3faSy2wR_lN3bRGuIkn2NYYdqAVQSb7k1wTrbiFohPmzLYARKPQZu-7PYQmOCec1oX68CK0C6d7fgcVC6EqEFZvH71jnz-4XpKEKZFxKBtrwiMGAvb9Rl1oljVwlBUNoJrrzKDUglzpl63nnpimrXDsWf9Uvh84M98CqHCQlbi-VDvydM',
    category: 'Brownies',
    badge: 'FAVORITE',
    rating: 4.9,
    ratingCount: 120,
    sizes: ['20x10 cm', '20x20 cm', 'Slice box'],
    toppings: ['Almond', 'Cheese', 'Chocochips']
  },
  {
    id: 'p2',
    name: 'Cheese Swirl Brownies',
    description: 'Perpaduan manisnya cokelat fudgy dan gurihnya cream cheese premium yang lumer.',
    longDescription: 'Kombinasi gurih cream cheese premium yang lumer dan manisnya cokelat autentik. Sangat pas bagi Anda pecinta keju dan cokelat sekaligus.',
    price: 84000,
    originalPrice: 95000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGL_FJgGfvnP9363HaWuu7YGNi8j44i-3HXqX5cBzcSVzABtjYim__fYDcrsK6QXuDUC3gbW8cZwKxWSbkPTfjpJMy22qaXW17poKtQ595_tQnXHa_jePDFUoRnt4sSsUMakbrwwxX_Dz-PsPPKdBPgNBxC6lRrEz1VNqf2bHj6_GYRNdztVU4dY9wee3RTPAcS5t6i7GHGpME_tuZtn_ifePF7Eo9_IjewBghxiUUGTRzFYggb2J2TGSoA42oZSDclqtgD37Qikw',
    category: 'Brownies',
    badge: 'BEST SELLER',
    rating: 4.8,
    ratingCount: 95,
    sizes: ['20x10 cm', '20x20 cm', 'Slice box'],
    toppings: ['Almond Flakes', 'Cheese Swirls']
  },
  {
    id: 'p3',
    name: 'Almond Crunch Brownies',
    description: 'Taburan irisan kacang almond panggang yang renyah di setiap gigitan brownies.',
    longDescription: 'Renyahnya kacang almond pilihan yang dipanggang sempurna berpadu dengan kelembutan cokelat fudgy khas TaraBrownies.',
    price: 79000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcJo1QOr4OTl-8HiRrufa5B0Y8lB9PdRJe0NJJtOnf9KGGbGXIzcg_SQfJHbVu21MtmgNaMkpEOVAVQrrBJjaSnKnKe3RaPF7NZfp-dAehSDlgVKxVtilzyrOtsBZXHhDIaPSxm3myRrp_bPP0-8dpGJjo7ij4clS7RVKlIGC2DBW1JiBJKHXlu56mqEQHZj3w6PRGN9a1exSfyimQR-kxmHURq50OSzSZPfIF9Uug_HnF257hj1NrOtHRG_gHJF8Tjx4_tirMOBk',
    category: 'Brownies',
    badge: 'CRUNCHY',
    rating: 4.7,
    ratingCount: 78,
    sizes: ['20x10 cm', '20x20 cm'],
    toppings: ['Almond Extra']
  },
  {
    id: 'p4',
    name: 'Double Choco Bites',
    description: 'Potongan bites munggil dengan ekstra chocolate chips di dalam dan luar.',
    longDescription: 'Bentuk praktis sekali hap dengan lelehan cokelat ganda. Sempurna sebagai teman kopi sore atau camilan di perjalanan.',
    price: 58000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADg_fl4k_IzUv7Cmj2K35uzHTegMoiUVncwWUibAKfXgCF6gePTdy9y7FFavQgxvn9Wc0yoJCHZilkYpnErh5u94aDzXUsO1dZA_FQfUeC40hm9Hd6AWjNqPjJqGVMOzRq7hBum-3jQUYzijTthSBU-Mq37LlpqLuB6nPfNeXnVteAxi-Bo265d71FR_mJIGybl0JHJfpog8XGeXa-S4dAiMTVzye_rGXZw52YaPywqpHkPQ7zRYrey1HWBZ8_wDZACjFham4tJbI',
    category: 'Premium',
    badge: 'NEW',
    rating: 4.9,
    ratingCount: 64,
    sizes: ['Jar 250g', 'Jar 500g'],
    toppings: ['Extra Chocochips']
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Signature Fudgy Box',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl8ko9TQaaVYJTnYUPYZpXbIiIfD2BpeRktr-QrA-3hs8cw04oiloDiydYdtL6mdLkky4XNLCoYzjwnGpTMOx9rK7y7xKVvS4gr6pthUUGqPlSC0ntmtTddLT1yWAMi6Izllw4BrOpReOPH5RmquMhN9UNJmrDp-E7fPI2TbYo0SYnscACKYbEOrAr4y5v7wDvbUL0TjVcB0auxRmP06jWROJyKpp7vo1lC4bKb2TvBuTCDUPzH6GcOs2OrxODvcUZ4NRlGAES6BQ',
    ingredients: [
      { id: 'i1', name: 'Cokelat Couverture', unit: 'gram', qty: 200, pricePerUnit: 150 },
      { id: 'i2', name: 'Butter Wijsman', unit: 'gram', qty: 150, pricePerUnit: 450 },
      { id: 'i3', name: 'Gula Kastor', unit: 'gram', qty: 180, pricePerUnit: 35 },
      { id: 'i4', name: 'Tepung Terigu Protein Sedang', unit: 'gram', qty: 100, pricePerUnit: 20 },
      { id: 'i5', name: 'Telur Ayam Segar', unit: 'pcs', qty: 3, pricePerUnit: 2500 }
    ],
    packagingCost: 4500,
    utilityCost: 2000,
    yieldQty: 1,
    targetMargin: 40,
    lastUpdated: '2 menit yang lalu'
  },
  {
    id: 'r2',
    name: 'Almond Blondie',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcw1YtMXVrytm9b_-8bIOrCKSOUfQ9AKyVRhebftU1r-1ja35B8NgwmcIxesT7sMBalc_L6xGyYPtlWPYlqY2pb9pAhSn1wZm3FqcYEWaDaVl4toRAsvTBahgYDqOXN2kKuzNKOqUlZ4nJqDdyYeq9rUgtKB2Wl9ZRvf_aSqclvmEZkXqvVM3dKkRs5bA_czAe2wd44HCrd3JUbR6gxkacWArwCjYnvknc8lNdC15qY9NN0Isay2XRHNuz8iAbelzyiVdBiECVGmA',
    ingredients: [
      { id: 'i6', name: 'White Chocolate', unit: 'gram', qty: 180, pricePerUnit: 120 },
      { id: 'i7', name: 'Unsalted Butter', unit: 'gram', qty: 120, pricePerUnit: 250 },
      { id: 'i8', name: 'Almond Slice', unit: 'gram', qty: 80, pricePerUnit: 350 },
      { id: 'i9', name: 'Tepung Terigu', unit: 'gram', qty: 120, pricePerUnit: 20 }
    ],
    packagingCost: 4500,
    utilityCost: 2000,
    yieldQty: 1,
    targetMargin: 35,
    lastUpdated: '1 hari yang lalu'
  }
];
