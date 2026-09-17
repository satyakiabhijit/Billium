// World currencies data with tax slabs per country
export interface WorldCurrency {
  code: string;
  name: string;
  symbol: string;
  country: string;
}

export interface TaxPreset {
  name: string;
  rate: number;
}

export const WORLD_CURRENCIES: WorldCurrency[] = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', country: 'AE' },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋', country: 'AF' },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L', country: 'AL' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏', country: 'AM' },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ', country: 'AN' },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', country: 'AO' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', country: 'AR' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'AU' },
  { code: 'AWG', name: 'Aruban Florin', symbol: 'ƒ', country: 'AW' },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', country: 'AZ' },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'KM', country: 'BA' },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$', country: 'BB' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', country: 'BD' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', country: 'BG' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', country: 'BH' },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'Fr', country: 'BI' },
  { code: 'BMD', name: 'Bermudian Dollar', symbol: '$', country: 'BM' },
  { code: 'BND', name: 'Brunei Dollar', symbol: 'B$', country: 'BN' },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.', country: 'BO' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'BR' },
  { code: 'BSD', name: 'Bahamian Dollar', symbol: 'B$', country: 'BS' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu', country: 'BT' },
  { code: 'BWP', name: 'Botswanan Pula', symbol: 'P', country: 'BW' },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br', country: 'BY' },
  { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$', country: 'BZ' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', country: 'CA' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'Fr', country: 'CD' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', country: 'CH' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', country: 'CL' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'CN' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', country: 'CO' },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡', country: 'CR' },
  { code: 'CUP', name: 'Cuban Peso', symbol: '$', country: 'CU' },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$', country: 'CV' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', country: 'CZ' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fr', country: 'DJ' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'DK' },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', country: 'DO' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', country: 'DZ' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', country: 'EG' },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk', country: 'ER' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', country: 'ET' },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'EU' },
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$', country: 'FJ' },
  { code: 'GBP', name: 'British Pound', symbol: '£', country: 'GB' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', country: 'GE' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', country: 'GH' },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', country: 'GM' },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'Fr', country: 'GN' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', country: 'GT' },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: 'GY$', country: 'GY' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', country: 'HK' },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L', country: 'HN' },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', country: 'HR' },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G', country: 'HT' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', country: 'HU' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', country: 'ID' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', country: 'IL' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'IN' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', country: 'IQ' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', country: 'IR' },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', country: 'IS' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', country: 'JM' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD', country: 'JO' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'JP' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', country: 'KE' },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'лв', country: 'KG' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', country: 'KH' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'Fr', country: 'KM' },
  { code: 'KPW', name: 'North Korean Won', symbol: '₩', country: 'KP' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', country: 'KR' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', country: 'KW' },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: 'CI$', country: 'KY' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', country: 'KZ' },
  { code: 'LAK', name: 'Laotian Kip', symbol: '₭', country: 'LA' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£', country: 'LB' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', country: 'LK' },
  { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$', country: 'LR' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', country: 'LS' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD', country: 'LY' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', country: 'MA' },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', country: 'MD' },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', country: 'MG' },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден', country: 'MK' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', country: 'MM' },
  { code: 'MNT', name: 'Mongolian Tögrög', symbol: '₮', country: 'MN' },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'P', country: 'MO' },
  { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM', country: 'MR' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: 'Rs', country: 'MU' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf', country: 'MV' },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', country: 'MW' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', country: 'MX' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', country: 'MY' },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', country: 'MZ' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$', country: 'NA' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', country: 'NG' },
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$', country: 'NI' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'NO' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', country: 'NP' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', country: 'NZ' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', country: 'OM' },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.', country: 'PA' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/.', country: 'PE' },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K', country: 'PG' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', country: 'PH' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', country: 'PK' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', country: 'PL' },
  { code: 'PYG', name: 'Paraguayan Guaraní', symbol: '₲', country: 'PY' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', country: 'QA' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', country: 'RO' },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'din', country: 'RS' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', country: 'RU' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'Fr', country: 'RW' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', country: 'SA' },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$', country: 'SB' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: 'Rs', country: 'SC' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'LS', country: 'SD' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'SE' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'SG' },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le', country: 'SL' },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'Sh', country: 'SO' },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: '$', country: 'SR' },
  { code: 'STN', name: 'São Tomé & Príncipe Dobra', symbol: 'Db', country: 'ST' },
  { code: 'SVC', name: 'Salvadoran Colón', symbol: '₡', country: 'SV' },
  { code: 'SYP', name: 'Syrian Pound', symbol: 'LS', country: 'SY' },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L', country: 'SZ' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', country: 'TH' },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'SM', country: 'TJ' },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T', country: 'TM' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT', country: 'TN' },
  { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$', country: 'TO' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', country: 'TR' },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar', symbol: 'TT$', country: 'TT' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', country: 'TW' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'Sh', country: 'TZ' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', country: 'UA' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'Sh', country: 'UG' },
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'US' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', country: 'UY' },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: 'лв', country: 'UZ' },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.', country: 'VE' },
  { code: 'VND', name: 'Vietnamese Đồng', symbol: '₫', country: 'VN' },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'Vt', country: 'VU' },
  { code: 'WST', name: 'Samoan Tālā', symbol: 'WS$', country: 'WS' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'Fr', country: 'XA' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'Fr', country: 'XO' },
  { code: 'YER', name: 'Yemeni Rial', symbol: '﷼', country: 'YE' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'ZA' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', country: 'ZM' },
  { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'Z$', country: 'ZW' },
];

