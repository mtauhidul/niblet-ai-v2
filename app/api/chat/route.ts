import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create different system prompts based on context
    let systemPrompt = '';
    
    if (context === 'nutrition_calculation') {
      systemPrompt = `You are a certified nutritionist and health expert. Your task is to calculate precise daily nutritional targets based on user profiles and goals. 

You must respond with ONLY a valid JSON object containing the calculated values. Do not include any explanatory text, markdown formatting, or additional commentary.

Consider these principles:
- Safe weight loss: 0.5-1kg per week (3500 calories = ~0.5kg fat)  
- Safe weight gain: 0.25-0.5kg per week
- BMR calculation: Use Mifflin-St Jeor equation
- Activity multipliers: Sedentary (1.2), Lightly active (1.375), Moderately active (1.55), Very active (1.725), Extremely active (1.9)
- Protein: 1.6-2.2g per kg body weight (higher for muscle gain/cutting)
- Fat: 20-30% of total calories (minimum 0.8g per kg body weight)
- Carbohydrates: Fill remaining calories after protein and fat
- Water: 35ml per kg body weight + activity needs (add 500-750ml for active individuals)
- Adjust calories based on goal: deficit for weight loss, surplus for weight gain`;
    } else {
      systemPrompt = `You are Niblet AI, a helpful health and fitness assistant. You provide personalized advice on nutrition, exercise, and wellness. Keep responses friendly, informative, and actionable.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using the more cost-effective model
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: context === 'nutrition_calculation' ? 500 : 1000,
      temperature: context === 'nutrition_calculation' ? 0.1 : 0.7, // Lower temperature for calculations
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';

    return NextResponse.json({ response });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Return a more specific error based on the error type
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API configuration error' },
          { status: 500 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}