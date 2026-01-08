import React, { useState } from 'react';
import { WordPressConnection, WordPressPost, SeoEvaluation } from '../types';
import { fetchWordPressPosts, evaluateWpPost } from '../services/wordpressService';
import { Globe, Key, User, ExternalLink, RefreshCw, Search, FileText, AlertCircle, CheckCircle, BarChart3, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';

interface WordPressManagerProps {
  onSelectPost: (post: WordPressPost, connection: WordPressConnection) => void;
}

export const WordPressManager: React.FC<WordPressManagerProps> = ({ onSelectPost }) => {
  const [connection, setConnection] = useState<WordPressConnection>({
    url: localStorage.getItem('wp_url') || '',
    username: localStorage.getItem('wp_username') || '',
    appPassword: localStorage.getItem('wp_password') || ''
  });
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluatingIds, setEvaluatingIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPosts = await fetchWordPressPosts(connection);
      setPosts(fetchedPosts);
      setIsConnected(true);
      localStorage.setItem('wp_url', connection.url);
      localStorage.setItem('wp_username', connection.username);
      localStorage.setItem('wp_password', connection.appPassword);
    } catch (err: any) {
      setError(err.message || "Could not connect to WordPress. Check credentials and URL.");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post || evaluatingIds.has(postId)) return;

    setEvaluatingIds(prev => new Set(prev).add(postId));
    try {
      const evaluation = await evaluateWpPost(post);
      setPosts(current => current.map(p => 
        p.id === postId ? { ...p, seoEvaluation: evaluation } : p
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluatingIds(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };

  const scanAll = async () => {
    // Only scan those not yet evaluated
    const toScan = posts.filter(p => !p.seoEvaluation).slice(0, 5); // Limit batch to 5 for safety
    for (const post of toScan) {
      await handleEvaluate(post.id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnection({ ...connection, [e.target.name]: e.target.value });
  };

  const getStatusBadge = (evaluation?: SeoEvaluation) => {
    if (!evaluation) return null;
    
    const config = {
      'optimized': { color: 'bg-green-500/20 text-green-400', icon: <ShieldCheck className="w-3 h-3" />, label: 'Optimized' },
      'needs-work': { color: 'bg-yellow-500/20 text-yellow-400', icon: <BarChart3 className="w-3 h-3" />, label: 'Needs Optimization' },
      'poor': { color: 'bg-red-500/20 text-red-400', icon: <ShieldAlert className="w-3 h-3" />, label: 'Poor Optimization' }
    }[evaluation.status];

    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
        {config.icon}
        {config.label} ({evaluation.score}%)
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Globe className="text-blue-400 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">WordPress Content Sync</h2>
              <p className="text-gray-400 text-sm">Analyze existing articles and find SEO opportunities.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isConnected && (
              <>
                <button 
                  onClick={scanAll}
                  disabled={isLoading || evaluatingIds.size > 0}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                >
                  <Zap className="w-4 h-4" /> Quick Scan Gaps
                </button>
                <button 
                  onClick={() => handleConnect()}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </>
            )}
          </div>
        </div>

        {!isConnected ? (
          <form onSubmit={handleConnect} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-3 h-3" /> Website URL
              </label>
              <input 
                name="url"
                value={connection.url}
                onChange={handleChange}
                placeholder="https://yourblog.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3 h-3" /> Username
              </label>
              <input 
                name="username"
                value={connection.username}
                onChange={handleChange}
                placeholder="admin"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Key className="w-3 h-3" /> App Password
              </label>
              <input 
                name="appPassword"
                type="password"
                value={connection.appPassword}
                onChange={handleChange}
                placeholder="xxxx xxxx xxxx xxxx"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="md:col-span-3">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Connect & List Articles"}
              </button>
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                Note: Use "Application Passwords" from your WordPress Profile page.
              </p>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm mb-6">
            <CheckCircle className="w-4 h-4" /> Connected to {connection.url}
            <button onClick={() => setIsConnected(false)} className="ml-auto underline hover:text-white">Change Site</button>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {isConnected && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => {
            const isEvaluating = evaluatingIds.has(post.id);
            const evaluation = post.seoEvaluation;

            return (
              <div key={post.id} className={`bg-gray-800 border rounded-2xl p-6 transition-all group shadow-xl ${
                evaluation?.status === 'poor' ? 'border-red-500/30' : 
                evaluation?.status === 'needs-work' ? 'border-yellow-500/30' : 
                'border-gray-700 hover:border-indigo-500/50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${post.status === 'publish' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {post.status}
                      </span>
                      {getStatusBadge(evaluation)}
                      {!evaluation && (
                        <button 
                          onClick={() => handleEvaluate(post.id)}
                          disabled={isEvaluating}
                          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          {isEvaluating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <BarChart3 className="w-3 h-3" />}
                          {isEvaluating ? 'Evaluating...' : 'Quick Audit'}
                        </button>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  </div>
                  <a href={post.link} target="_blank" rel="noreferrer" className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
                
                <div 
                  className="text-gray-400 text-sm mb-6 line-clamp-2 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered || post.content.rendered.substring(0, 150) + '...' }}
                />

                {evaluation && (
                  <div className="mb-6 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                    <p className="text-[11px] text-gray-300 italic mb-2">"{evaluation.analysis}"</p>
                    <div className="flex flex-wrap gap-1">
                      {evaluation.suggestions.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[9px] bg-gray-700 text-gray-400 px-2 py-0.5 rounded flex items-center gap-1">
                          <Zap className="w-2 h-2 text-yellow-500" /> {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {new Date(post.date).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => onSelectPost(post, connection)}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                      evaluation?.status === 'poor' ? 'bg-red-600 hover:bg-red-500' :
                      evaluation?.status === 'needs-work' ? 'bg-yellow-600 hover:bg-yellow-500' :
                      'bg-indigo-600 hover:bg-indigo-500'
                    } text-white`}
                  >
                    <Search className="w-3 h-3" /> 
                    {evaluation?.status === 'optimized' ? 'Review & Enhance' : 'Optimize Content'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};