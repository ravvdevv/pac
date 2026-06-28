import { select, input, Separator } from '@inquirer/prompts';
import pc from 'picocolors';
import os from 'os';
import { readFile, writeFile, access } from 'node:fs/promises';

const CONFIG_PATH = `${os.homedir()}/.pacrc.json`;

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export const PROVIDERS = [
  { name: 'OpenRouter (Default)', value: 'openrouter' },
  { name: 'Gemini', value: 'gemini' },
  { name: 'Groq', value: 'groq' }
];

export const STATIC_MODELS = {
  openrouter: [
    { name: 'Gemini 2.0 Flash (Fast & Smart)', value: 'google/gemini-2.0-flash-001' },
    { name: 'GPT-4o Mini', value: 'openai/gpt-4o-mini' },
    { name: 'Claude 3.5 Sonnet', value: 'anthropic/claude-3.5-sonnet' }
  ],
  gemini: [
    { name: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
    { name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' }
  ],
  groq: [
    { name: 'Llama 3.3 70B Versatile', value: 'llama-3.3-70b-versatile' },
    { name: 'Mixtral 8x7B', value: 'mixtral-8x7b-32768' }
  ]
};

async function fetchOpenRouterModels() {
  const { default: ora } = await import('ora');
  const spinner = ora('Fetching OpenRouter models...').start();
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models');
    const data = await response.json();
    spinner.stop();
    return data.data.map(m => ({
      name: `${m.name}`,
      value: m.id,
      description: m.id
    }));
  } catch (e) {
    spinner.fail('Failed to fetch OpenRouter models. Using fallback list.');
    return STATIC_MODELS.openrouter;
  }
}

export async function getConfig() {
  if (await fileExists(CONFIG_PATH)) {
    try {
      const content = await readFile(CONFIG_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error(pc.red('Error reading config file. Re-initializing...'));
    }
  }
  return await onboard();
}

async function onboard() {
  console.log(pc.cyan(pc.bold('Setup required.')) + pc.dim(' Let\'s get you set up.\n'));

  // 1. Select Provider
  const provider = await select({
    message: 'Select AI Provider:',
    choices: PROVIDERS,
    default: 'openrouter'
  });

  // 2. Paste API Key
  const apiKey = await input({
    message: 'Paste your API Key:',
    validate: (val) => val.trim().length > 0 || 'API Key is required'
  });

  // 3. Select Model
  let model;
  if (provider === 'openrouter') {
    const recommended = STATIC_MODELS.openrouter;
    
    const initialChoice = await select({
      message: 'Select AI Model:',
      choices: [
        ...recommended,
        new Separator(),
        { name: 'Search all models...', value: 'SEARCH_ALL' }
      ]
    });

    if (initialChoice === 'SEARCH_ALL') {
      const allModels = await fetchOpenRouterModels();
      const { default: search } = await import('@inquirer/search');
      model = await search({
        message: 'Type to search for a model:',
        source: async (input) => {
          if (!input) return allModels.slice(0, 50);
          return allModels.filter(m => 
            m.name.toLowerCase().includes(input.toLowerCase()) || 
            m.value.toLowerCase().includes(input.toLowerCase())
          );
        }
      });
    } else {
      model = initialChoice;
    }
  } else {
    model = await select({
      message: 'Select AI Model:',
      choices: STATIC_MODELS[provider]
    });
  }

  const config = { provider, model, apiKey };

  await saveConfig(config);
  console.log(pc.green('\nConfiguration saved successfully!\n'));
  
  return config;
}

export async function saveConfig(config) {
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export async function updateConfig(updates) {
  let current = { provider: 'openrouter', model: 'google/gemini-2.0-flash-001' };
  
  if (await fileExists(CONFIG_PATH)) {
    try {
      const content = await readFile(CONFIG_PATH, 'utf-8');
      current = JSON.parse(content);
    } catch (e) {}
  }
  
  const updated = { ...current, ...updates };
  await saveConfig(updated);
  return updated;
}

export async function viewConfig() {
  if (!(await fileExists(CONFIG_PATH))) {
    console.log(pc.yellow('No configuration found. Run pac to get started.'));
    return;
  }
  const content = await readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(content);
  console.log(pc.bold(pc.cyan('\nCurrent Configuration:')));
  console.log(pc.dim('File: ') + CONFIG_PATH + '\n');
  Object.entries(config).forEach(([key, value]) => {
    if (key === 'apiKey') {
      console.log(`${pc.bold(key)}: ${value.substring(0, 4)}...${value.substring(value.length - 4)}`);
    } else {
      console.log(`${pc.bold(key)}: ${value}`);
    }
  });

  const change = await select({
    message: 'Change something?',
    choices: [
      { name: 'Provider', value: 'provider' },
      { name: 'Model', value: 'model' },
      { name: 'API Key', value: 'apiKey' },
      { name: pc.dim('Nothing'), value: null },
    ]
  });
  if (!change) return;

  const updates = {};
  if (change === 'provider') {
    updates.provider = await select({ message: 'Select provider:', choices: PROVIDERS });
    if (updates.provider === 'openrouter') {
      const recommended = STATIC_MODELS.openrouter;
      const model = await select({ message: 'Select model:', choices: recommended });
      updates.model = model;
    } else {
      updates.model = await select({ message: 'Select model:', choices: STATIC_MODELS[updates.provider] });
    }
  } else if (change === 'model') {
    updates.model = await select({ message: 'Select model:', choices: Object.values(STATIC_MODELS).flat() });
    updates.model = model;
  } else if (change === 'apiKey') {
    updates.apiKey = await input({ message: 'Paste your API key:', validate: v => v.trim().length > 0 });
  }

  await updateConfig(updates);
  console.log(pc.green('Configuration updated.\n'));
}

export async function clearConfig() {
  if (await fileExists(CONFIG_PATH)) {
    const { unlink } = await import('node:fs/promises');
    await unlink(CONFIG_PATH);
  }
}


