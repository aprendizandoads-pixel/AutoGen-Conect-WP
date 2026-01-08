# 🧠 SEO Dominator AI: System Architecture & Re-creation Guide

This document serves as the master specification and instruction set for the **SEO Dominator AI**. It is designed to guide a senior-level AI engineer (or an autonomous AI agent) in re-creating, maintaining, or extending this high-performance SEO content engineering system.

## 🎯 System Philosophy
The system is built on the **"Skyscraper Technique"** of SEO: identifying the best existing content, analyzing its technical and creative weaknesses, and generating a superior version that is technically optimized (HTML5/JSON-LD), visually rich (AI Images), and strategically grounded (Competitor Analysis).

---

## 🛠️ Step-by-Step System Flow (The Logic Path)

### Phase 1: Input & Parameters (`components/InputForm.tsx`)
1.  **Context Capture**: User inputs primary keywords, secondary keywords (LSI), and specific questions for snippets.
2.  **Competitor Identification**: The system accepts manual URLs or uses Search Grounding to find rivals.
3.  **Format Configuration**: Selection of publication style (e.g., Blog Post, Video Article, Landing Page) which dictates the final HTML/CSS structure.
4.  **Provider Selection**: Routing logic to choose between Gemini (Native) or OpenAI (External) for text, and various providers for images.

### Phase 2: Intelligence Gathering (`services/geminiService.ts`)
1.  **Search Grounding**: The AI performs real-time queries via Google Search tool to browse current top-ranking pages.
2.  **Comparative Audit**: Extracting competitor strategies, identifying content gaps, and assigning performance scores.
3.  **Strategic Planning**: Generating a `SeoStrategy` object containing a content plan and projected traffic impact.

### Phase 3: Content Engineering (`services/geminiService.ts`)
1.  **Semantic Generation**: Producing clean, valid HTML5 wrapped in a prefixed container (`.seo-gen-content`) for WordPress compatibility.
2.  **Dynamic Styling**: Generating CSS that avoids global resets, ensuring it only affects generated content.
3.  **Contextual Image Tagging**: The AI places `[[IMAGE_PROMPT]]` markers inside the HTML based on the specific sub-topic of each section.
4.  **Structured Data (JSON-LD)**: Building a complex graph including `FAQPage` (if questions exist) and `VideoObject` (for video formats).

### Phase 4: Media Fulfillment
1.  **Placeholder Extraction**: A regex-based processor identifies markers in the generated HTML.
2.  **Async Rendering**: Simultaneous requests to image providers (Gemini 2.5 Image, Pollinations, or Unsplash).
3.  **Final Injection**: Replacing placeholders with styled `<img class="seo-gen-img">` tags.

### Phase 5: Technical Audit & Quality Control (`components/ContentDisplay.tsx`)
1.  **Hierarchy Check**: Validating exactly one H1 and multiple H2s.
2.  **Character Count**: Checking Meta Title (45-65 chars) and Description (110-160 chars) against SERP best practices.
3.  **Schema Validation**: Verifying the presence of critical SEO tags in the JSON-LD string.

### Phase 6: Integration & Sync (`services/wordpressService.ts`)
1.  **REST API Connection**: Authenticating via WordPress Application Passwords.
2.  **Content Patching**: Updating existing posts or creating new ones with the engineered HTML and Title.
3.  **Health Check**: Evaluating existing WP posts to find "Low Score" candidates for optimization.

---

## 🏗️ Technical Component Map

-   **`types.ts`**: The single source of truth. Defines the `GeneratedContent` and `SeoParams` interfaces to ensure strict type safety across the engine.
-   **`geminiService.ts`**: The "Brain." Contains complex prompt engineering that forces the LLM to return structured JSON instead of conversational text.
-   **`ContentDisplay.tsx`**: The "Reviewer." Decouples the preview, raw code, and audit results into a high-utility dashboard.
-   **`WordPressManager.tsx`**: The "Connector." Provides a bridge to live production environments.

---

## 🤖 Why use these documents to instruct a new AI?

1.  **Structured Logic over Fuzzy Ideas**: AI models perform significantly better when given a **Functional Specification** (how it works) combined with a **Schema** (data structure). 
2.  **Prompt Consistency**: The prompts in `geminiService.ts` use "few-shot" principles and "Strict JSON" enforcement. Instructing a new AI with these exact prompt patterns ensures the output doesn't "drift" into low-quality text.
3.  **Decoupling Architecture**: By showing a new AI the separation between `services` (logic) and `components` (UI), it learns to maintain clean code and avoid monolithic files.
4.  **Error Prevention**: Documenting the "Prefixed CSS" and "Placeholder Extraction" steps prevents a new AI from making common mistakes like breaking existing WordPress layouts or failing to render images.

## 🚀 Re-creation Instructions
To rebuild this system, the AI agent should:
1.  Initialize a React/TS project.
2.  Implement the `types.ts` interface first to establish data contracts.
3.  Develop the `geminiService.ts` using the provided prompt logic for high-quality JSON generation.
4.  Build the UI components (`InputForm`, `ContentDisplay`) ensuring they adhere to the Tailwind CSS/Lucide design system.
5.  Implement the regex-based media fulfillment loop to handle the transition from AI prompt-markers to actual image assets.

---
**Author**: World-Class Senior Frontend Engineer
**Version**: 2.5.0 (Optimized for Gemini 3 Pro)
