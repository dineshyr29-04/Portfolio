import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

// Reuse the real app so search engines and no-JavaScript readers get its content.
const server = await createServer({
  configFile: false,
  plugins: [react()],
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const html = await readFile('dist/index.html', 'utf8');
  const placeholder = '<div id="root"></div>';
  if (!html.includes(placeholder))
    throw new Error('Missing app root in built HTML');
  await writeFile(
    'dist/index.html',
    html.replace(
      placeholder,
      `<div id="root">${renderToString(createElement(App))}</div>`
    )
  );
  console.log('Prerendered portfolio content into dist/index.html');
} finally {
  await server.close();
}
