
import { Operation } from './types';

export const OPERATIONS: { label: string; value: Operation; icon: string; color: string }[] = [
  { label: 'Toplama', value: 'addition', icon: '➕', color: 'bg-green-500' },
  { label: 'Çıkarma', value: 'subtraction', icon: '➖', color: 'bg-blue-500' },
  { label: 'Çarpma', value: 'multiplication', icon: '✖️', color: 'bg-orange-500' },
  { label: 'Bölme', value: 'division', icon: '➗', color: 'bg-red-500' },
];

export const DIFFICULTY_LEVELS = [
  { label: '1. Sınıf (Kolay)', value: 'easy' },
  { label: '2-3. Sınıf (Orta)', value: 'medium' },
  { label: '4. Sınıf (Zor)', value: 'hard' },
];
