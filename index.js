#!/usr/bin/env node

import { Command } from 'commander';
import { input, select } from '@inquirer/prompts';
import pc from 'picocolors';

import { getConfig, updateConfig, viewConfig, clearConfig } from './src/config.js';
import { callAI, callFollowUp } from './src/ai.js';
import { TARGETS } from './src/prompts.js';
import { printBanner, printWarning, formatOutput, printError, streamOutput } from './src/ui.js';

const PACKAGE_VERSION = '1.3.0';
const program = new Command();

program
  .name('pac')
  .description('Prompt Auto Create - Crafting refined prompts for AI')
  .version(PACKAGE_VERSION)
  .argument('[idea]', 'Describe what you want the AI to do')
  .option('--key <key>', 'Set API key directly')
  .option('--model <model>', 'Set AI model directly')
  .option('--reset', 'Reset configuration and onboarding')
  .option('--for <target>', 'Prompt target: general, code, creative, or agent')
  .action(async (idea, options) => {
    try {
      if (options.reset) {
        await clearConfig();
        console.log(pc.yellow('Configuration reset. Running onboarding...\n'));
      }

      if (options.key || options.model) {
        const updates = {};
        if (options.key) updates.apiKey = options.key;
        if (options.model) updates.model = options.model;
        await updateConfig(updates);
        console.log(pc.green('Configuration updated.'));
        if (!idea) return;
      }

      await main(idea, options.for);
    } catch (err) {
      if (err.name === 'ExitPromptError') {
        console.log(pc.dim('\nProcess terminated by user.'));
      } else {
        console.error(pc.red('\nUnexpected error:'), err);
      }
      process.exit(0);
    }
  });

program
  .command('config')
  .description('View current configuration')
  .action(async () => {
    await viewConfig();
  });

async function checkUpdate(currentVersion) {
  try {
    const res = await fetch('https://registry.npmjs.org/pac-ai/latest');
    const { version } = await res.json();
    if (version !== currentVersion) {
      console.log(pc.dim(`  Update ${currentVersion} → ${version}: npm i -g pac-ai\n`));
    }
  } catch {} // skip on network errors
}

async function main(idea, targetFromFlag) {
  const config = await getConfig();
  printBanner();
  await checkUpdate(PACKAGE_VERSION);

  let currentInput = idea;
  let currentPrompt = null;
  let currentTarget = targetFromFlag ? targetFromFlag.toLowerCase() : null;

  if (!currentInput) {
    currentInput = await input({
      message: 'Paste your prompt:',
      validate: (val) => val.trim().length > 0 || 'Input cannot be empty'
    });
  }

  if (!currentTarget) {
    currentTarget = await select({
      message: 'What is this prompt for?',
      choices: TARGETS,
      default: 'general'
    });
  }

  while (true) {
    if (!currentPrompt) {
      const { default: ora } = await import('ora');
      const spinner = ora({
        text: 'Generating structured prompt...',
        spinner: 'star'
      }).start();

      try {
        const stream = await callAI(config, currentInput, currentTarget);
        spinner.stop();
        currentPrompt = await streamOutput(stream);
        printWarning();
      } catch (err) {
        spinner.stop();
        printError(err);
        const retry = await select({
          message: 'Retry?',
          choices: [
            { name: 'Yes', value: true },
            { name: 'No', value: false }
          ]
        });
        if (!retry) process.exit(1);
        continue;
      }
    }

    const action = await select({
      message: 'What would you like to do?',
      choices: [
        { name: pc.cyan('[c] Copy to clipboard'), value: 'copy' },
        { name: pc.blue('[f] Follow up / Extend'), value: 'followup' },
        { name: pc.yellow('[r] Regenerate'), value: 'regenerate' },
        { name: pc.magenta('[e] Edit input'), value: 'edit' },
        { name: pc.red('[q] Quit'), value: 'quit' }
      ]
    });

    if (action === 'copy') {
      try {
        const { default: clipboardy } = await import('clipboardy');
        await clipboardy.write(currentPrompt);
        console.log(pc.green('✔ Copied to clipboard!\n'));
      } catch (e) {
        console.log(pc.red('Failed to copy to clipboard. Please copy manually.'));
      }
    } else if (action === 'followup') {
      const instructions = await input({
        message: 'What would you like to add or extend?',
        validate: (val) => val.trim().length > 0 || 'Instructions cannot be empty'
      });

      const { default: ora } = await import('ora');
      while (true) {
        const spinner2 = ora({
          text: 'Refining prompt...',
          spinner: 'star'
        }).start();

        try {
          const stream = await callFollowUp(config, currentPrompt, instructions);
          spinner2.stop();
          currentPrompt = await streamOutput(stream);
          break;
        } catch (err) {
          spinner2.stop();
          printError(err);
          const retry = await select({
            message: 'Retry?',
            choices: [
              { name: 'Yes', value: true },
              { name: 'No', value: false }
            ]
          });
          if (!retry) break;
        }
      }
    } else if (action === 'regenerate') {
      currentPrompt = null;
    } else if (action === 'edit') {
      currentInput = await input({
        message: 'Edit your prompt:',
        default: currentInput
      });
      currentPrompt = null;
    } else if (action === 'quit') {
      console.log(pc.dim('Happy prompting! Bye.\n'));
      process.exit(0);
    }
  }
}

program.parse();

