import React, { useState, useMemo } from 'react';
import { GeneratedContent } from '../types';
import { Copy, Code, Eye, FileJson, Check, Download, Layers, Monitor, ShieldCheck, AlertCircle, CheckCircle2, FileText, FileCode, Globe, RefreshCw, ListChecks } from 'lucide-react';

interface ContentDisplayProps {
  content: GeneratedContent;
  onUpdateWordPress?: () => void;
  isUpdatingWp?: boolean;
}

interface AuditResult {
  label: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, onUpdateWordPress, isUpdatingWp }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'full' | 'elementor' | 'gutenberg' | 'audit' | 'json'>('preview');
  const [copied, setCopied] = useState(false);

  // Advanced SEO Audit Logic
  const auditResults = useMemo(() => {
    const results: AuditResult[] = [];
    
    // Title Audit
    const titleLen = content.metaTitle.length;
    if (titleLen >= 45 && titleLen <= 65) {
      results.push({ label: 'Meta Title', status: 'success', message: `Excelente tamanho (${titleLen} caracteres). Visível na SERP.` });
    } else {
      results.push({ label: 'Meta Title', status: 'warning', message: `Tamanho de ${titleLen} caracteres. O ideal é entre 45-65 para evitar cortes.` });
    }

    // Description Audit
    const descLen = content.metaDescription.length;
    if (descLen >= 110 && descLen <= 160) {
      results.push({ label: 'Meta Description', status: 'success', message: `Ótimo tamanho (${descLen} caracteres). CTR otimizado.` });
    } else {
      results.push({ label: 'Meta Description', status: 'warning', message: `Tamanho de ${descLen} caracteres. O ideal é entre 110-160.` });
    }

    // Header Hierarchy Audit
    const parser = new DOMParser();
    const doc = parser.parseFromString(content.htmlContent, 'text/html');
    const h1Count = doc.querySelectorAll('h1').length;
    const h2Count = doc.querySelectorAll('h2').length;

    if (h1Count === 1) {
      results.push({ label: 'Tags H1', status: 'success', message: 'H1 único detectado. Perfeito para relevância semântica.' });
    } else if (h1Count === 0) {
      results.push({ label: 'Tags H1', status: 'error', message: `Faltando tag H1. SEO exige exatamente UMA.` });
    } else {
      results.push({ label: 'Tags H1', status: 'error', message: `Detectadas ${h1Count} tags H1. SEO exige exatamente UMA.` });
    }

    if (h2Count >= 2) {
      results.push({ label: 'Tags H2', status: 'success', message: `${h2Count} subtópicos (H2) encontrados. Boa escaneabilidade.` });
    } else {
      results.push({ label: 'Tags H2', status: 'warning', message: 'Poucos subtópicos (H2). Considere dividir o conteúdo para melhor leitura.' });
    }

    // JSON-LD Audit
    try {
      const schema = JSON.parse(content.jsonLd);
      const schemaTypes = Array.isArray(schema['@graph']) 
        ? schema['@graph'].map((i: any) => i['@type']) 
        : [schema['@type']];
      
      results.push({ label: 'Structured Data', status: 'success', message: `Esquemas detectados: ${schemaTypes.join(', ')}.` });
      
      if (schemaTypes.includes('FAQPage')) {
        results.push({ label: 'Rich Snippets', status: 'success', message: 'FAQPage schema detectado! Chances de aparecer no topo com perguntas.' });
      }
      if (schemaTypes.includes('VideoObject')) {
        results.push({ label: 'Rich Snippets', status: 'success', message: 'VideoObject schema detectado! Otimizado para busca de vídeos.' });
      }
    } catch (e) {
      results.push({ label: 'Structured Data', status: 'error', message: 'JSON-LD inválido ou mal formatado.' });
    }

    // Content Depth
    const wordCount = doc.body.innerText.split(/\s+/).length;
    if (wordCount > 600) {
      results.push({ label: 'Profundidade', status: 'success', message: `Conteúdo denso com aprox. ${wordCount} palavras.` });
    } else {
      results.push({ label: 'Profundidade', status: 'warning', message: `Conteúdo curto (${wordCount} palavras). Artigos com +1000 palavras ranqueiam melhor.` });
    }

    return results;
  }, [content]);

  const getFullBundle = () => {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.metaTitle}</title>
    <meta name="description" content="${content.metaDescription}">
    <style>
      /* AI Generated Prefixed Styles */
      ${content.cssContent || ''}
      
      /* Global Resets & App Integration */
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
      img { max-width: 100%; height: auto; display: block; }
      .seo-gen-img { border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 2rem auto; }
      .seo-container { max-width: 800px; margin: 0 auto; padding: 40px 20px; box-sizing: border-box; }
    </style>
    <script type="application/ld+json">
      ${content.jsonLd}
    </script>
</head>
<body>
    <div class="seo-container">
      ${content.htmlContent}
    </div>
    <script>
      ${content.jsContent || ''}
    </script>
