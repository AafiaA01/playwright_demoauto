import type {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

export default class HtmlStepReporter implements Reporter {
  private reportsDir: string;

  constructor() {
    this.reportsDir = path.resolve(process.cwd(), 'html-reports');
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBegin(config: FullConfig, suite: Suite): void {
    // No-op for now
  }

  // Generate one HTML file per test case when it finishes
  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {
    const safeTitle = test.title.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${safeTitle}-${timestamp}.html`;
    const filePath = path.join(this.reportsDir, fileName);

    const stepScreenshots = result.attachments.filter(
      (att) => att.contentType === 'image/png' && att.path
    );

    const rows = stepScreenshots
      .map((att) => {
        const stepName = att.name || 'Step';
        const relPath = path
          .relative(this.reportsDir, att.path as string)
          .split(path.sep)
          .join('/');

        return `
        <div class="step">
          <h3>${stepName}</h3>
          <img src="${relPath}" alt="${stepName}" />
        </div>`;
      })
      .join('\n');

    const statusClass = result.status === 'passed' ? 'passed' : 'failed';
    const project = test.parent.project ? test.parent.project() : undefined;
    const projectName = project?.name ?? 'default';

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${test.title} - Detailed Report</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          sans-serif;
        margin: 0;
        padding: 20px;
        background: #0b1020;
        color: #f4f4f9;
      }
      h1 {
        font-size: 20px;
        margin-bottom: 4px;
      }
      .meta {
        font-size: 13px;
        color: #a0aec0;
        margin-bottom: 16px;
      }
      .${statusClass} {
        color: ${result.status === 'passed' ? '#48bb78' : '#f56565'};
      }
      .steps {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 16px;
      }
      .step {
        background: #141a33;
        border-radius: 8px;
        padding: 10px;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.03);
      }
      .step h3 {
        font-size: 14px;
        margin: 0 0 8px;
        color: #e2e8f0;
      }
      .step img {
        width: 100%;
        border-radius: 6px;
        border: 1px solid #2d3748;
      }
    </style>
  </head>
  <body>
    <h1>${test.title}</h1>
    <div class="meta">
      <span>Status: <span class="${statusClass}">${result.status}</span></span>
      <br />
      <span>Project: ${projectName}</span>
    </div>
    <div class="steps">
      ${rows || '<p>No screenshots were captured for this test.</p>'}
    </div>
  </body>
</html>`;

    await fs.promises.writeFile(filePath, html, 'utf-8');
  }
}

