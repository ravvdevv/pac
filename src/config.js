import fs from 'fs';
import path from 'path';
import os from 'os';
import { select, input, Separator } from '@inquirer/prompts';
import search from '@inquirer/search';
import pc from 'picocolors';
import ora from 'ora';

const CONFIG_PATH = path.join(os.homedir(), '.pacrc.json');

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
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
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

  saveConfig(config);
  console.log(pc.green('\nConfiguration saved successfully!\n'));
  
  return config;
}

export function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function updateConfig(updates) {
  const current = fs.existsSync(CONFIG_PATH) 
    ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')) 
    : { provider: 'openrouter', model: 'google/gemini-2.0-flash-001' };
  
  const updated = { ...current, ...updates };
  saveConfig(updated);
  return updated;
}

export function viewConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.log(pc.yellow('No configuration found. Run pac to get started.'));
    return;
  }
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  console.log(pc.bold(pc.cyan('\nCurrent Configuration:')));
  console.log(pc.dim('File: ') + CONFIG_PATH + '\n');
  Object.entries(config).forEach(([key, value]) => {
    if (key === 'apiKey') {
      console.log(`${pc.bold(key)}: ${value.substring(0, 4)}...${value.substring(value.length - 4)}`);
    } else {
      console.log(`${pc.bold(key)}: ${value}`);
    }
  });
  console.log('');
}

export function clearConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    fs.unlinkSync(CONFIG_PATH);
  }
}