</body>
</html>`;
  };

  const getMarkdown = () => {
    let md = `# ${content.metaTitle}\n\n`;
    md += `**Meta Description:** ${content.metaDescription}\n\n---\n\n`;
    let cleanHtml = content.htmlContent
      .replace(/<div class="seo-gen-content">/gi, '')
      .replace(/<\/div>/gi, '')
      .replace(/<h1.*?>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2.*?>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3.*?>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<p.*?>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<li.*?>(.*?)<\/li>/gi, '* $1\n')
      .replace(/<.*?>/gi, ''); 
    return md + cleanHtml;
  };

  const getPlainText = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content.htmlContent, 'text/html');
    return `TITLE: ${content.metaTitle}\nDESCRIPTION: ${content.metaDescription}\n\nCONTENT:\n${doc.body.innerText}`;
  };

  const getElementorCode = () => {
    return `
<style>
${content.cssContent || ''}
</style>
${content.htmlContent}
<script>
${content.jsContent || ''}
</script>
    `.trim();
  };

  const handleCopy = () => {
    let textToCopy = '';
    if (activeTab === 'full') textToCopy = getFullBundle();
    else if (activeTab === 'elementor') textToCopy = getElementorCode();
    else if (activeTab === 'json') textToCopy = content.jsonLd;
    else textToCopy = content.htmlContent;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (filename: string, text: string, type: string = 'text/html') => {
    const element = document.createElement("a");
    const file = new Blob([text], {type});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
      {/* Metadata Header */}
      <div className="p-6 bg-gray-900/50 border-b border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">SEO Title Tag</label>
          <p className="text-white font-medium">{content.metaTitle}</p>
        </div>
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Description</label>
           <p className="text-gray-300">{content.metaDescription}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-gray-900 border-b border-gray-700">
        <div className="flex flex-wrap gap-1 p-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <ListChecks className="w-4 h-4" /> SEO Audit
          </button>
          <button
            onClick={() => setActiveTab('full')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              activeTab === 'full' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Code className="w-4 h-4" /> HTML Bundle
          </button>
          <button
            onClick={() => setActiveTab('elementor')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              activeTab === 'elementor' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Layers className="w-4 h-4" /> WP / Elementor
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              activeTab === 'json' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <FileJson className="w-4 h-4" /> Schema
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 p-2 bg-gray-900 md:bg-transparent border-t md:border-t-0 border-gray-700">
          <div className="flex gap-1">
             <button
                onClick={() => downloadFile('seo-publication.html', getFullBundle())}
                title="Download HTML"
                className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-all"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => downloadFile('seo-publication.md', getMarkdown(), 'text/markdown')}
                title="Download Markdown"
                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              >
                <FileCode className="w-4 h-4" />
              </button>
              <button
                onClick={() => downloadFile('seo-publication.txt', getPlainText(), 'text/plain')}
                title="Download TXT"
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all"
              >
                <FileText className="w-4 h-4" />
              </button>
          </div>

          {onUpdateWordPress && (
            <button
              onClick={onUpdateWordPress}
              disabled={isUpdatingWp}
              className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 text-sm transition-all shadow-lg"
            >
              {isUpdatingWp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              {isUpdatingWp ? 'Updating...' : 'Update WordPress'}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-300 flex items-center justify-center gap-2 text-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-0 bg-white min-h-[600px] text-gray-900 overflow-y-auto max-h-[850px]">
        {activeTab === 'preview' && (
          <div className="p-8">
            <style>{content.cssContent}</style>
            <div dangerouslySetInnerHTML={{ __html: content.htmlContent }} />
            <script dangerouslySetInnerHTML={{ __html: content.jsContent || '' }} />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="p-8 bg-gray-50 min-h-[600px]">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
               <ShieldCheck className="text-emerald-600 w-6 h-6" /> Relatório de Auditoria Técnica SEO
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditResults.map((res, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${
                    res.status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                    res.status === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                    'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="mt-0.5">
                      {res.status === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> :
                       res.status === 'warning' ? <AlertCircle className="w-5 h-5 text-amber-600" /> :
                       <AlertCircle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs uppercase tracking-wide opacity-70 mb-1">{res.label}</div>
                      <p className="text-sm font-medium leading-relaxed">{res.message}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'full' && (
          <pre className="p-6 bg-[#1e1e1e] text-blue-300 font-mono text-xs overflow-x-auto min-h-[600px]">
            {getFullBundle()}
          </pre>
        )}

        {activeTab === 'elementor' && (
          <div className="p-6 bg-[#1e1e1e] min-h-[600px]">
             <div className="mb-4 bg-pink-900/20 border border-pink-500/30 p-3 rounded text-pink-300 text-xs">
                <strong>Dica WordPress:</strong> Cole o código abaixo em um widget HTML do Elementor ou Bloco HTML do Gutenberg. O CSS já está prefixado para evitar bugs de layout.
             </div>
             <pre className="text-pink-300 font-mono text-xs overflow-x-auto">
               {getElementorCode()}
             </pre>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="p-6 bg-[#1e1e1e] min-h-[600px]">
            <pre className="text-green-300 font-mono text-xs overflow-x-auto">
              {JSON.stringify(JSON.parse(content.jsonLd), null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};