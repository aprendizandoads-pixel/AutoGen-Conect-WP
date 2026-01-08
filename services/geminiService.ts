import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, SeoParams, ImageProvider } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the selected provider.
 */
async function generateImage(provider: ImageProvider, prompt: string, negativePrompt?: string): Promise<string | null> {
  const query = encodeURIComponent(prompt.split(' ').slice(0, 5).join(' '));

  if (provider === 'unsplash') {
    return `https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1280&q=80&q=${query}`;
  }

  if (provider === 'lorem-flickr') {
    return `https://loremflickr.com/1280/720/${query}`;
  }

  if (provider === 'pollinations') {
    const fullPrompt = `${prompt}${negativePrompt ? ` | Avoid: ${negativePrompt}` : ''}`;
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&enhance=true&width=1280&height=720`;
    
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Pollinations fetch failed");
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn("Pollinations failed, returning direct URL as fallback", e);
      return imageUrl;
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `${prompt}. Ultra-realistic, high resolution, 8k, professional lighting, centered composition. ${negativePrompt ? `(Avoid: ${negativePrompt})` : ''}` }],
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error(`Gemini image generation failed`, error);
    return null;
  }
}

async function generateAiContent(params: SeoParams, prompt: string): Promise<GeneratedContent> {
  const geminiModel = "gemini-3-pro-preview";

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: params.aiProvider === 'openai' 
      ? `[MODO VIRTUAL GPT-4o COM GOOGLE SEARCH]\n\n${prompt}` 
      : prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strategy: {
            type: Type.OBJECT,
            properties: {
              competitorAnalysis: { 
                type: Type.ARRAY, 
                items: {
                  type: Type.OBJECT,
                  properties: {
                    url: { type: Type.STRING },
                    performanceScore: { type: Type.NUMBER },
                    demographics: { type: Type.STRING },
                    marketingStrategy: { type: Type.STRING },
                    strengths: { type: Type.STRING },
                    failures: { type: Type.STRING },
                    gapIdentified: { type: Type.STRING }
                  },
                  required: ["url", "performanceScore", "demographics", "marketingStrategy", "strengths", "failures", "gapIdentified"]
                }
              },
              gapAnalysis: { type: Type.STRING },
              contentPlan: { type: Type.STRING },
              projectedTrafficIncrease: { type: Type.NUMBER }
            },
            required: ["competitorAnalysis", "gapAnalysis", "contentPlan", "projectedTrafficIncrease"]
          },
          htmlContent: { type: Type.STRING },
          cssContent: { type: Type.STRING },
          jsContent: { type: Type.STRING },
          jsonLd: { type: Type.STRING },
          metaTitle: { type: Type.STRING },
          metaDescription: { type: Type.STRING }
        },
        required: ["strategy", "htmlContent", "cssContent", "jsContent", "jsonLd", "metaTitle", "metaDescription"]
      }
    }
  });

  if (!response.text) throw new Error("Empty response from AI engine.");
  return JSON.parse(response.text) as GeneratedContent;
}

export const generateSeoContent = async (params: SeoParams): Promise<GeneratedContent> => {
  const urls = params.competitorUrls
    ? params.competitorUrls.split(/[\n,]+/).map(url => url.trim()).filter(url => url.length > 0)
    : [];

  const urlSection = urls.length > 0
    ? `ANALISE ESTES URLs ESPECÍFICOS USANDO GOOGLE SEARCH:\n${urls.map((u, i) => `${i + 1}. ${u}`).join('\n')}`
    : "PESQUISE NO GOOGLE OS TOP 5 RESULTADOS PARA O TEMA E ANALISE AS LACUNAS.";

  const mainPrompt = `
    VOCÊ É UM ESTRATEGISTA DE SEO SÊNIOR. 
    OBJETIVO: SUPERAR A CONCORRÊNCIA NA POSIÇÃO #1 DO GOOGLE.
    TEMA: ${params.mainKeywords}
    FORMATO: ${params.publicationFormat.toUpperCase()}
    TOM: ${params.contentTone}
    ${urlSection}

    TAREFA 1: IMAGENS CONTEXTUAIS POR TÓPICO
    - Insira placeholders: [[IMAGE_PROMPT: Descrição | NEGATIVE_PROMPT: Evitar]].
    - CRÍTICO: As descrições das imagens devem ser ALTAMENTE ESPECÍFICAS ao conteúdo de cada seção/tópico gerado. Não use descrições genéricas. 
    - Se o tópico for "Performance do Processador", a imagem deve ser sobre hardware de alta tecnologia, não apenas "um computador".

    TAREFA 2: CSS PARA WORDPRESS (PREFIXADO)
    - O conteúdo HTML será envolvido em uma <div class="seo-gen-content">.
    - O CSS gerado DEVE ser prefixado com ".seo-gen-content" para evitar conflitos com temas do WordPress. 
    - Exemplo: .seo-gen-content h2 { ... } em vez de apenas h2 { ... }.

    TAREFA 3: SCHEMA AVANÇADO
    - Se format for 'video-article', o VideoObject DEVE incluir:
        * name, description (baseada no conteúdo).
        * thumbnailUrl (placeholder: "https://via.placeholder.com/1280x720.png?text=Thumbnail+Video").
        * uploadDate (formato ISO atual).
        * contentUrl (placeholder: "https://example.com/video.mp4").

    TAREFA 4: CONTEÚDO SEMÂNTICO
    - Envolva todo o htmlContent em <div class="seo-gen-content">...</div>.
    - Use HTML5 puro.

    RETORNE APENAS O JSON.
  `;

  try {
    const data = await generateAiContent(params, mainPrompt);

    // Process image placeholders with context-aware logic
    if (params.includeImages && data.htmlContent.includes('[[IMAGE_PROMPT:')) {
      const regex = /\[\[IMAGE_PROMPT:\s*(.*?)(?:\s*\|\s*NEGATIVE_PROMPT:\s*(.*?))?\]\]/g;
      let match;
      const replacements: { placeholder: string, prompt: string, negativePrompt?: string }[] = [];
      
      while ((match = regex.exec(data.htmlContent)) !== null) {
        replacements.push({ placeholder: match[0], prompt: match[1], negativePrompt: match[2] });
      }

      const results = await Promise.all(replacements.map(async (item) => ({
        ...item,
        imageUrl: await generateImage(params.imageProvider, item.prompt, item.negativePrompt)
      })));

      let updatedHtml = data.htmlContent;
      for (const res of results) {
        if (res.imageUrl) {
          // Enforcement of 'seo-gen-img' class as requested
          const imgTag = `<img src="${res.imageUrl}" alt="${res.prompt.replace(/"/g, '&quot;')}" class="seo-gen-img" loading="lazy" />`;
          updatedHtml = updatedHtml.replace(res.placeholder, imgTag);
        } else {
          updatedHtml = updatedHtml.replace(res.placeholder, '');
        }
      }
      data.htmlContent = updatedHtml;
    }

    return data;
  } catch (error) {
    console.error("Content Generation Error:", error);
    throw error;
  }
};