const childProcess = require('child_process');
const path = require('path');
const fse = require('fs-extra');
const fs = require('fs');
const util = require('util');
const yamljs = require('yamljs');

/**
 * @typedef {{
 *  title: string
 *  task: (function(): Promise<void>)
 * }} Task
 */

/**
 * @param {string} cmd
 * @param {string[]} args
 * @param {import('child_process').SpawnOptions?} options
 */
async function spawn(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const proc = childProcess.spawn(
      cmd,
      args,
      options
        ? options
        : {
            stdio: 'inherit',
          },
    );
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve();
      }
    });
  });
}
/**
 * @param {Task[]} tasks
 */
function Tasks(tasks) {
  return {
    run: async () => {
      for (let i = 0; i < tasks.length; i = i + 1) {
        const t = tasks[i];
        console.log(`${i + 1}. ${t.title}`);
        try {
          await t.task();
          console.log(`✓`);
        } catch (error) {
          console.log(`⨉`);
          throw error;
        }
      }
    },
  };
}
function parseArgs(rawArgs) {
  const args = {};
  let i = 2;
  while (i < rawArgs.length) {
    const arg = rawArgs[i];
    let value = '';
    if (rawArgs[i + 1]) {
      value = rawArgs[i + 1].startsWith('--') ? '' : rawArgs[i + 1];
    }
    args[arg] = value;
    if (value === '') {
      i = i + 1;
    } else {
      i = i + 2;
    }
  }
  return {
    bundle: args['--bundle'] === '' || args['--bundle'] === 'true' || false,
    link: args['--link'] === '' || args['--link'] === 'true' || false,
    unlink: args['--unlink'] === '' || args['--unlink'] === 'true' || false,
    publish: args['--publish'] === '' || args['--publish'] === 'true' || false,
    build: args['--build'] === '' || args['--build'] === 'true' || false,
    sudo: args['--sudo'] === '' || args['--sudo'] === 'true' || false,
    pack: args['--pack'] === '' || args['--pack'] === 'true' || false,
    testCoverage:
      args['--test-coverage'] === '' ||
      args['--test-coverage'] === 'true' ||
      false,
  };
}

async function bundle() {
  const tasks = Tasks([
    {
      title: 'Remove old bundle.',
      task: async () => {
        await fse.remove(path.join(__dirname, 'dist'));
        await fse.remove(path.join(__dirname, 'doc'));
        await fse.remove(path.join(__dirname, 'tmp'));
      },
    },
    {
      title: 'Compile Typescript.',
      task: async () => {
        await spawn('npm', ['run', 'build:ts']);
        await fse.remove(path.join(process.cwd(), 'dist', 'test'));
        await fse.copy(
          path.join(process.cwd(), 'dist', 'src'),
          path.join(process.cwd(), 'dist'),
        );
        await fse.remove(path.join(process.cwd(), 'dist', 'dev'));
      },
    },
    // {
    //   title: 'Compile Typedoc.',
    //   task: async () => {
    //     await spawn('npm', ['run', 'typedoc-generate']);
    //   },
    // },
    {
      title: 'Copy package.json',
      task: async () => {
        const data = JSON.parse(
          (
            await util.promisify(fs.readFile)(
              path.join(__dirname, 'package.json'),
            )
          ).toString(),
        );
        data.devDependencies = undefined;
        data.nodemonConfig = undefined;
        data.scripts = undefined;
        await util.promisify(fs.writeFile)(
          path.join(__dirname, 'dist', 'package.json'),
          JSON.stringify(data, null, '  '),
        );
      },
    },
    {
      title: 'Copy LICENSE',
      task: async () => {
        await fse.copy(
          path.join(__dirname, 'LICENSE'),
          path.join(__dirname, 'dist', 'LICENSE'),
        );
      },
    },
    {
      title: 'Copy README.md',
      task: async () => {
        await fse.copy(
          path.join(__dirname, 'README.md'),
          path.join(__dirname, 'dist', 'README.md'),
        );
      },
    },
  ]);
  await tasks.run();
}
async function pack() {
  await spawn('npm', ['pack'], {
    cwd: path.join(process.cwd(), 'dist'),
    stdio: 'inherit',
  });
}
/**
 * @param {boolean} sudo
 * @returns {Promise<void>}
 */
async function link(sudo) {
  await spawn('npm', ['i'], {
    cwd: path.join(process.cwd(), 'dist'),
    stdio: 'inherit',
  });
  if (sudo) {
    await spawn('sudo', ['npm', 'link'], {
      cwd: path.join(process.cwd(), 'dist'),
      stdio: 'inherit',
    });
  } else {
    await spawn('npm', ['link'], {
      cwd: path.join(process.cwd(), 'dist'),
      stdio: 'inherit',
    });
  }
}
/**
 * @param {boolean} sudo
 * @returns {Promise<void>}
 */
async function unlink(sudo) {
  if (sudo) {
    await spawn('sudo', ['npm', 'link'], {
      cwd: path.join(process.cwd(), 'dist'),
      stdio: 'inherit',
    });
  } else {
    await spawn('npm', ['unlink'], {
      cwd: path.join(process.cwd(), 'dist'),
      stdio: 'inherit',
    });
  }
}
async function publish() {
  if (
    await util.promisify(fs.exists)(
      path.join(__dirname, 'dist', 'node_modules'),
    )
  ) {
    throw new Error(
      `Please remove "${path.join(__dirname, 'dist', 'node_modules')}"`,
    );
  }
  await spawn('npm', ['publish', '--access=private'], {
    cwd: path.join(process.cwd(), 'dist'),
    stdio: 'inherit',
  });
}
async function testCoverage() {
  const info = yamljs.load(path.join(process.cwd(), 'test', 'info.yml')).tests;
  console.log(info);
  const tests = {
    available: 0,
    completed: 0,
    unit: {
      available: 0,
      completed: 0,
    },
    integration: {
      available: 0,
      completed: 0,
    },
  };
  for (const key in info.unit) {
    const data = info.unit[key];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      tests.unit.available++;
      tests.available++;
      if (item.completed) {
        tests.unit.completed++;
        tests.completed++;
      }
    }
  }
  for (const key in info.integration) {
    const data = info.integration[key];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      tests.integration.available++;
      tests.available++;
      if (item.completed) {
        tests.integration.completed++;
        tests.completed++;
      }
    }
  }
  console.log(
    `Unit: ${tests.unit.completed}/${tests.unit.available} - coverage: ${(
      (tests.unit.completed / tests.unit.available) *
      100
    ).toFixed(2)}%`,
  );
  console.log(
    `Integration: ${tests.integration.completed}/${
      tests.integration.available
    } - coverage: ${(
      (tests.integration.completed / tests.integration.available) *
      100
    ).toFixed(2)}%`,
  );
  console.log(
    `Overall: ${tests.completed}/${tests.available} - coverage: ${(
      (tests.completed / tests.available) *
      100
    ).toFixed(2)}%`,
  );
}

async function main() {
  const options = parseArgs(process.argv);
  if (options.bundle === true) {
    await bundle();
  } else if (options.link === true) {
    await link(options.sudo);
  } else if (options.unlink === true) {
    await unlink(options.sudo);
  } else if (options.publish === true) {
    await publish();
  } else if (options.build === true) {
    // await build();
  } else if (options.pack === true) {
    await pack();
  } else if (options.testCoverage) {
    await testCoverage();
  }
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
