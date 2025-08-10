const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true, 
  platform: 'node',
  outfile: './deployment.build/index.js',
  sourcemap: true,
}).catch(() => process.exit(1));
