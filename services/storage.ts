import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Transaction, Category, Subcategory, TransactionType } from '../types';
import { INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES } from '../constants';

// --- LocalStorage Helpers ---
const getLocal = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};
const setLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

// --- Storage Service ---
export const storage = {
  
  async getTransactions(user: string): Promise<Transaction[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('transactions')
        .select('*')
        .eq('user_id', user);
      
      if (error) {
        console.error('Erro Supabase:', error);
        return [];
      }
      return data || [];
    } else {
      // Fallback LocalStorage
      const saved = getLocal(`rafatec_transactions_${user}`);
      return Array.isArray(saved) ? saved : [];
    }
  },

  async saveTransaction(user: string, transaction: Transaction): Promise<Transaction | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('transactions')
        .insert([{ ...transaction, user_id: user }])
        .select()
        .single();
        
      if (error) {
         console.error('Erro ao salvar:', error);
         return null;
      }
      return data;
    } else {
      const key = `rafatec_transactions_${user}`;
      const current = getLocal(key) || [];
      const updated = [...current, transaction];
      setLocal(key, updated);
      return transaction;
    }
  },

  async updateTransaction(user: string, transaction: Transaction): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase!
        .from('transactions')
        .update({ ...transaction })
        .eq('id', transaction.id)
        .eq('user_id', user);
    } else {
      const key = `rafatec_transactions_${user}`;
      const current = getLocal(key) || [];
      const updated = current.map((t: Transaction) => t.id === transaction.id ? transaction : t);
      setLocal(key, updated);
    }
  },

  async deleteTransaction(user: string, id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase!.from('transactions').delete().eq('id', id).eq('user_id', user);
    } else {
      const key = `rafatec_transactions_${user}`;
      const current = getLocal(key) || [];
      const updated = current.filter((t: Transaction) => t.id !== id);
      setLocal(key, updated);
    }
  },

  // --- Categories ---
  async getCategories(user: string): Promise<Category[]> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase!.from('categories').select('*').eq('user_id', user);
      if (!data || data.length === 0) {
        // Se não tiver categorias no banco, tenta salvar as iniciais
        // (Simplificação: na prática idealmente o usuário criaria, mas vamos migrar as default)
        return INITIAL_CATEGORIES; 
      }
      return data;
    } else {
      const saved = getLocal(`rafatec_categories_${user}`);
      return Array.isArray(saved) ? saved : INITIAL_CATEGORIES;
    }
  },

  async saveCategory(user: string, category: Category): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase!.from('categories').insert([{ ...category, user_id: user }]);
    } else {
      const key = `rafatec_categories_${user}`;
      const current = getLocal(key) || INITIAL_CATEGORIES;
      setLocal(key, [...current, category]);
    }
  },

  async deleteCategory(user: string, id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase!.from('categories').delete().eq('id', id).eq('user_id', user);
    } else {
      const key = `rafatec_categories_${user}`;
      const current = getLocal(key) || INITIAL_CATEGORIES;
      setLocal(key, current.filter((c: Category) => c.id !== id));
    }
  },

  // --- Subcategories ---
  async getSubcategories(user: string): Promise<Subcategory[]> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase!.from('subcategories').select('*').eq('user_id', user);
      if (!data || data.length === 0) return INITIAL_SUBCATEGORIES;
      return data;
    } else {
      const saved = getLocal(`rafatec_subcategories_${user}`);
      return Array.isArray(saved) ? saved : INITIAL_SUBCATEGORIES;
    }
  },

  async saveSubcategory(user: string, subcategory: Subcategory): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase!.from('subcategories').insert([{ ...subcategory, user_id: user }]);
    } else {
      const key = `rafatec_subcategories_${user}`;
      const current = getLocal(key) || INITIAL_SUBCATEGORIES;
      setLocal(key, [...current, subcategory]);
    }
  },

  async deleteSubcategory(user: string, id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase!.from('subcategories').delete().eq('id', id).eq('user_id', user);
    } else {
      const key = `rafatec_subcategories_${user}`;
      const current = getLocal(key) || INITIAL_SUBCATEGORIES;
      setLocal(key, current.filter((s: Subcategory) => s.id !== id));
    }
  },

  async resetData(user: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase!.from('transactions').delete().eq('user_id', user);
      // Opcional: deletar categorias personalizadas
      await supabase!.from('categories').delete().eq('user_id', user);
      await supabase!.from('subcategories').delete().eq('user_id', user);
    } else {
      localStorage.removeItem(`rafatec_transactions_${user}`);
      localStorage.removeItem(`rafatec_categories_${user}`);
      localStorage.removeItem(`rafatec_subcategories_${user}`);
    }
  }
};