// Tax presets per currency code
export const TAX_PRESETS: Record<string, TaxPreset[]> = {
  // India - GST
  INR: [
    { name: 'GST 0%', rate: 0 },
    { name: 'GST 5%', rate: 5 },
    { name: 'GST 12%', rate: 12 },
    { name: 'GST 18%', rate: 18 },
    { name: 'GST 28%', rate: 28 },
  ],
  // Australia - GST
  AUD: [
    { name: 'GST 10%', rate: 10 },
    { name: 'GST Exempt 0%', rate: 0 },
  ],
  // New Zealand - GST
  NZD: [
    { name: 'GST 15%', rate: 15 },
    { name: 'GST Exempt 0%', rate: 0 },
  ],
  // UK - VAT
  GBP: [
    { name: 'VAT Standard 20%', rate: 20 },
    { name: 'VAT Reduced 5%', rate: 5 },
    { name: 'VAT Zero 0%', rate: 0 },
  ],
  // Euro zone - VAT (standard EU)
  EUR: [
    { name: 'VAT Standard 21%', rate: 21 },
    { name: 'VAT Reduced 12%', rate: 12 },
    { name: 'VAT Super Reduced 6%', rate: 6 },
    { name: 'VAT Zero 0%', rate: 0 },
  ],
  // USA - No federal VAT but common sales tax
  USD: [
    { name: 'Sales Tax 0%', rate: 0 },
    { name: 'Sales Tax 5%', rate: 5 },
    { name: 'Sales Tax 7%', rate: 7 },
    { name: 'Sales Tax 8.25%', rate: 8.25 },
    { name: 'Sales Tax 10%', rate: 10 },
  ],
  // Canada - GST/HST
  CAD: [
    { name: 'GST 5%', rate: 5 },
    { name: 'HST 13%', rate: 13 },
    { name: 'HST 15%', rate: 15 },
    { name: 'Zero Rated 0%', rate: 0 },
  ],
  // Singapore - GST
  SGD: [
    { name: 'GST 9%', rate: 9 },
    { name: 'GST Exempt 0%', rate: 0 },
  ],
  // UAE - VAT
  AED: [
    { name: 'VAT 5%', rate: 5 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Saudi Arabia - VAT
  SAR: [
    { name: 'VAT 15%', rate: 15 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // South Africa - VAT
  ZAR: [
    { name: 'VAT 15%', rate: 15 },
    { name: 'Zero Rated 0%', rate: 0 },
  ],
  // Japan - Consumption Tax
  JPY: [
    { name: 'Consumption Tax 10%', rate: 10 },
    { name: 'Reduced Rate 8%', rate: 8 },
    { name: 'Zero Rated 0%', rate: 0 },
  ],
  // China - VAT
  CNY: [
    { name: 'VAT Standard 13%', rate: 13 },
    { name: 'VAT Reduced 9%', rate: 9 },
    { name: 'VAT Small Business 3%', rate: 3 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Brazil - Multiple taxes
  BRL: [
    { name: 'ICMS 12%', rate: 12 },
    { name: 'ICMS 17%', rate: 17 },
    { name: 'PIS 0.65%', rate: 0.65 },
    { name: 'COFINS 3%', rate: 3 },
    { name: 'ISS 5%', rate: 5 },
  ],
  // Malaysia - SST
  MYR: [
    { name: 'SST 6%', rate: 6 },
    { name: 'SST Exempt 0%', rate: 0 },
    { name: 'SST 10%', rate: 10 },
  ],
  // Bangladesh - VAT
  BDT: [
    { name: 'VAT 15%', rate: 15 },
    { name: 'VAT Reduced 5%', rate: 5 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Pakistan - GST
  PKR: [
    { name: 'GST 17%', rate: 17 },
    { name: 'GST Exempt 0%', rate: 0 },
  ],
  // Sri Lanka - VAT
  LKR: [
    { name: 'VAT 18%', rate: 18 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Nepal - VAT
  NPR: [
    { name: 'VAT 13%', rate: 13 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Thailand - VAT
  THB: [
    { name: 'VAT 7%', rate: 7 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Indonesia - PPN
  IDR: [
    { name: 'PPN 11%', rate: 11 },
    { name: 'PPN Exempt 0%', rate: 0 },
  ],
  // Philippines - VAT
  PHP: [
    { name: 'VAT 12%', rate: 12 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Kenya - VAT
  KES: [
    { name: 'VAT 16%', rate: 16 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Nigeria - VAT
  NGN: [
    { name: 'VAT 7.5%', rate: 7.5 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Egypt - VAT
  EGP: [
    { name: 'VAT 14%', rate: 14 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Turkey - KDV (VAT)
  TRY: [
    { name: 'KDV 20%', rate: 20 },
    { name: 'KDV Reduced 10%', rate: 10 },
    { name: 'KDV Reduced 1%', rate: 1 },
    { name: 'KDV Exempt 0%', rate: 0 },
  ],
  // Mexico - IVA
  MXN: [
    { name: 'IVA 16%', rate: 16 },
    { name: 'IVA Exempt 0%', rate: 0 },
  ],
  // Argentina - IVA
  ARS: [
    { name: 'IVA 21%', rate: 21 },
    { name: 'IVA Reduced 10.5%', rate: 10.5 },
    { name: 'IVA Exempt 0%', rate: 0 },
  ],
  // Switzerland - MWST/TVA
  CHF: [
    { name: 'MWST Standard 8.1%', rate: 8.1 },
    { name: 'MWST Reduced 2.6%', rate: 2.6 },
    { name: 'MWST Special 3.8%', rate: 3.8 },
    { name: 'MWST Exempt 0%', rate: 0 },
  ],
  // Russia - НДС (VAT)
  RUB: [
    { name: 'НДС 20%', rate: 20 },
    { name: 'НДС Reduced 10%', rate: 10 },
    { name: 'НДС Exempt 0%', rate: 0 },
  ],
  // South Korea - VAT
  KRW: [
    { name: 'VAT 10%', rate: 10 },
    { name: 'VAT Exempt 0%', rate: 0 },
  ],
  // Hong Kong - No VAT (but has profit tax)
  HKD: [
    { name: 'No Tax 0%', rate: 0 },
  ],
  // Qatar - VAT
  QAR: [
    { name: 'No VAT 0%', rate: 0 },
  ],
  // Kuwait - No VAT
  KWD: [
    { name: 'No Tax 0%', rate: 0 },
  ],
};
