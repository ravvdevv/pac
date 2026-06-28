import { getSystemPrompt, getUserPrompt, FOLLOWUP_PROMPT, getFollowUpPrompt } from './prompts.js';

export async function* callAI(config, input, target = 'general') {
  yield* callProvider(config, getSystemPrompt(target), getUserPrompt(input, target));
}

export async function* callFollowUp(config, currentPrompt, instructions) {
  yield* callProvider(config, FOLLOWUP_PROMPT, getFollowUpPrompt(currentPrompt, instructions));
}

async function* callProvider(config, systemPrompt, userMessage) {
  const { provider, apiKey, model } = config;

  if (provider === 'openrouter') {
    yield* callOpenAICompatible(
      'https://openrouter.ai/api/v1/chat/completions',
      apiKey,
      model,
      systemPrompt,
      userMessage
    );
  } else if (provider === 'groq') {
    yield* callOpenAICompatible(
      'https://api.groq.com/openai/v1/chat/completions',
      apiKey,
      model,
      systemPrompt,
      userMessage
    );
  } else if (provider === 'gemini') {
    yield* callGemini(apiKey, model, systemPrompt, userMessage);
  } else {
    throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function* callOpenAICompatible(url, apiKey, model, systemPrompt, userMessage) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/pac-cli',
      'X-Title': 'pac-cli'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      stream: true
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const dataStr = line.slice(6).trim();
        if (dataStr === '[DONE]') return;

        try {
          const data = JSON.parse(dataStr);
          const content = data.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch (e) {
          // Ignore parse errors for incomplete chunks
        }
      }
    }
  }
}

async function* callGemini(apiKey, model, systemPrompt, userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt + '\n\n' + userMessage }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API request failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) yield content;
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
}

