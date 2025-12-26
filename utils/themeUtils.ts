import { BRAND_CONFIG } from '../config';

/**
 * Returns the primary color name configured in branding.
 */
export const getPrimaryColor = () => BRAND_CONFIG.primaryColor;

/**
 * Generates a tailwind text color class.
 * @param shade - The shade (e.g., 500, 600). Default 600.
 */
export const textPrimary = (shade: number = 600) => `text-${BRAND_CONFIG.primaryColor}-${shade}`;

/**
 * Generates a tailwind background color class.
 * @param shade - The shade (e.g., 50, 500). Default 500.
 */
export const bgPrimary = (shade: number = 600) => `bg-${BRAND_CONFIG.primaryColor}-${shade}`;

/**
 * Generates a tailwind border color class.
 * @param shade - The shade (e.g., 200). Default 200.
 */
export const borderPrimary = (shade: number = 200) => `border-${BRAND_CONFIG.primaryColor}-${shade}`;

/**
 * Returns common button classes based on the theme.
 * @param variant - 'solid' | 'outline' | 'ghost'
 */
export const getButtonClass = (variant: 'solid' | 'outline' | 'ghost' = 'solid') => {
  const color = BRAND_CONFIG.primaryColor;
  
  const base = "flex items-center justify-center font-bold rounded-xl transition-all duration-200";
  
  if (variant === 'solid') {
    return `${base} bg-${color}-600 text-white hover:bg-${color}-700 hover:shadow-lg hover:shadow-${color}-200`;
  }
  
  if (variant === 'outline') {
    return `${base} border border-${color}-200 text-${color}-600 hover:bg-${color}-50`;
  }
  
  if (variant === 'ghost') {
    return `${base} text-${color}-600 hover:bg-${color}-50`;
  }
  
  return base;
};

/**
 * Returns ring classes for focus states
 */
export const getFocusRing = () => `focus:ring-${BRAND_CONFIG.primaryColor}-500`;
