async function repl() {
  process.stdin.setEncoding('utf-8');
  function help() {
    console.error(`REPL:\n\tdebug [on|off]`);
  }
  help();
  for await (const line of process.stdin) {
    if (line === 'debug on') {
      console.error(`debugging enabled`);
    } else if (line === 'debug off') {
      console.error(`debugging disabled`);
    }
    else {
      help();
    }
  }
}

// start a new async task to avoid blocking the thread
repl();
