const inquirer = require('inquirer');
const path = require('path');
const { readFile, readdir, writeFile } = require('fs').promises;

const configFiles = {};
const configDir = path.resolve(__dirname, 'config');

(async () => {
  const file = await readdir(configDir).catch(console.log);

  for (let i of file) {
    const optionName = i.split('.')[0];
    configFiles[optionName] = path.join(configDir, i);
  }

  const { technology } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Pick a configuration',
      name: 'technology',
      choices: Object.keys(configFiles),
    },
  ]);

  let config = await readFile(configFiles[technology]).catch(console.log);
  const prettyconfig = path.join(process.cwd(), '.prettierrc');

  await writeFile(prettyconfig, config.toString()).catch((err) => {
    console.log(err);
    process.exit();
  });
  console.log('Prettier configuration file created!');
})();
