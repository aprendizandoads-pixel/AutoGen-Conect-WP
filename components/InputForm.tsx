
import React, { useState, useEffect } from 'react';
import { SeoParams, AiProvider, ImageProvider, PublicationFormat } from '../types';
// Added Zap to imports
import { Search, Link, Target, MousePointer, Globe, PenTool, ImageIcon, Cpu, Settings, Key, CheckCircle, AlertCircle, RefreshCw, FileText, Info, ListTree, Zap } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: SeoParams) => void;
  isLoading: boolean;
  initialData?: Partial<SeoParams> | null;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const [formData, setFormData] = useState<SeoParams>({
    mainKeywords: '',
    organicKeywords: '',
    snippetKeywords: '',
    ctaText: '',
    ctaUrl: '',
    competitorUrls: '',
    language: 'Portuguese',
    contentTone: 'Professional & Authoritative',
    publicationFormat: 'blog-post',
    includeImages: true,
    aiProvider: 'gemini',
    imageProvider: 'gemini',
    openAiKey: localStorage.getItem('openai_key') || '',
    openAiModel: localStorage.getItem('openai_model') || 'gpt-4o'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const testOpenAiKey = async () => {
    if (!formData.openAiKey) return;
    setIsTestingKey(true);
    setApiStatus('idle');
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${formData.openAiKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const models = data.data
          .map((m: any) => m.id)
          .filter((id: string) => id.startsWith('gpt-'))
          .sort();
        setAvailableModels(models);
        setApiStatus('success');
        localStorage.setItem('openai_key', formData.openAiKey);
      } else {
        setApiStatus('error');
      }
    } catch (err) {
      setApiStatus('error');
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.aiProvider === 'openai' && !formData.openAiKey) {
      setShowSettings(true);
      return;
    }
    if (formData.openAiModel) {
      localStorage.setItem('openai_model', formData.openAiModel);
    }
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6" />
            SEO Content Generator
          </h2>
          <p className="text-blue-100 mt-2 text-sm opacity-90">Análise de concorrência e engenharia de conteúdo em um só lugar.</p>
        </div>
        <button 
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 rounded-full transition-all ${showSettings ? 'bg-white/20 rotate-90' : 'hover:bg-white/10'}`}
        >
          <Settings className="w-6 h-6 text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* OpenAI Settings Panel */}
        {showSettings && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6 animate-fade-in space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2 uppercase text-xs tracking-widest">
              <Key className="w-4 h-4" /> Configuração OpenAI
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase">API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    name="openAiKey"
                    value={formData.openAiKey}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button type="button" onClick={testOpenAiKey} className="absolute right-2 top-1.5 text-xs text-indigo-400 font-bold hover:text-white transition-colors">Test</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase">Model</label>
                <select name="openAiModel" value={formData.openAiModel} onChange={handleChange} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                   <option value="gpt-4o">gpt-4o (Recomendado)</option>
                   <option value="gpt-4o-mini">gpt-4o-mini</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Content Definition */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-blue-400 border-b border-gray-700 pb-2">
            <PenTool className="w-5 h-5" />
            <h3 className="font-bold uppercase text-xs tracking-widest">Definição de Conteúdo</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Tópico Principal (Palavra-Chave)</label>
              <input required name="mainKeywords" value={formData.mainKeywords} onChange={handleChange} placeholder="ex: Melhores Notebooks 2024" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Formato da Publicação</label>
              <select name="publicationFormat" value={formData.publicationFormat} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="blog-post">Blog Post (SEO)</option>
                <option value="landing-page">Landing Page (Conversão)</option>
                <option value="video-article">Artigo com Vídeo</option>
                <option value="step-by-step">Guia Passo a Passo</option>
                <option value="ebook">Capítulo de Ebook</option>
                <option value="whitepaper">Whitepaper Técnico</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Competitive Intelligence */}
        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <Globe className="w-5 h-5" />
              <h3 className="font-bold uppercase text-xs tracking-widest">Inteligência Competitiva</h3>
            </div>
            <div className="group relative">
               <Info className="w-4 h-4 text-gray-500 cursor-help" />
               <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-[10px] text-gray-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl border border-gray-700 z-50">
                  O sistema analisará estas URLs em tempo real para identificar lacunas de conteúdo e estratégias de SEO dos seus concorrentes.
               </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">URLs dos Concorrentes (Uma por linha)</label>
            <textarea
              name="competitorUrls"
              value={formData.competitorUrls}
              onChange={handleChange}
              placeholder="https://concorrente1.com.br/artigo-top&#10;https://concorrente2.com.br/guia-completo"
              rows={4}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Keywords Secundárias</label>
                <input name="organicKeywords" value={formData.organicKeywords} onChange={handleChange} placeholder="ex: notebook barato, melhor custo beneficio" className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Perguntas/Snippets</label>
                <input name="snippetKeywords" value={formData.snippetKeywords} onChange={handleChange} placeholder="ex: qual notebook comprar hoje?" className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
             </div>
          </div>
        </div>

        {/* Section 3: AI & Image Engines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                <Cpu className="w-4 h-4 text-purple-400" /> Motor de IA
              </label>
              <select name="aiProvider" value={formData.aiProvider} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                 <option value="gemini">Google Gemini 3 Pro (Native)</option>
                 <option value="openai">OpenAI GPT-4o (External)</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                <ImageIcon className="w-4 h-4 text-teal-400" /> Motor de Imagem
              </label>
              <select name="imageProvider" value={formData.imageProvider} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                 <option value="gemini">Gemini 2.5 Image</option>
                 <option value="pollinations">Pollinations AI (Dynamic)</option>
                 <option value="unsplash">Unsplash (Stock)</option>
              </select>
           </div>
        </div>

        {/* CTA & Actions */}
        <div className="pt-6 border-t border-gray-700 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full space-y-1">
             <label className="text-[10px] font-bold text-gray-500 uppercase">Chamada para Ação (CTA)</label>
             <div className="flex gap-2">
                <input name="ctaText" value={formData.ctaText} onChange={handleChange} placeholder="Texto do Botão" className="w-1/3 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                <input name="ctaUrl" value={formData.ctaUrl} onChange={handleChange} placeholder="Link de Destino" className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500" />
             </div>
          </div>
          <div className="flex items-center gap-3 h-[52px] px-4 bg-gray-700/30 rounded-lg border border-gray-600">
             <span className="text-xs font-bold text-gray-300">Incluir Imagens</span>
             <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="includeImages" checked={formData.includeImages} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
             </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-5 rounded-xl font-black text-lg shadow-2xl transform transition-all flex items-center justify-center gap-3
            ${isLoading 
              ? 'bg-gray-700 cursor-not-allowed opacity-75' 
              : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.01] active:scale-[0.99] text-white'
            }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-6 w-6 animate-spin text-blue-300" />
              Engenharia de Conteúdo em Progresso...
            </>
          ) : (
            <>
              <Zap className="w-6 h-6 text-yellow-400" />
              Analisar & Gerar Conteúdo de Elite
            </>
          )}
        </button>
      </form>
    </div>
  );
};
