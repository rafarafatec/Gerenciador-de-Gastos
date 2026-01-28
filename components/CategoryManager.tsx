import React, { useState } from 'react';
import { Trash2, ClipboardList, Plus, X } from 'lucide-react';
import { Category, Subcategory } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  subcategories: Subcategory[];
  onDeleteCategory: (id: string) => void;
  onDeleteSubcategory: (id: string) => void;
  onRequestAddCategory: () => void;
  onRequestAddSubcategory: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ 
  categories, 
  subcategories,
  onDeleteCategory,
  onDeleteSubcategory,
  onRequestAddCategory,
  onRequestAddSubcategory
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubcategories = subcategories.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    if (activeTab === 'categories') {
      onRequestAddCategory();
    } else {
      onRequestAddSubcategory();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="text-orange-500" size={20} />
          <h3 className="font-bold text-gray-800">Gerenciar</h3>
        </div>
        <button 
          onClick={handleAddClick}
          className="p-1.5 rounded-lg transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100"
          title={activeTab === 'categories' ? "Adicionar Categoria" : "Adicionar Subcategoria"}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 p-1 rounded-lg flex mb-4 shrink-0">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'categories' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Categorias
        </button>
        <button
          onClick={() => setActiveTab('subcategories')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'subcategories' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Subcategorias
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'categories' ? 'categorias' : 'subcategorias'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-900"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar flex-1">
        {activeTab === 'categories' ? (
          filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wide ${cat.type === 'expense' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    {cat.type === 'expense' ? 'Despesa' : 'Receita'}
                  </span>
                </div>
                <button 
                  onClick={() => onDeleteCategory(cat.id)}
                  className="text-gray-300 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-xs py-4">Nenhuma categoria encontrada.</p>
          )
        ) : (
          filteredSubcategories.length > 0 ? (
            filteredSubcategories.map((sub) => {
              const parent = categories.find(c => c.id === sub.parentId);
              return (
                <div key={sub.id} className="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{sub.name}</p>
                    <p className="text-xs text-gray-400">{parent?.name || 'Sem categoria'}</p>
                  </div>
                  <button 
                    onClick={() => onDeleteSubcategory(sub.id)}
                    className="text-gray-300 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-400 text-xs py-4">Nenhuma subcategoria encontrada.</p>
          )
        )}
      </div>
    </div>
  );
};

export default CategoryManager;