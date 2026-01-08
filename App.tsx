import React, { useState } from 'react';
import { AppState, GeneratedContent, SeoParams, WordPressPost, WordPressConnection } from './types';
import { generateSeoContent } from './services/geminiService';
import { updateWordPressPost } from './services/wordpressService';
import { InputForm } from './components/InputForm';
import { StrategyView } from './components/StrategyView';
import { ContentDisplay } from './components/ContentDisplay';
import { SystemDocs } from './components/SystemDocs';
import { WordPressManager } from './components/WordPressManager';
import { Sparkles, ArrowLeft, BookOpen, Search, Globe, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const App = () => {
  const [activeView, setActiveView] = useState<'tool' | 'docs' | 'wordpress'>('tool');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // WordPress Context
  const [wpContext, setWpContext] = useState<{
    connection: WordPressConnection;
    postId: number;
  } | null>(null);

  const [preFillParams, setPreFillParams] = useState<Partial<SeoParams> | null>(null);
  const [isUpdatingWp, setIsUpdatingWp] = useState(false);
  const [wpUpdateStatus, setWpUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleGenerate = async (params: SeoParams) => {
    setAppState(AppState.ANALYZING);
    setError(null);
    setWpUpdateStatus('idle');
    try {
      const result = await generateSeoContent(params);
      setContent(result);
      setAppState(AppState.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating the content. Please ensure your API Key is valid and try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleSelectWpPost = (post: WordPressPost, connection: WordPressConnection) => {
    setWpContext({ connection, postId: post.id });
    setPreFillParams({
      mainKeywords: post.title.rendered.replace(/<[^>]*>/g, ''),
      competitorUrls: post.link
    });
    setActiveView('tool');
    setAppState(AppState.IDLE);
    setContent(null);
  };

  const handleUpdateWordPress = async () => {
    if (!wpContext || !content) return;
    
    setIsUpdatingWp(true);
    setWpUpdateStatus('idle');
    try {
      await updateWordPressPost(wpContext.connection, wpContext.postId, {
        content: content.htmlContent,
        title: content.metaTitle
      });
      setWpUpdateStatus('success');
      setTimeout(() => setWpUpdateStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setWpUpdateStatus('error');
    } finally {
      setIsUpdatingWp(false);
    }
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setContent(null);
    setError(null);
    setActiveView('tool');
    setPreFillParams(null);
    setWpContext(null);
    setWpUpdateStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">SEO Dominator <span className="text-gray-500 text-sm font-normal">AI</span></h1>
          </div>
          
          <nav className="flex items-center gap-2 md:gap-6">
            <button 
              onClick={() => setActiveView('tool')}
              className={`flex items-center gap-2 text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${activeView === 'tool' ? 'text-indigo-400 bg-indigo-400/10' : 'text-gray-400 hover:text-white'}`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Tool</span>
            </button>
            <button 
              onClick={() => setActiveView('wordpress')}
              className={`flex items-center gap-2 text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${activeView === 'wordpress' ? 'text-blue-400 bg-blue-400/10' : 'text-gray-400 hover:text-white'}`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">WordPress Sync</span>
            </button>
            <button 
              onClick={() => setActiveView('docs')}
              className={`flex items-center gap-2 text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${activeView === 'docs' ? 'text-purple-400 bg-purple-400/10' : 'text-gray-400 hover:text-white'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Docs</span>
            </button>
          </nav>

          {appState === AppState.COMPLETE && (
            <button 
              onClick={reset}
              className="hidden md:flex bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> New Project
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {appState === AppState.ERROR && (
          <div className="bg-red-500/10 border border-red-500 text-red-200 p-4 rounded-lg mb-8 text-center animate-shake">
            {error}
            <button onClick={reset} className="ml-4 underline hover:text-white">Try Again</button>
          </div>
        )}

        {wpUpdateStatus === 'success' && (
          <div className="bg-green-500/10 border border-green-500 text-green-200 p-4 rounded-lg mb-8 flex items-center justify-center gap-2 animate-bounce-short">
            <CheckCircle className="w-5 h-5" /> Article successfully updated in WordPress!
          </div>
        )}

        {wpUpdateStatus === 'error' && (
          <div className="bg-red-500/10 border border-red-500 text-red-200 p-4 rounded-lg mb-8 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" /> Failed to update WordPress post. Please check your credentials.
          </div>
        )}

        {activeView === 'docs' ? (
          <SystemDocs />
        ) : activeView === 'wordpress' ? (
          <WordPressManager onSelectPost={handleSelectWpPost} />
        ) : (
          <>
            {(appState === AppState.IDLE || appState === AppState.ANALYZING || appState === AppState.GENERATING) && (
              <div className={`transition-all duration-500 ${appState !== AppState.IDLE ? 'opacity-50 pointer-events-none' : ''}`}>
                 <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-white mb-4">Outrank the Competition</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                      {preFillParams ? "Optimizing selected WordPress post..." : "Enter your target keywords to generate superior content."}
                    </p>
                 </div>
                 <InputForm 
                    onSubmit={handleGenerate} 
                    isLoading={appState !== AppState.IDLE} 
                    initialData={preFillParams}
                  />
              </div>
            )}

            {appState === AppState.COMPLETE && content && (
              <div className="space-y-8 animate-fade-in-up">
                <StrategyView strategy={content.strategy} />
                
                <div className="relative">
                  <div className="absolute -top-4 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg z-10">
                    Generated SEO Content
                  </div>
                  <ContentDisplay 
                    content={content} 
                    onUpdateWordPress={wpContext ? handleUpdateWordPress : undefined}
                    isUpdatingWp={isUpdatingWp}
                  />
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default App;