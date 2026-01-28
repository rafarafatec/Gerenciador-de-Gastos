import React, { useState, useEffect } from 'react';
import { X, Check, Tag, Layers } from 'lucide-react';
import { Category, TransactionType } from '../types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'category' | 'subcategory';
  categories: Category[]; // Needed for selecting parent when adding subcategory
  onSaveCategory: (name: string, type: TransactionType) => void;
  onSaveSubcategory: (name: string, parentId: string) => void;
  defaultType?: TransactionType; // Pre-select expense or income
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  mode, // This will act as the "initial" mode
  categories,
  onSaveCategory,
  onSaveSubcategory,
  defaultType = 'expense'
}) => {
  // Internal state to switch between modes inside the modal
  const [activeMode, setActiveMode] = useState<'category' | 'subcategory'>(mode);
  
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>(defaultType);
  const [parentId, setParentId] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveMode(mode); // Set the initial mode based on which button was clicked
      setName('');
      setType(defaultType);
      setParentId('');
    }
  }, [isOpen, defaultType, mode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (activeMode === 'category') {
      onSaveCategory(name, type);
    } else {
      if (!parentId) return;
      onSaveSubcategory(name, parentId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            {activeMode === 'category' ? <Tag size={20} className="text-blue-600" /> : <Layers size={20} className="text-orange-600" />}
            {activeMode === 'category' ? 'Nova Categoria' : 'Nova Subcategoria'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Mode Switcher */}
          <div className="bg-gray-100 p-1 rounded-lg flex mb-4">
            <button
              type="button"
              onClick={() => setActiveMode('category')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeMode === 'category' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Categoria
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('subcategory')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeMode === 'subcategory' ? 'bg-white shadow-sm text-orange-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Subcategoria
            </button>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
            <input 
              type="text" 
              placeholder={activeMode === 'category' ? "Ex: Viagens" : "Ex: Passagens Aéreas"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              required
            />
          </div>

          {/* Conditional Inputs based on Active Mode */}
          {activeMode === 'category' ? (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tipo de Transação</label>
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                    type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                    type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Receita
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria Pai</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                required
              >
                <option value="">Selecione...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type === 'expense' ? 'Despesa' : 'Receita'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm mt-4"
          >
            <Check size={18} /> Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;