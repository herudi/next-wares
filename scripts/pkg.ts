const { writeFileSync } = require('node:fs');

writeFileSync('dist/esm/package.json', JSON.stringify({ type: 'module' }), {
  encoding: 'utf-8',
});
writeFileSync('dist/cjs/package.json', JSON.stringify({ type: 'commonjs' }), {
  encoding: 'utf-8',
});
