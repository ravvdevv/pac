import pc from 'picocolors';

export function printBanner() {
  console.log(`\n${pc.cyan(pc.bold('PAC'))} ${pc.dim('—')} ${pc.white('Refining ideas into professional prompts.')}\n`);
}

export function printWarning() {
  console.log(`${pc.bgYellow(pc.black(pc.bold(' REVIEW REQUIRED ')))} ${pc.yellow('Please read the prompt before using.')}\n`);
}

export async function streamOutput(stream) {
  let fullContent = '';
  process.stdout.write(pc.white('')); // Start white color
  
  for await (const chunk of stream) {
    fullContent += chunk;
    process.stdout.write(chunk);
  }
  
  process.stdout.write('\n');
  console.log(pc.dim('\n' + '─'.repeat(process.stdout.columns || 60) + '\n'));
  
  return fullContent;
}


export function formatOutput(content) {
  console.log(pc.white(content));
  console.log(pc.dim('\n' + '─'.repeat(process.stdout.columns || 60) + '\n'));
}

export function printError(err) {
  console.error(`\n${pc.bgRed(pc.black(pc.bold(' ERROR ')))} ${pc.red(err.message || err)}\n`);
}

