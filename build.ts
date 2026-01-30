import { execSync } from 'child_process';
import { readFileSync, writeFileSync, rmSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function build() {
  const distDir = join(import.meta.dir, 'dist');
  
  // 1. Clean and ensure dist exists
  console.log('Cleaning dist directory...');
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
  }
  mkdirSync(distDir);

  console.log('Generating CSS...');
  try {
    execSync('bun x tailwindcss -i ./src/index.css -o ./dist/output.css --minify', { stdio: 'inherit' });
  } catch (e) {
    console.error('Tailwind build failed', e);
    process.exit(1);
  }

  const css = readFileSync('./dist/output.css', 'utf-8');

  console.log('Building JS...');
  const result = await Bun.build({
    entrypoints: ['./src/main.tsx'],
    outdir: './dist',
    minify: true,
    naming: 'widget.js',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  if (!result.success) {
    console.error('Build failed', result.logs);
    process.exit(1);
  }

  const jsPath = join(distDir, 'widget.js');
  const js = readFileSync(jsPath, 'utf-8');
  
  // 2. Inject CSS loader at the top
  const injectedJs = `
(function() {
  if (typeof document !== 'undefined') {
    const css = ${JSON.stringify(css)};
    const style = document.createElement('style');
    style.id = 'efm-widget-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
})();
${js}
`;

  writeFileSync(jsPath, injectedJs);

  // 3. Cleanup: Remove everything except widget.js
  console.log('Cleaning up intermediate files...');
  const files = readdirSync(distDir);
  for (const file of files) {
    if (file !== 'widget.js') {
      rmSync(join(distDir, file), { force: true });
    }
  }

  console.log('Build complete: ./dist/widget.js (Single File)');
}

build();
