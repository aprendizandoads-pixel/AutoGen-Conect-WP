import React from 'react';
import { SeoStrategy, CompetitorReport } from '../types';
import { TrendingUp, Award, Zap, AlertTriangle, Users, BarChart3, Target, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StrategyViewProps {
  strategy: SeoStrategy;
}

export const StrategyView: React.FC<StrategyViewProps> = ({ strategy }) => {
  const chartData = [
    { name: 'Média Concorrentes', score: 65 },
    { name: 'Sua Publicação', score: 98 },
  ];

  const renderCompetitorCard = (item: CompetitorReport, idx: number) => (
    <div key={idx} className="bg-gray-900/60 border border-gray-700 rounded-xl overflow-hidden shadow-lg transition-all hover:border-blue-500/50">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
          <Search className="w-3 h-3" /> Concorrente {idx + 1}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500">Performance:</span>
          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${item.performanceScore > 70 ? 'bg-green-500' : 'bg-yellow-500'}`} 
              style={{ width: `${item.performanceScore}%` }} 
            />
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-300 hover:underline block truncate mb-4">
          {item.url}
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs font-bold text-purple-400 uppercase">
              <Users className="w-3 h-3" /> Demografia
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{item.demographics}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 uppercase">
              <BarChart3 className="w-3 h-3" /> Estratégia
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{item.marketingStrategy}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-800">
          <div className="grid grid-cols-1 gap-3">
             <div className="bg-green-500/5 p-2 rounded border border-green-500/20">
                <span className="text-[10px] font-bold text-green-400 block mb-1">PONTOS FORTES:</span>
                <p className="text-xs text-gray-300 italic">{item.strengths}</p>
             </div>
             <div className="bg-red-500/5 p-2 rounded border border-red-500/20">
                <span className="text-[10px] font-bold text-red-400 block mb-1">FALHAS & GAPS:</span>
                <p className="text-xs text-gray-300">{item.failures}</p>
             </div>
          </div>
        </div>

        <div className="bg-blue-600/10 p-3 rounded-lg border border-blue-500/30">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-1">
            <Target className="w-3 h-3" /> OPORTUNIDADE DE DOMINAÇÃO
          </div>
          <p className="text-xs text-blue-100">{item.gapIdentified}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 mb-12">
      {/* Resumo do Relatório */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl col-span-1 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600/20 p-3 rounded-xl">
              <BarChart3 className="text-blue-500 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Relatório de Inteligência Competitiva</h3>
              <p className="text-gray-400 text-sm">Análise detalhada do ecossistema e estratégias dos rivais.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {strategy.competitorAnalysis.map((item, idx) => renderCompetitorCard(item, idx))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Gráfico de Performance Estimada */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl flex flex-col items-center">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="text-green-500" /> Estimativa de SEO
            </h3>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#fff' }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#4B5563' : '#3B82F6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 text-center">
              <div className="text-3xl font-black text-green-400">+{strategy.projectedTrafficIncrease}%</div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Crescimento de Tráfego</p>
            </div>
          </div>

          <div className="bg-indigo-900/40 rounded-2xl p-6 border border-indigo-500/30 shadow-2xl">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-3">
              <Zap className="w-5 h-5" /> Plano de Dominação
            </div>
            <p className="text-sm text-indigo-100 leading-relaxed whitespace-pre-line">
              {strategy.contentPlan}
            </p>
          </div>
        </div>
      </div>

      {/* Análise de Lacuna de Conteúdo */}
      <div className="bg-red-900/10 rounded-2xl p-8 border border-red-500/20 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="bg-red-500/20 p-4 rounded-2xl">
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">Onde Eles Falham (Content Gap Analysis)</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
              {strategy.gapAnalysis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};