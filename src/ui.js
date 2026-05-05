import pc from 'picocolors';

export function printBanner() {
  console.log(`\n${pc.cyan(pc.bold('PAC'))} ${pc.dim('—')} ${pc.white('Refining ideas into professional prompts.')}\n`);
}

export function printWarning() {
  console.log(`${pc.bgYellow(pc.black(pc.bold(' REVIEW REQUIRED ')))} ${pc.yellow('Please read the prompt before using.')}\n`);
}

export function formatOutput(content) {
  console.log(pc.white(content));
  console.log(pc.dim('\n' + '─'.repeat(process.stdout.columns || 60) + '\n'));
}

export function printError(err) {
  console.error(`\n${pc.bgRed(pc.black(pc.bold(' ERROR ')))} ${pc.red(err.message || err)}\n`);
}
