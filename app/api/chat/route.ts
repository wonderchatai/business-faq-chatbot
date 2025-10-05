import { NextRequest, NextResponse } from 'next/server';

const systemPrompt = `You are a friendly and helpful chatbot for a hair salon. Your name is [Your Salon Name]'s Assistant. You are here to answer questions about our salon, services, and policies. Please be polite and professional in all your responses.\n\nHere are some frequently asked questions that you can use to help answer user queries:\n\n# Hair Salon FAQ\n\n**Q: What are your hours?**\nA: We are open Tuesday-Saturday from 9am to 6pm. We are closed on Sundays and Mondays.\n\n**Q: How do I book an appointment?**\nA: You can book an appointment online through our website or by calling us at [Your Salon Phone Number].\n\n**Q: What is your cancellation policy?**\nA: We require 24 hours notice for all cancellations. Cancellations made within 24 hours of the appointment time will be charged 50% of the service fee.\n\n**Q: What are your prices for a haircut?**\nA: A standard haircut starts at $50. Prices may vary depending on the length and thickness of your hair, and the specific services requested.\n\n**Q: Do you offer hair coloring services?**\nA: Yes, we offer a full range of hair coloring services, including full color, highlights, and balayage. Please contact us for a consultation and pricing.\n\n**Q: What payment methods do you accept?**\nA: We accept all major credit cards, debit cards, and cash.\n\nIf the user asks a question not covered in the FAQ, you can say, 'I'm sorry, I don't have the answer to that question. Please contact us directly at [Your Salon Phone Number] for more information.'`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured.' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error.message || 'Failed to fetch from OpenAI' }, { status: response.status });
    }

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
