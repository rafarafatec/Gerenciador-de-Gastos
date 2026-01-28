import { Category, Subcategory, Transaction } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Alimentação', type: 'expense' },
  { id: 'c2', name: 'Transporte', type: 'expense' },
  { id: 'c3', name: 'Moradia', type: 'expense' },
  { id: 'c4', name: 'Saúde', type: 'expense' },
  { id: 'c5', name: 'Lazer', type: 'expense' },
  { id: 'c6', name: 'Salário', type: 'income' },
  { id: 'c7', name: 'Investimentos', type: 'income' },
];

export const INITIAL_SUBCATEGORIES: Subcategory[] = [
  { id: 's1', parentId: 'c1', name: 'Restaurante' },
  { id: 's2', parentId: 'c1', name: 'Mercado' },
  { id: 's3', parentId: 'c1', name: 'Café' },
  { id: 's4', parentId: 'c2', name: 'Combustível' },
  { id: 's5', parentId: 'c2', name: 'Uber' },
  { id: 's6', parentId: 'c4', name: 'Farmácia' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2026-01-20', amount: 5000, categoryId: 'c6', subcategoryId: '', description: 'Salário Mensal', type: 'income' },
  { id: 't2', date: '2026-01-21', amount: 150, categoryId: 'c1', subcategoryId: 's1', description: 'Jantar Fora', type: 'expense' },
  { id: 't3', date: '2026-01-22', amount: 450, categoryId: 'c1', subcategoryId: 's2', description: 'Compras do Mês', type: 'expense' },
  { id: 't4', date: '2026-01-25', amount: 200, categoryId: 'c2', subcategoryId: 's4', description: 'Gasolina', type: 'expense' },
];
