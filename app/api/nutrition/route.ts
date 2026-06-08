import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { foodName } = await req.json();

    if (!foodName) {
      return NextResponse.json({ error: 'Food name is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Anthropic API Key is missing in environment variables.' }, { status: 500 });
    }

    const prompt = `Translate the following food name from English, Bengali, or Hindi into English if necessary. Then provide the nutritional data per 100g for "${foodName}" (Indian food context). Return ONLY a valid JSON object, nothing else. Format must be strictly: {"cal":number,"protein":number,"iron":number,"calcium":number,"vitC":number,"folate":number,"fiber":number}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Anthropic API Error:", errorData);
      return NextResponse.json({ error: 'Failed to fetch data from AI service.' }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract JSON from the text response
    const textContent = data.content.find((c: any) => c.type === 'text')?.text || '';
    const cleanJsonString = textContent.replace(/```json|```/g, '').trim();
    
    try {
      const nutritionData = JSON.parse(cleanJsonString);
      return NextResponse.json(nutritionData);
    } catch (parseError) {
      console.error("Failed to parse JSON from AI response:", textContent);
      return NextResponse.json({ error: 'AI returned invalid data format.' }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in nutrition API:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
