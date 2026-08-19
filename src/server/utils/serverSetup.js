const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

class ServerSetup {
  constructor(options = {}) {
    this.port = options.port || 3001;
    this.appName = options.appName || 'Toropec App';
    this.isPkg = typeof process.pkg !== 'undefined';
    this.baseDir = this.isPkg ? path.dirname(process.execPath) : path.join(__dirname, '..', '..', '..');
    this.buildDir = this.isPkg ? this.baseDir : path.join(this.baseDir, 'build');
  }

  getAppUrl() {
    return `http://localhost:${this.port}`;
  }

  async checkIndexHtml() {
    const indexPath = path.join(this.buildDir, 'index.html');
    const exists = await fs.pathExists(indexPath);

    if (!exists) {
      console.warn(`index.html not found in ${this.buildDir}`);
      console.warn('Run "npm run build" before packaging or copy the Vite build next to launch.exe.');
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
    app.use(expressLib.static(this.buildDir));
    app.use((req, res) => {
      res.sendFile(path.join(this.buildDir, 'index.html'));
    });
  }

  async startServer(app) {
    const hasIndex = await this.checkIndexHtml();

    await new Promise((resolve, reject) => {
      app.listen(this.port, async () => {
        console.log(`${this.appName} launcher is running at ${this.getAppUrl()}`);
        console.log(`Serving static files from ${this.buildDir}`);

        if (hasIndex) {
          await this.openBrowser();
        }

        resolve();
      }).on('error', reject);
    });
  }
}

module.exports = ServerSetup;
