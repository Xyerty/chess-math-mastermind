
import { en } from './en';
import { es } from './es';

export type Language = 'en' | 'es';

export interface Translation {
  [key: string]: string | string[];
}

export const translations: Record<Language, Translation> = {
  en,
  es,
};
