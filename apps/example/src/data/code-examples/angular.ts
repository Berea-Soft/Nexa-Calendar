import {
  MOCK_STYLES,
  buildFrameworkExamples,
  getEventArrayExpression,
  type DemoExampleKey,
  type DemoScenario,
} from './shared';
import type { ExampleConfig, FrameworkExamples } from './types';

function buildAngularMain(exampleKey: DemoExampleKey, scenario: DemoScenario): string {
  const timezoneValue = scenario.timezone ? `'${scenario.timezone}'` : 'null';

  return `import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="nx-calendar">
      <h2>{{ title }}</h2>
      <div class="info">{{ info }}</div>
      <div class="header">
        <span style="font-size:13px;color:#64748b">{{ monthLabel }}</span>
        <button *ngIf="selectable" (click)="addEvent()">+ Add Event</button>
      </div>
      <div class="event-list">
        <ul>
          <li *ngFor="let ev of events">
            {{ ev.title }} - {{ formatDate(ev.start) }}
            <button
              *ngIf="selectable"
              (click)="remove(ev.id)"
              style="margin-left:8px;background:transparent;border:none;color:#ef4444;cursor:pointer"
            >
              x
            </button>
          </li>
        </ul>
      </div>
    </div>
  \`,
})
class AppComponent {
  view = '${scenario.view}';
  theme = '${scenario.theme}';
  timezone = ${timezoneValue};
  selectable = ${Boolean(scenario.selectable)};
  info = '${scenario.info}';

  title =
    'Nexa Calendar - ' +
    this.view +
    ' | theme:' +
    this.theme +
    (this.timezone ? ' | ' + this.timezone : '');

  today = new Date();
  monthLabel = this.today.toLocaleString('default', { month: 'long', year: 'numeric' });

  events: Array<{ id: string; title: string; start: string; duration?: number; [key: string]: unknown }> = ${getEventArrayExpression(exampleKey)};
  nextId = this.events.length + 1;

  addEvent() {
    const date = new Date().toISOString();
    this.events = [
      ...this.events,
      {
        id: String(this.nextId++),
        title: 'Event #' + (this.nextId - 1),
        start: date,
        duration: 60,
      },
    ];
  }

  remove(id: string) {
    this.events = this.events.filter(event => event.id !== id);
  }

  formatDate(value: string) {
    return value.replace('T', ' ').slice(0, 16);
  }
}

bootstrapApplication(AppComponent);`;
}

function angularBase(mainTs: string): ExampleConfig {
  return {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Nexa Calendar - Angular</title>
  <style>${MOCK_STYLES}</style>
</head>
<body>
  <app-root></app-root>
  <script type="module" src="./main.ts"><\/script>
</body>
</html>`,
    'main.ts': mainTs,
    'package.json': JSON.stringify(
      {
        name: 'nexa-calendar-angular',
        private: true,
        dependencies: {
          '@angular/core': '^17.0.0',
          '@angular/common': '^17.0.0',
          '@angular/platform-browser': '^17.0.0',
          '@angular/compiler': '^17.0.0',
          '@angular/platform-browser-dynamic': '^17.0.0',
          'zone.js': '^0.14.0',
          rxjs: '^7.8.0',
          typescript: '~5.2.0',
        },
        scripts: { start: 'ng serve' },
      },
      null,
      2
    ),
  };
}

export const angularExamples: FrameworkExamples = buildFrameworkExamples((exampleKey, scenario) =>
  angularBase(buildAngularMain(exampleKey, scenario))
);
