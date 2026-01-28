import React, { useState } from 'react';
import { Calendar, DollarSign, Tag, FileText, Plus } from 'lucide-react';
import { Category, Subcategory, TransactionType } from '../types';

interface AddTransactionFormProps {
  categories: Category[];
  subcategories: Subcategory[];
  onAddTransaction: (data: any) => void;
  type: TransactionType;
  onRequestAddCategory: () => void;
  onRequestAddSubcategory: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ 
  categories, 
  subcategories, 
  onAddTransaction,
  type,
  onRequestAddCategory,
  onRequestAddSubcategory
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [description, setDescription] = useState('');

  const filteredCategories = categories.filter(c => c.type === type);
  const filteredSubcategories = subcategories.filter(s => s.parentId === categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !description) return;

    onAddTransaction({
      date,
      amount: parseFloat(amount),
      categoryId,
      subcategoryId,
      description,
      type
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategoryId('');
    setSubcategoryId('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-lg ${type === 'expense' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
          <Plus size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{type === 'expense' ? 'Novo Gasto' : 'Nova Renda'}</h2>
          <p className="text-sm text-gray-500">Registre {type === 'expense' ? 'um novo gasto' : 'uma nova renda'} com categoria e subcategoria</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar size={16} /> Data *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Value */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <DollarSign size={16} /> Valor (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag size={16} /> Categoria *
            </label>
            <div className="flex gap-2">
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
              >
                <option value="">Selecione...</option>
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={onRequestAddCategory}
                className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 text-gray-500 hover:text-blue-600 transition-colors"
                title="Adicionar nova categoria"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag size={16} /> Subcategoria
            </label>
            <div className="flex gap-2">
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                disabled={!categoryId}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Selecione...</option>
                {filteredSubcategories.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button 
                type="button" 
                disabled={!categoryId} 
                onClick={onRequestAddSubcategory}
                className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
                title="Adicionar nova subcategoria"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FileText size={16} /> Descrição
          </label>
          <input
            type="text"
            required
            placeholder={type === 'expense' ? "Ex: Almoço no restaurante" : "Ex: Freelance de Design"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {type === 'expense' ? 'Adicionar Gasto' : 'Adicionar Renda'}
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;