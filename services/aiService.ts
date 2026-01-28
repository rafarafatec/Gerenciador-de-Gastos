import { GoogleGenAI } from "@google/genai";
import { Transaction, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (
  transactions: Transaction[],
  categories: Category[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Chave de API não configurada. Por favor, configure sua API Key para receber insights.";
  }

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as Record<string, string>);

  const summary = transactions.slice(-20).map(t => 
    `- ${t.date}: ${t.type === 'expense' ? 'Gasto' : 'Renda'} de R$${t.amount.toFixed(2)} em ${categoryMap[t.categoryId] || 'Outros'} (${t.description})`
  ).join('\n');

  const prompt = `
    Atue como um consultor financeiro pessoal experiente. 
    Analise as seguintes transações recentes de um usuário brasileiro:
    
    ${summary}

    Forneça 3 conselhos curtos, práticos e acionáveis em formato de lista (Markdown) para melhorar a saúde financeira deste usuário.
    Seja direto e encorajador.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Não foi possível gerar conselhos no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Erro ao conectar com a inteligência artificial. Tente novamente mais tarde.";
  }
};
