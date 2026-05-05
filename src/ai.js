import { SYSTEM_PROMPT, getUserPrompt, FOLLOWUP_PROMPT, getFollowUpPrompt } from './prompts.js';

export async function callAI(config, input) {
  return callProvider(config, SYSTEM_PROMPT, getUserPrompt(input));
}

export async function callFollowUp(config, currentPrompt, instructions) {
  return callProvider(config, FOLLOWUP_PROMPT, getFollowUpPrompt(currentPrompt, instructions));
}

async function callProvider(config, systemPrompt, userMessage) {
  const { provider, apiKey, model } = config;

  if (provider === 'openrouter') {
    return callOpenAICompatible(
      'https://openrouter.ai/api/v1/chat/completions',
      apiKey,
      model,
      systemPrompt,
      userMessage
    );
  } else if (provider === 'groq') {
    return callOpenAICompatible(
      'https://api.groq.com/openai/v1/chat/completions',
      apiKey,
      model,
      systemPrompt,
      userMessage
    );
  } else if (provider === 'gemini') {
    return callGemini(apiKey, model, systemPrompt, userMessage);
  } else {
    throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function callOpenAICompatible(url, apiKey, model, systemPrompt, userMessage) {
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
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('API returned an empty response. Please try again.');
  }
  
  return content;
}

async function callGemini(apiKey, model, systemPrompt, userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('Gemini returned an empty response. This might be due to safety filters or a temporary issue.');
  }

  return content;
}
