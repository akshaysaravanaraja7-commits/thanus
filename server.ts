import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? 3000);
const PYTHON_HOST = '127.0.0.1';
const PYTHON_PORT = Number(process.env.PYTHON_API_PORT ?? 8765);

let pythonProcess: ChildProcess | null = null;

function startPythonBackend(): ChildProcess {
  const scriptPath = path.resolve(__dirname, 'python', 'portfolio_server.py');
  const child = spawn('python3', [scriptPath], {
    env: {
      ...process.env,
      PYTHON_API_HOST: PYTHON_HOST,
      PYTHON_API_PORT: String(PYTHON_PORT),
      PYTHON_SERVE_STATIC: '0',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout?.on('data', (chunk: Buffer) => {
    process.stdout.write(chunk.toString());
  });
  child.stderr?.on('data', (chunk: Buffer) => {
    process.stderr.write(chunk.toString());
  });
  child.on('exit', (code, signal) => {
    console.log(`[server] Python backend exited (code=${code}, signal=${signal})`);
    pythonProcess = null;
  });

  return child;
}

function waitForPython(timeoutMs = 5000): Promise<void> {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(
        { hostname: PYTHON_HOST, port: PYTHON_PORT, path: '/api/health', timeout: 500 },
        (res) => {
          res.resume();
          if (res.statusCode === 200) {
            resolve();
          } else {
            retry();
          }
        },
      );
      req.on('error', retry);
      req.on('timeout', () => {
        req.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - started >= timeoutMs) {
        reject(new Error('Python backend failed to start within timeout'));
        return;
      }
      setTimeout(attempt, 120);
    };

    attempt();
  });
}

function proxyToPython(req: express.Request, res: express.Response): void {
  const targetReq = http.request(
    {
      hostname: PYTHON_HOST,
      port: PYTHON_PORT,
      path: req.originalUrl,
      method: req.method,
      headers: {
        ...req.headers,
        host: `${PYTHON_HOST}:${PYTHON_PORT}`,
      },
    },
    (targetRes) => {
      res.status(targetRes.statusCode ?? 502);
      for (const [key, value] of Object.entries(targetRes.headers)) {
        if (value !== undefined) {
          res.setHeader(key, value);
        }
      }
      targetRes.pipe(res);
    },
  );

  targetReq.on('error', (err) => {
    console.error('[server] Python proxy error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Python portfolio service temporarily unavailable.' });
    }
  });

  req.pipe(targetReq);
}

async function createServer() {
  pythonProcess = startPythonBackend();
  await waitForPython();

  const app = express();

  // Route all /api/* traffic directly to the Python 3.11 backend
  app.use('/api', proxyToPython);

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] Portfolio web server ready at http://0.0.0.0:${PORT}`);
  });

  const shutdown = () => {
    server.close();
    if (pythonProcess && !pythonProcess.killed) {
      pythonProcess.kill('SIGTERM');
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

createServer().catch((err) => {
  console.error('[server] Fatal startup error:', err);
  if (pythonProcess && !pythonProcess.killed) {
    pythonProcess.kill('SIGTERM');
  }
  process.exit(1);
});
