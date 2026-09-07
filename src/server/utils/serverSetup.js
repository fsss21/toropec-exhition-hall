const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

class ServerSetup {
  constructor(options = {}) {
    this.port = options.port || 3001;
    this.appName = options.appName || 'Toropec App';
    this.isPkg = typeof process.pkg !== 'undefined';
    this.useSnapshotReader = false;
    this.buildDir = this.resolveBuildDir();
  }

  getAppUrl() {
    return `http://localhost:${this.port}`;
  }

  hasIndexHtml(dir) {
    try {
      return fs.existsSync(path.join(dir, 'index.html'));
    } catch {
      return false;
    }
  }

  resolveBuildDir() {
    const snapshotBuild = path.join(__dirname, '..', '..', '..', 'build');
    const exeDir = this.isPkg ? path.dirname(process.execPath) : null;
    const candidates = [];

    if (exeDir) {
      candidates.push({ dir: exeDir, snapshot: false });
      candidates.push({ dir: path.join(exeDir, 'build'), snapshot: false });
    }

    candidates.push({ dir: process.cwd(), snapshot: false });
    candidates.push({ dir: path.join(process.cwd(), 'build'), snapshot: false });
    candidates.push({ dir: snapshotBuild, snapshot: true });

    const seen = new Set();

    for (const candidate of candidates) {
      const key = path.normalize(candidate.dir);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      if (!this.hasIndexHtml(candidate.dir)) {
        continue;
      }

      this.useSnapshotReader = Boolean(this.isPkg && candidate.snapshot);
      return candidate.dir;
    }

    return exeDir || snapshotBuild;
  }

  isPathInside(rootDir, targetPath) {
    const relative = path.relative(rootDir, targetPath);
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
  }

  resolveStaticPath(urlPath) {
    const relative = decodeURIComponent(urlPath.split('?')[0])
      .replace(/^\/+/, '')
      .replace(/\\/g, '/');

    if (relative.split('/').some((part) => part === '..')) {
      return null;
    }

    const target = relative
      ? path.resolve(this.buildDir, relative)
      : path.resolve(this.buildDir, 'index.html');

    if (!this.isPathInside(path.resolve(this.buildDir), target)) {
      return null;
    }

    return target;
  }

  sendFileBuffer(res, filePath) {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    if (ext) {
      res.type(ext);
    }
    res.send(data);
  }

  setupSnapshotStatic(app) {
    const indexPath = path.join(this.buildDir, 'index.html');

    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        next();
        return;
      }

      const target = this.resolveStaticPath(req.path);
      if (!target) {
        res.status(403).end();
        return;
      }

      try {
        const stat = fs.statSync(target);
        const filePath = stat.isDirectory() ? path.join(target, 'index.html') : target;
        this.sendFileBuffer(res, filePath);
        return;
      } catch {
        const hasExtension = Boolean(path.extname(target));
        if (hasExtension) {
          res.status(404).end();
          return;
        }

        try {
          this.sendFileBuffer(res, indexPath);
        } catch (error) {
          next(error);
        }
      }
    });
  }

  async checkIndexHtml() {
    const exists = this.hasIndexHtml(this.buildDir);

    if (!exists) {
      console.warn(`index.html not found in ${this.buildDir}`);
      console.warn('Run "npm run build:win" before packaging, or keep launch.exe next to index.html from the release folder.');
    }

    return exists;
  }

  async openBrowser() {
    const url = this.getAppUrl();

    if (os.platform() === 'win32') {
      exec(`start "" "${url}"`);
      return;
    }

    if (os.platform() === 'darwin') {
      exec(`open "${url}"`);
      return;
    }

    exec(`xdg-open "${url}"`);
  }

  setupStaticFiles(app, expressLib) {
    if (this.useSnapshotReader) {
      this.setupSnapshotStatic(app);
      return;
    }

    app.use(expressLib.static(this.buildDir));
    app.use((req, res) => {
      res.sendFile(path.join(this.buildDir, 'index.html'));
    });
  }

  async startServer(app) {
    const hasIndex = await this.checkIndexHtml();

    await new Promise((resolve, reject) => {
      const server = app.listen(this.port);
      server.on('error', reject);
      server.on('listening', async () => {
        console.log(`${this.appName} launcher is running at ${this.getAppUrl()}`);
        console.log(`Serving static files from ${this.buildDir}`);

        if (hasIndex) {
          await this.openBrowser();
        }

        resolve();
      });
    });
  }
}

module.exports = ServerSetup;
