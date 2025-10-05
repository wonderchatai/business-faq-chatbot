
import { Hono } from 'hono'

const app = new Hono()

app.post('/', async (c) => {
  const { message } = await c.req.json()
  // In a real application, you would read the system prompt and FAQ from files.
  // For simplicity, we are hardcoding them here.
  const systemPrompt = `You are a friendly and helpful chatbot for a hair salon. Your name is [Your Salon Name]'s Assistant. You are here to answer questions about our salon, services, and policies. Please be polite and professional in all your responses.

Here are some frequently asked questions that you can use to help answer user queries:

# Hair Salon FAQ

**Q: What are your hours?**
A: We are open Tuesday-Saturday from 9am to 6pm. We are closed on Sundays and Mondays.

**Q: How do I book an appointment?**
A: You can book an appointment online through our website or by calling us at [Your Salon Phone Number].

**Q: What is your cancellation policy?**
A: We require 24 hours notice for all cancellations. Cancellations made within 24 hours of the appointment time will be charged 50% of the service fee.

**Q: What are your prices for a haircut?**
A: A standard haircut starts at $50. Prices may vary depending on the length and thickness of your hair, and the specific services requested.

**Q: Do you offer hair coloring services?**
A: Yes, we offer a full range of hair coloring services, including full color, highlights, and balayage. Please contact us for a consultation and pricing.

**Q: What payment methods do you accept?**
A: We accept all major credit cards, debit cards, and cash.

If the user asks a question not covered in the FAQ, you can say, 'I'm sorry, I don't have the answer to that question. Please contact us directly at [Your Salon Phone Number] for more information.'`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      stream: true
    })
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream'
    }
  })
})

export default app
