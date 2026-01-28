import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, Loader2 } from 'lucide-react';
import { Transaction, Category } from '../types';
import { getFinancialAdvice } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

interface AnalysisProps {
  transactions: Transaction[];
  categories: Category[];
}

const Analysis: React.FC<AnalysisProps> = ({ transactions, categories }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Group expenses by category
  const expenseData = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const total = transactions
        .filter(t => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: cat.name,
        amount: total,
      };
    })
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const handleGetInsight = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(transactions, categories);
    setAdvice(result);
    setLoading(false);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Gastos por Categoria</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value}`} tick={{ fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-900">Análise Inteligente</h3>
              <p className="text-sm text-indigo-600">Receba dicas financeiras personalizadas com IA</p>
            </div>
          </div>
          <button
            onClick={handleGetInsight}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {loading ? 'Analisando...' : 'Gerar Análise'}
          </button>
        </div>

        {advice && (
          <div className="bg-white p-5 rounded-lg shadow-sm border border-indigo-100 text-gray-700 text-sm leading-relaxed animate-in fade-in duration-500">
             <ReactMarkdown 
              components={{
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-indigo-800" {...props} />
              }}
             >
                {advice}
             </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
