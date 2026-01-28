import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Wallet, FileText, PieChart, Settings, Search, Bell, Pencil, Trash2, LogOut, Cloud, CloudOff } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import DashboardCards from './components/DashboardCards';
import AddTransactionForm from './components/AddTransactionForm';
import CategoryManager from './components/CategoryManager';
import Analysis from './components/Analysis';
import EditTransactionModal from './components/EditTransactionModal';
import AddCategoryModal from './components/AddCategoryModal';
import LoginScreen from './components/LoginScreen';
import { Transaction, DashboardStats, Category, Subcategory, TransactionType } from './types';
import { storage } from './services/storage';
import { isSupabaseConfigured } from './services/supabaseClient';

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'add' | 'income' | 'history' | 'analysis' | 'config'>('add');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalMode, setAddModalMode] = useState<'category' | 'subcategory'>('category');

  // Data State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Load Data on Mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [txs, cats, subs] = await Promise.all([
          storage.getTransactions(user),
          storage.getCategories(user),
          storage.getSubcategories(user)
        ]);
        setTransactions(txs);
        setCategories(cats);
        setSubcategories(subs);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Handlers
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    // Generate ID on client for optimistic update (or for simple local storage compatibility)
    // In a full Supabase implementation, we might let the DB generate the ID, but client-side UUID is fine.
    const tx: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    
    // Optimistic Update
    setTransactions(prev => [...prev, tx]);
    
    // Async Save
    await storage.saveTransaction(user, tx);
  };

  const handleUpdateTransaction = async (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
    await storage.updateTransaction(user, updatedTx);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      await storage.deleteTransaction(user, id);
    }
  };

  const handleAddCategory = async (name: string, type: TransactionType) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      type
    };
    setCategories(prev => [...prev, newCategory]);
    await storage.saveCategory(user, newCategory);
  };

  const handleDeleteCategory = async (id: string) => {
    const isUsed = transactions.some(t => t.categoryId === id);
    if (isUsed) {
      alert('Não é possível excluir esta categoria pois existem transações vinculadas a ela.');
      return;
    }
    if (window.confirm('Tem certeza? Isso também excluirá as subcategorias vinculadas.')) {
      setCategories(prev => prev.filter(c => c.id !== id));
      setSubcategories(prev => prev.filter(s => s.parentId !== id));
      await storage.deleteCategory(user, id);
    }
  };

  const handleAddSubcategory = async (name: string, parentId: string) => {
    const newSub: Subcategory = {
      id: crypto.randomUUID(),
      name,
      parentId
    };
    setSubcategories(prev => [...prev, newSub]);
    await storage.saveSubcategory(user, newSub);
  };

  const handleDeleteSubcategory = async (id: string) => {
    const isUsed = transactions.some(t => t.subcategoryId === id);
    if (isUsed) {
      alert('Não é possível excluir esta subcategoria pois existem transações vinculadas a ela.');
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir esta subcategoria?')) {
      setSubcategories(prev => prev.filter(s => s.id !== id));
      await storage.deleteSubcategory(user, id);
    }
  };

  const openAddModal = (mode: 'category' | 'subcategory') => {
    setAddModalMode(mode);
    setIsAddModalOpen(true);
  };

  const handleResetData = async () => {
    if (window.confirm('ATENÇÃO: Isso apagará todos os seus dados. Deseja continuar?')) {
      setTransactions([]);
      // Note: We might want to reload default categories here, but for now we just clear custom data
      await storage.resetData(user);
      alert('Dados resetados com sucesso. Recarregue a página para ver o estado inicial.');
    }
  };

  // Stats Logic
  const stats: DashboardStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalExpenses = 0;
    let monthlyExpenses = 0;
    let monthlyIncome = 0;
    let balance = 0;

    transactions.forEach(t => {
      if (!t.date || typeof t.amount !== 'number') return;
      try {
        const [year, month, day] = t.date.split('-').map(Number);
        const isCurrentMonth = (month - 1) === currentMonth && year === currentYear;

        if (t.type === 'expense') {
          totalExpenses += t.amount;
          if (isCurrentMonth) monthlyExpenses += t.amount;
          balance -= t.amount;
        } else {
          if (isCurrentMonth) monthlyIncome += t.amount;
          balance += t.amount;
        }
      } catch (e) {
        console.warn("Transação ignorada:", t);
      }
    });

    return { totalExpenses, monthlyExpenses, monthlyIncome, balance };
  }, [transactions]);

  const navItems = [
    { id: 'add', label: '+ Adicionar', icon: null },
    { id: 'income', label: 'Renda', icon: Wallet },
    { id: 'history', label: 'Histórico', icon: FileText },
    { id: 'analysis', label: 'Análise', icon: PieChart },
    { id: 'config', label: 'Config', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gerenciador de Gastos</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Logado como: <span className="font-semibold text-blue-600">{user}</span></span>
              <span className="text-gray-300">|</span>
              <span className={`flex items-center gap-1 text-xs ${isSupabaseConfigured() ? 'text-green-600' : 'text-orange-500'}`}>
                {isSupabaseConfigured() ? <Cloud size={14} /> : <CloudOff size={14} />}
                {isSupabaseConfigured() ? 'Nuvem Ativa' : 'Modo Local'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-blue-900">{user}</span>
             </div>
             <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Sair"
              >
                <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <DashboardCards stats={stats} />

        {/* Navigation Tabs */}
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 mb-8 flex overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === item.id
                  ? 'bg-white shadow-md text-blue-600 ring-1 ring-black/5'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {item.id === 'add' ? (
                 <span className="flex items-center gap-2">{item.label}</span>
              ) : (
                <>
                  {item.icon && <item.icon size={18} />}
                  {item.label}
                </>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'add' && (
              <AddTransactionForm 
                categories={categories} 
                subcategories={subcategories} 
                onAddTransaction={handleAddTransaction}
                type="expense"
                onRequestAddCategory={() => openAddModal('category')}
                onRequestAddSubcategory={() => openAddModal('subcategory')}
              />
            )}
            
            {activeTab === 'income' && (
               <AddTransactionForm 
               categories={categories} 
               subcategories={subcategories} 
               onAddTransaction={handleAddTransaction}
               type="income"
               onRequestAddCategory={() => openAddModal('category')}
               onRequestAddSubcategory={() => openAddModal('subcategory')}
             />
            )}

            {activeTab === 'history' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4">Histórico de Transações</h2>
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.slice().reverse().map(t => (
                      <div key={t.id} className="group flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-gray-50 rounded-lg border-b border-gray-50 last:border-0 gap-3 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-full ${t.type === 'expense' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                              {t.type === 'expense' ? <FileText size={18} /> : <Wallet size={18} />}
                           </div>
                           <div>
                             <p className="font-semibold text-gray-800">{t.description}</p>
                             <p className="text-xs text-gray-500">{categories.find(c => c.id === t.categoryId)?.name} • {t.date}</p>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                          <span className={`font-bold ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                            {t.type === 'expense' ? '-' : '+'} R$ {t.amount.toFixed(2)}
                          </span>
                          
                          <div className="flex gap-1">
                            <button 
                              onClick={() => setEditingTransaction(t)} 
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteTransaction(t.id)} 
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <p>Nenhuma transação encontrada para {user}. Comece adicionando uma!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <Analysis transactions={transactions} categories={categories} />
            )}

            {activeTab === 'config' && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Settings size={20} /> Configurações
                </h3>
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg border ${isSupabaseConfigured() ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                     <h4 className={`font-bold flex items-center gap-2 ${isSupabaseConfigured() ? 'text-green-800' : 'text-orange-800'}`}>
                        {isSupabaseConfigured() ? <Cloud size={20} /> : <CloudOff size={20} />}
                        {isSupabaseConfigured() ? 'Sincronização em Nuvem Ativa' : 'Modo Local (Sem Sincronização)'}
                     </h4>
                     <p className={`text-sm mt-2 ${isSupabaseConfigured() ? 'text-green-700' : 'text-orange-700'}`}>
                        {isSupabaseConfigured() 
                          ? 'Seus dados estão sendo salvos na nuvem e podem ser acessados de qualquer dispositivo.'
                          : 'Seus dados estão apenas neste navegador. Para ativar a nuvem, configure as chaves do Supabase no código.'}
                     </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">Dados da Conta: {user}</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Gerencie seus dados locais ou na nuvem.
                    </p>
                    <button 
                      onClick={handleResetData}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Resetar Meus Dados
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
             <CategoryManager 
               categories={categories} 
               subcategories={subcategories} 
               onDeleteCategory={handleDeleteCategory}
               onDeleteSubcategory={handleDeleteSubcategory}
               onRequestAddCategory={() => openAddModal('category')}
               onRequestAddSubcategory={() => openAddModal('subcategory')}
             />
             
             <div className="mt-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-2 opacity-90">
                      <Bell size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Dica Rápida</span>
                   </div>
                   <h4 className="font-bold text-lg mb-2">Olá, {user}!</h4>
                   <p className="text-blue-100 text-sm">Que tal revisar seus gastos da semana hoje?</p>
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
             </div>
          </div>
        </div>
      </main>

      <EditTransactionModal 
        isOpen={!!editingTransaction} 
        onClose={() => setEditingTransaction(null)}
        onSave={handleUpdateTransaction}
        transaction={editingTransaction}
        categories={categories}
        subcategories={subcategories}
      />

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mode={addModalMode}
        categories={categories}
        onSaveCategory={handleAddCategory}
        onSaveSubcategory={handleAddSubcategory}
        defaultType={activeTab === 'income' ? 'income' : 'expense'}
      />
    </div>
  );
};

// --- Main App Entry Point ---
function App() {
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('rafatec_current_user');
  });

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('rafatec_current_user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rafatec_current_user');
  };

  // If no user is logged in, show login screen
  if (!user) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <SpeedInsights />
      </>
    );
  }

  // If user is logged in, show Dashboard
  return (
    <>
      <Dashboard key={user} user={user} onLogout={handleLogout} />
      <SpeedInsights />
    </>
  );
}

export default App;