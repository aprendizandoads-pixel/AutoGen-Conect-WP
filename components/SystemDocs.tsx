import React from 'react';
import { BookOpen, Zap, Target, Layout, ShieldCheck, Download, Code, Smartphone, Globe } from 'lucide-react';

export const SystemDocs: React.FC = () => {
  const sections = [
    {
      title: "Core Functionalities",
      icon: <Zap className="text-yellow-400" />,
      items: [
        "Competitive Research: Scrapes top 5 Google results to find content gaps.",
        "Deep Content Engineering: Uses the 'Skyscraper Technique' to build superior articles.",
        "Conversion Optimization: Integrated CTA (Call to Action) placement and copywriting.",
        "Automated Media: AI Image generation tailored to your content context."
      ]
    },
    {
      title: "Technical Features",
      icon: <Code className="text-blue-400" />,
      items: [
        "Fully Responsive CSS: Mobile-first design for all devices.",
        "Semantic HTML: Optimized for screen readers and search bots.",
        "Automated Schema: VideoObject, FAQ, Article, and HowTo JSON-LD generation.",
        "Audit Tool: Real-time validation of title, description, and header structure."
      ]
    },
    {
      title: "Export & Compatibility",
      icon: <Download className="text-green-400" />,
      items: [
        "Elementor Pro: 100% compatible HTML widgets.",
        "Gutenberg: Standard WP blocks optimization.",
        "Multi-Format: Export as HTML, Markdown, TXT, or JSON.",
        "Global: Support for Portuguese, English, Spanish, and more."
      ]
    }
  ];

  const benefits = [
    { icon: <Target className="w-5 h-5" />, text: "Higher SERP Rankings" },
    { icon: <Smartphone className="w-5 h-5" />, text: "Mobile-Perfect Layouts" },
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Technical SEO Compliance" },
    { icon: <Globe className="w-5 h-5" />, text: "Scalable Content Production" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full text-indigo-400 font-bold text-sm uppercase tracking-widest border border-indigo-500/20">
          <BookOpen className="w-4 h-4" /> System Documentation
        </div>
        <h2 className="text-4xl font-black text-white">Advanced SEO Dominator Guide</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Learn how to leverage every function of this system to dominate the search results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((b, i) => (
          <div key={i} className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="text-indigo-400">{b.icon}</div>
            <span className="text-gray-200 font-medium">{b.text}</span>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              {section.icon}
              {section.title}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to outrank everyone?</h3>
          <p className="text-indigo-100 mb-6 max-w-lg">
            Start by entering a keyword. Our AI will handle the analysis, strategy, and content engineering automatically.
          </p>
        </div>
        <Zap className="absolute top-1/2 -right-10 -translate-y-1/2 w-48 h-48 text-white/5 group-hover:text-white/10 transition-colors" />
      </div>
    </div>
  );
};
