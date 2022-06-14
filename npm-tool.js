const { createConfig, Proc } = require('@banez/npm-tool');
const path = require('path');
const fse = require('fs-extra');
const util = require('util');
const yamljs = require('yamljs');

module.exports = createConfig({
  bundle: {
    override: [
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
          await Proc.spawn('npm', ['run', 'build:ts']);
          await fse.remove(path.join(process.cwd(), 'dist', 'test'));
          await fse.copy(
            path.join(process.cwd(), 'dist', 'src'),
            path.join(process.cwd(), 'dist'),
          );
          await fse.remove(path.join(process.cwd(), 'dist', 'src'));
          await fse.remove(path.join(process.cwd(), 'dist', 'dev'));
        },
      },
      {
        title: 'Copy package.json',
        task: async () => {
          const data = JSON.parse(
            (
              await util.promisify(fse.readFile)(
                path.join(__dirname, 'package.json'),
              )
            ).toString(),
          );
          data.devDependencies = undefined;
          data.nodemonConfig = undefined;
          data.scripts = undefined;
          await util.promisify(fse.writeFile)(
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
    ],
  },
  custom: {
    '--test-coverage': async () => {
      const info = yamljs.load(
        path.join(process.cwd(), 'test', 'info.yml'),
      ).tests;
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
      const stats = [
        ['', 'Completed', 'Coverage'],
        [
          'Unit',
          `${tests.unit.completed}/${tests.unit.available}`,
          `${((tests.unit.completed / tests.unit.available) * 100).toFixed(
            2,
          )}%`,
        ],
        [
          'Integration',
          `${tests.integration.completed}/${tests.integration.available}`,
          `${(
            (tests.integration.completed / tests.integration.available) *
            100
          ).toFixed(2)}%`,
        ],
        [
          'Overall',
          `${tests.completed}/${tests.available}`,
          `${((tests.completed / tests.available) * 100).toFixed(2)}%`,
        ],
      ];
      const colWidths = stats[0].map(() => 0);
      for (let i = 0; i < stats.length; i++) {
        const row = stats[i];
        for (let j = 0; j < row.length; j++) {
          const col = row[j];
          if (col.length > colWidths[j]) {
            colWidths[j] = col.length;
          }
        }
      }
      console.log(
        '┌' +
          '─'.repeat(
            colWidths.reduce((p, c) => {
              return p + c + 2;
            }, 0),
          ) +
          '──┐',
      );
      for (let i = 0; i < stats.length; i++) {
        const row = stats[i];
        let output = [];
        for (let j = 0; j < row.length; j++) {
          const col = row[j];
          if (col.length < colWidths[j]) {
            const delta = colWidths[j] - col.length + 1;
            output.push(' ' + col + ' '.repeat(delta));
          } else {
            output.push(` ${col} `);
          }
        }
        console.log(`│${output.join('│')}│`);
        if (i === 0) {
          console.log(
            '├' +
              '─'.repeat(
                colWidths.reduce((p, c) => {
                  return p + c + 2;
                }, 0),
              ) +
              '──┤',
          );
        }
      }
      console.log(
        '└' +
          '─'.repeat(
            colWidths.reduce((p, c) => {
              return p + c + 2;
            }, 0),
          ) +
          '──┘',
      );
    },
  },
});
