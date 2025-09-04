import OpenAI from 'openai';

interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Spentify',
  },
});

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  // Check if API key is available
  if (!process.env.OPENROUTER_API_KEY || 
      process.env.OPENROUTER_API_KEY === 'your-openrouter-api-key' ||
      process.env.OPENROUTER_API_KEY === 'INVALID_KEY_NEEDS_REPLACEMENT') {
    // Return helpful mock insights when no API key is configured
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categories = [...new Set(expenses.map(e => e.category))];
    
    return [
      {
        id: 'mock-1',
        type: 'info',
        title: 'API Key Required',
        message: `You have ₹${totalAmount.toFixed(2)} in total expenses across ${categories.length} categories. To get AI-powered insights, please add your OpenRouter or OpenAI API key to the .env.local file.`,
        action: 'Configure API key in .env.local',
        confidence: 1.0,
      },
      {
        id: 'mock-2',
        type: 'tip',
        title: 'Getting Started',
        message: `Visit openrouter.ai to get a free API key and unlock intelligent spending analysis, category suggestions, and personalized financial recommendations.`,
        action: 'Get API key at openrouter.ai',
        confidence: 1.0,
      },
    ];
  }

  try {
    // Prepare expense data for AI analysis
    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Analyze the following expense data and provide 3-4 actionable financial insights. 
    Return a JSON array of insights with this structure:
    {
      "type": "warning|info|success|tip",
      "title": "Brief title",
      "message": "Detailed insight message with specific numbers when possible (use ₹ symbol for currency, not $)",
      "action": "Actionable suggestion",
      "confidence": 0.8
    }

    IMPORTANT: All monetary amounts should be displayed using Indian Rupees (₹) symbol, NOT dollars ($).

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Focus on:
    1. Spending patterns (day of week, categories)
    2. Budget alerts (high spending areas)
    3. Money-saving opportunities
    4. Positive reinforcement for good habits

    Return only valid JSON array, no additional text. Always use ₹ symbol for any monetary amounts.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use more reliable model
      messages: [
        {
          role: 'system',
          content:
            'You are a financial advisor AI that analyzes spending patterns and provides actionable insights. Always respond with valid JSON only. Use Indian Rupees (₹) symbol for all monetary amounts, never use dollars ($).',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices?.[0]?.message?.content;
    console.log('AI Response:', response); // Debug log
    if (!response) {
      console.error('Empty response from AI model');
      throw new Error('No response from AI');
    }

    // Clean the response by removing markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    // Parse AI response
    const insights = JSON.parse(cleanedResponse);

    // Add IDs and ensure proper format
    const formattedInsights = insights.map(
      (insight: RawInsight, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        type: insight.type || 'info',
        title: insight.title || 'AI Insight',
        message: insight.message || 'Analysis complete',
        action: insight.action,
        confidence: insight.confidence || 0.8,
      })
    );

    return formattedInsights;
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);

    // Fallback to mock insights if AI fails
    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message:
          'Unable to generate personalized insights at this time. Please try again later.',
        action: 'Refresh insights',
        confidence: 0.5,
      },
    ];
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use same reliable model
      messages: [
        {
          role: 'system',
          content:
            'You are an expense categorization AI. Categorize expenses into one of these categories: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Other. Respond with only the category name.',
        },
        {
          role: 'user',
          content: `Categorize this expense: "${description}"`,
        },
      ],
      temperature: 0.1,
      max_tokens: 20,
    });

    const category = completion.choices[0].message.content?.trim();

    const validCategories = [
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Bills',
      'Healthcare',
      'Other',
    ];

    const finalCategory = validCategories.includes(category || '')
      ? category!
      : 'Other';
    return finalCategory;
  } catch (error) {
    console.error('❌ Error categorizing expense:', error);
    return 'Other';
  }
}

export async function generateAIAnswer(
  question: string,
  context: ExpenseRecord[]
): Promise<string> {
  // Check if API key is available
  if (!process.env.OPENROUTER_API_KEY || 
      process.env.OPENROUTER_API_KEY === 'your-openrouter-api-key' ||
      process.env.OPENROUTER_API_KEY === 'INVALID_KEY_NEEDS_REPLACEMENT') {
    const totalAmount = context.reduce((sum, expense) => sum + expense.amount, 0);
    return `I need an API key to provide detailed AI analysis. Currently, you have ₹${totalAmount.toFixed(2)} in expenses. To get personalized AI answers, please add your OpenRouter API key to the .env.local file.`;
  }

  try {
    const expensesSummary = context.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Based on the following expense data, provide a detailed and actionable answer to this question: "${question}"

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Provide a comprehensive answer that:
    1. Addresses the specific question directly
    2. Uses concrete data from the expenses when possible (use ₹ symbol for currency, not $)
    3. Offers actionable advice
    4. Keeps the response concise but informative (2-3 sentences)
    
    IMPORTANT: Always use Indian Rupees (₹) symbol for any monetary amounts, NOT dollars ($).
    
    Return only the answer text, no additional formatting.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use same reliable model
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful financial advisor AI that provides specific, actionable answers based on expense data. Be concise but thorough. Always use Indian Rupees (₹) symbol for monetary amounts, never dollars ($).',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    return response.trim();
  } catch (error) {
    console.error('❌ Error generating AI answer:', error);
    return "I'm unable to provide a detailed answer at the moment. Please try refreshing the insights or check your connection.";
  }
}
