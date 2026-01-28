import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Transaction, Category, Subcategory, TransactionType } from '../types';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  transaction: Transaction | null;
  categories: Category[];
  subcategories: Subcategory[];
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  transaction,
  categories,
  subcategories,
}) => {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [type, setType] = useState<TransactionType>('expense');

  useEffect(() => {
    if (transaction) {
      setDate(transaction.date);
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setCategoryId(transaction.categoryId);
      setSubcategoryId(transaction.subcategoryId);
      setType(transaction.type);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...transaction,
      date,
      amount: parseFloat(amount),
      description,
      categoryId,
      subcategoryId,
      type,
    });
    onClose();
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategoryId('');
    setSubcategoryId('');
  };

  const filteredCategories = categories.filter(c => c.type === type);
  const filteredSubcategories = subcategories.filter(s => s.parentId === categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">Editar Transação</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-5">
           {/* Type Switcher */}
           <div className="flex p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Receita
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Despesa
              </button>
           </div>
           
           {/* Date & Amount */}
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
               <input 
                 type="date" 
                 value={date} 
                 onChange={e => setDate(e.target.value)} 
                 className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                 required 
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (R$)</label>
               <input 
                 type="number" 
                 step="0.01" 
                 value={amount} 
                 onChange={e => setAmount(e.target.value)} 
                 className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                 required 
               />
             </div>
           </div>

           {/* Description */}
           <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
               <input 
                 type="text" 
                 value={description} 
                 onChange={e => setDescription(e.target.value)} 
                 className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                 required 
               />
           </div>

           {/* Categories */}
           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                <select 
                  value={categoryId} 
                  onChange={e => setCategoryId(e.target.value)} 
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                  required
                >
                  <option value="">Selecione</option>
                  {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subcategoria</label>
                <select 
                  value={subcategoryId} 
                  onChange={e => setSubcategoryId(e.target.value)} 
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-400" 
                  disabled={!categoryId}
                >
                  <option value="">Selecione</option>
                  {filteredSubcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
             </div>
           </div>

        </form>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save size={18} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
