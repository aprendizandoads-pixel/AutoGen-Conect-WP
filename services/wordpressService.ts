import { GoogleGenAI, Type } from "@google/genai";
import { WordPressConnection, WordPressPost, SeoEvaluation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchWordPressPosts = async (conn: WordPressConnection): Promise<WordPressPost[]> => {
  const baseUrl = conn.url.endsWith('/') ? conn.url : `${conn.url}/`;
  const apiUrl = `${baseUrl}wp-json/wp/v2/posts?per_page=20&_embed`;
  
  const headers = new Headers();
  headers.set('Authorization', 'Basic ' + btoa(conn.username + ":" + conn.appPassword));

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch posts: ${response.status}`);
  }

  return response.json();
};

export const updateWordPressPost = async (conn: WordPressConnection, postId: number, data: any): Promise<void> => {
  const baseUrl = conn.url.endsWith('/') ? conn.url : `${conn.url}/`;
  const apiUrl = `${baseUrl}wp-json/wp/v2/posts/${postId}`;
  
  const headers = new Headers();
  headers.set('Authorization', 'Basic ' + btoa(conn.username + ":" + conn.appPassword));
  headers.set('Content-Type', 'application/json');

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to update post: ${response.status}`);
  }
};

export const evaluateWpPost = async (post: WordPressPost): Promise<SeoEvaluation> => {
  const prompt = `
    Analyze the following WordPress post for SEO optimization quality.
    Title: ${post.title.rendered}
    Content Preview: ${post.content.rendered.substring(0, 3000)}

    Evaluate based on:
    1. Title keyword strength.
    2. Content depth and semantic richness.
    3. Mobile responsiveness (predictive based on HTML tags).
    4. Readiness for search ranking.

    Return a JSON object with:
    - score: (number 0-100)
    - status: ("optimized" if 80+, "needs-work" if 50-79, "poor" if <50)
    - analysis: (short 1-2 sentence description)
    - suggestions: (array of strings for improvement)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            status: { type: Type.STRING },
            analysis: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "status", "analysis", "suggestions"]
        }
      }
    });

    if (!response.text) throw new Error("Evaluation failed");
    return JSON.parse(response.text) as SeoEvaluation;
  } catch (error) {
    console.error("SEO Evaluation Error:", error);
    return {
      score: 0,
      status: 'poor',
      analysis: 'Could not perform evaluation at this time.',
      suggestions: ['Check API connection and try again.']
    };
  }
};