import React from 'react';
import { DollarSign, TrendingDown, TrendingUp, PieChart } from 'lucide-react';
import { DashboardStats } from '../types';

interface DashboardCardsProps {
  stats: DashboardStats;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ stats }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total de Gastos (Accumulated) - Visualizing as total expenses generally tracked */}
      <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl shadow-sm flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">TOTAL DE GASTOS</p>
          <h3 className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalExpenses)}</h3>
          <p className="text-xs text-gray-500 mt-2">Acumulado</p>
        </div>
        <div className="p-2 bg-blue-100 rounded-lg text-blue-500">
          <DollarSign size={24} />
        </div>
      </div>

      {/* Gastos do Mês */}
      <div className="bg-green-50/50 border border-green-100 p-6 rounded-2xl shadow-sm flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">GASTOS DO MÊS</p>
          <h3 className="text-2xl font-bold text-green-600">{formatCurrency(stats.monthlyExpenses)}</h3>
          <p className="text-xs text-gray-500 mt-2">Mês Atual</p>
        </div>
        <div className="p-2 bg-green-100 rounded-lg text-green-500">
          <TrendingDown size={24} />
        </div>
      </div>

      {/* Renda do Mês */}
      <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl shadow-sm flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">RENDA DO MÊS</p>
          <h3 className="text-2xl font-bold text-orange-600">{formatCurrency(stats.monthlyIncome)}</h3>
          <p className="text-xs text-gray-500 mt-2">Entrada do mês</p>
        </div>
        <div className="p-2 bg-orange-100 rounded-lg text-orange-500">
          <TrendingUp size={24} />
        </div>
      </div>

      {/* Saldo */}
      <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl shadow-sm flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">SALDO</p>
          <h3 className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
            {formatCurrency(stats.balance)}
          </h3>
          <p className="text-xs text-gray-500 mt-2">{stats.balance >= 0 ? 'Superávit' : 'Déficit'}</p>
        </div>
        <div className="p-2 bg-red-100 rounded-lg text-red-500">
          <PieChart size={24} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
