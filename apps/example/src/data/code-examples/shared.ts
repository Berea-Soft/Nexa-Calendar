import { EXAMPLES, type ExampleKey } from '../../data';
import type { ExampleConfig, ExampleMeta, FrameworkExamples } from './types';

export type DemoExampleKey = ExampleKey;

export interface DemoScenario {
  view: string;
  theme: string;
  info: string;
  selectable?: boolean;
  draggable?: boolean;
  timezone?: string;
}

const scenarioByExample: Record<DemoExampleKey, DemoScenario> = {
  full: {
    view: 'month',
    theme: 'ocean',
    info: 'All core features enabled with a complete event set.',
    selectable: true,
    draggable: true,
  },
  business: {
    view: 'workWeek',
    theme: 'slate',
    info: 'Business-hours focused schedule with weekdays only.',
  },
  minimal: {
    view: 'month',
    theme: 'light',
    info: 'Minimal setup with readonly events.',
  },
  noweekends: {
    view: 'month',
    theme: 'forest',
    info: 'Weekend-free planning and focused workdays.',
  },
  eventlimit: {
    view: 'month',
    theme: 'rose',
    info: 'Dense day data useful for event-limit behavior.',
  },
  timeline: {
    view: 'timeline',
    theme: 'ocean',
    info: 'Timeline-oriented events across multiple days.',
  },
  'resource-timeline': {
    view: 'timelineWeek',
    theme: 'amber',
    info: 'Resource grouped timeline style sample.',
  },
  year: {
    view: 'year',
    theme: 'slate',
    info: 'Year overview with representative event samples.',
  },
  'drag-drop': {
    view: 'week',
    theme: 'ocean',
    info: 'Drag and resize oriented event data.',
    draggable: true,
  },
  'background-events': {
    view: 'week',
    theme: 'forest',
    info: 'Background events mixed with normal events.',
  },
  selectable: {
    view: 'month',
    theme: 'rose',
    info: 'Date selection enabled to add events on click.',
    selectable: true,
  },
  locales: {
    view: 'month',
    theme: 'ocean',
    info: 'Locale-ready setup using translatable event content.',
  },
  theming: {
    view: 'month',
    theme: 'amber',
    info: 'Theme-driven UI sample with colorful event data.',
  },
  timezones: {
    view: 'week',
    theme: 'slate',
    info: 'Timezone-aware sample events.',
    timezone: 'America/New_York',
  },
};

const baseEventsExpression = `(() => {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const plusTwo = new Date(Date.now() + (2 * 86400000)).toISOString().slice(0, 10);

  return [
    { id: '1', title: 'Sprint Planning', start: today + 'T09:00:00', duration: 60 },
    { id: '2', title: 'Design Review', start: tomorrow + 'T14:00:00', duration: 45 },
    { id: '3', title: 'Client Sync', start: plusTwo + 'T11:30:00', duration: 30 },
  ];
})()`;

const denseEventsExpression = `(() => {
  const today = new Date().toISOString().slice(0, 10);

  return [
    { id: '1', title: 'Standup', start: today + 'T08:30:00', duration: 20 },
    { id: '2', title: 'Planning', start: today + 'T09:00:00', duration: 45 },
    { id: '3', title: 'Review', start: today + 'T10:00:00', duration: 30 },
    { id: '4', title: '1:1', start: today + 'T11:00:00', duration: 30 },
    { id: '5', title: 'Workshop', start: today + 'T13:00:00', duration: 120 },
    { id: '6', title: 'Retro', start: today + 'T16:00:00', duration: 45 },
  ];
})()`;

const timelineEventsExpression = `(() => {
  const today = new Date().toISOString().slice(0, 10);
  const plusThree = new Date(Date.now() + (3 * 86400000)).toISOString().slice(0, 10);
  const plusFive = new Date(Date.now() + (5 * 86400000)).toISOString().slice(0, 10);

  return [
    { id: '1', title: 'Discovery', start: today + 'T09:00:00', duration: 240 },
    { id: '2', title: 'Implementation', start: plusThree + 'T09:00:00', duration: 480 },
    { id: '3', title: 'Validation', start: plusFive + 'T10:00:00', duration: 180 },
  ];
})()`;

const resourceTimelineEventsExpression = `(() => {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  return [
    { id: '101', title: 'Room A Setup', start: today + 'T08:00:00', duration: 120, resourceId: 'r1' },
    { id: '102', title: 'Room B Workshop', start: today + 'T11:00:00', duration: 90, resourceId: 'r2' },
    { id: '103', title: 'Room C Interview', start: tomorrow + 'T14:00:00', duration: 60, resourceId: 'r3' },
  ];
})()`;

const dragDropEventsExpression = `(() => {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  return [
    { id: '1', title: 'Move Me', start: today + 'T10:00:00', duration: 60, startEditable: true, durationEditable: true },
    { id: '2', title: 'Resize Me', start: tomorrow + 'T13:00:00', duration: 90, durationEditable: true },
  ];
})()`;

const backgroundEventsExpression = `(() => {
  const today = new Date().toISOString().slice(0, 10);

  return [
    { id: '1', title: 'Busy Block', start: today + 'T08:00:00', duration: 600, display: 'background' },
    { id: '2', title: 'Team Meeting', start: today + 'T11:00:00', duration: 60 },
    { id: '3', title: 'Client Call', start: today + 'T15:30:00', duration: 30 },
  ];
})()`;

const timezoneEventsExpression = `(() => {
  const toLocalIso = (iso, offsetMinutes) => {
    const shifted = new Date(new Date(iso).getTime() + (offsetMinutes * 60000));
    const year = shifted.getUTCFullYear();
    const month = String(shifted.getUTCMonth() + 1).padStart(2, '0');
    const day = String(shifted.getUTCDate()).padStart(2, '0');
    const hours = String(shifted.getUTCHours()).padStart(2, '0');
    const minutes = String(shifted.getUTCMinutes()).padStart(2, '0');
    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':00';
  };

  const utcEvents = [
    { id: 'tz-1', title: 'Global Standup', start: '2026-05-08T14:00:00.000Z', duration: 30 },
    { id: 'tz-2', title: 'Client Review', start: '2026-05-09T17:00:00.000Z', duration: 60 },
  ];

  return utcEvents.map((event) => ({
    ...event,
    start: toLocalIso(event.start, -300),
  }));
})()`;

const eventExpressionByExample: Record<DemoExampleKey, string> = {
  full: baseEventsExpression,
  business: baseEventsExpression,
  minimal: baseEventsExpression,
  noweekends: baseEventsExpression,
  eventlimit: denseEventsExpression,
  timeline: timelineEventsExpression,
  'resource-timeline': resourceTimelineEventsExpression,
  year: baseEventsExpression,
  'drag-drop': dragDropEventsExpression,
  'background-events': backgroundEventsExpression,
  selectable: baseEventsExpression,
  locales: baseEventsExpression,
  theming: baseEventsExpression,
  timezones: timezoneEventsExpression,
};

export function getScenario(exampleKey: DemoExampleKey): DemoScenario {
  return scenarioByExample[exampleKey];
}

export function getEventArrayExpression(exampleKey: DemoExampleKey): string {
  return eventExpressionByExample[exampleKey] ?? baseEventsExpression;
}

export const demoExampleMeta: ExampleMeta[] = EXAMPLES.map(example => ({
  key: example.key,
  title: example.title,
  description: example.desc,
  emoji: example.icon,
}));

export const demoExampleKeys: DemoExampleKey[] = EXAMPLES.map(example => example.key);

export function buildFrameworkExamples(
  builder: (exampleKey: DemoExampleKey, scenario: DemoScenario) => ExampleConfig
): FrameworkExamples {
  return demoExampleKeys.reduce<FrameworkExamples>((acc, exampleKey) => {
    acc[exampleKey] = builder(exampleKey, getScenario(exampleKey));
    return acc;
  }, {});
}

export const MOCK_STYLES = `.nx-calendar {
  font-family: system-ui, sans-serif;
  padding: 1.5rem;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 12px;
  min-height: 400px;
}
.nx-calendar h2 { font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #a5b4fc; }
.nx-calendar .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.nx-calendar .header button { background: #1e40af; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; }
.nx-calendar .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.nx-calendar .grid .day { background: #1e293b; padding: 8px; border-radius: 6px; min-height: 80px; font-size: 12px; }
.nx-calendar .grid .day.today { border: 1px solid #6366f1; }
.nx-calendar .grid .day .num { font-weight: 600; color: #94a3b8; margin-bottom: 4px; }
.nx-calendar .event { background: #4f46e5; color: #fff; border-radius: 4px; padding: 2px 6px; font-size: 11px; margin-top: 2px; cursor: pointer; }
.nx-calendar .event:hover { background: #4338ca; }
.nx-calendar .toolbar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1rem; }
.nx-calendar .toolbar button { padding: 6px 14px; border: none; border-radius: 6px; cursor: pointer; background: #1e293b; color: #94a3b8; font-size: 13px; }
.nx-calendar .toolbar button.active { background: #6366f1; color: #fff; }
.nx-calendar .info { background: #1e3a5f; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 1rem; color: #93c5fd; }
.nx-calendar .add-btn { background: #16a34a; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-size: 13px; }
.nx-calendar .add-btn:hover { background: #15803d; }
.nx-calendar .event-list { margin-top: 1rem; }
.nx-calendar .event-list li { list-style: none; background: #1e293b; border-radius: 6px; padding: 8px 12px; margin-bottom: 6px; font-size: 13px; }
select { background: #1e293b; color: #e2e8f0; border: 1px solid #475569; border-radius: 6px; padding: 6px 10px; font-size: 13px; cursor: pointer; }`;

export const mockVueCalendar = `import { defineComponent, h } from 'vue'

// Simulated calendar component for StackBlitz demos.
const NxCalendar = defineComponent({
  name: 'NxCalendar',
  props: {
    events: { type: Array, default: () => [] },
    view: { type: String, default: 'month' },
    theme: { type: String, default: 'ocean' },
    selectable: Boolean,
    draggable: Boolean,
    timezone: String,
  },
  emits: ['dateSelect', 'eventClick', 'eventDrop'],
  setup(props, { emit }) {
    const today = new Date()
    const days = Array.from({ length: 35 }, (_, i) =>
      new Date(today.getFullYear(), today.getMonth(), i - today.getDay() + 1)
    )

    const eventsForDay = (d) =>
      props.events.filter((e) => new Date(e.start).toDateString() === d.toDateString())

    return () => h('div', { class: 'nx-calendar' }, [
      h('h2', null, 'Nexa Calendar - ' + props.view + ' | theme:' + props.theme + (props.timezone ? ' | ' + props.timezone : '')),
      h('div', { class: 'header' }, [
        h('span', { style: 'font-size:13px;color:#64748b' }, today.toLocaleString('default', { month: 'long', year: 'numeric' })),
        props.selectable
          ? h('button', { onClick: () => emit('dateSelect', new Date()) }, '+ Add Event')
          : null,
      ]),
      h('div', { class: 'grid' },
        days.map((d) => h('div', {
          class: ['day', d.toDateString() === today.toDateString() ? 'today' : ''].join(' '),
          onClick: () => props.selectable && emit('dateSelect', d),
          style: props.selectable ? 'cursor:pointer' : '',
        }, [
          h('div', { class: 'num' }, d.getDate()),
          ...eventsForDay(d).map((ev) =>
            h('div', {
              class: 'event',
              onClick: (event) => {
                event.stopPropagation()
                emit('eventClick', ev)
              },
            }, ev.title)
          ),
        ]))
      ),
    ])
  },
})

export default NxCalendar`;

export const mockReactCalendar = `import './style.css'

// Simulated calendar component for StackBlitz demos.
export default function NxCalendar({
  events = [],
  view = 'month',
  theme = 'ocean',
  selectable,
  timezone,
  onDateSelect,
  onEventClick,
}: {
  events?: Array<{ id: string; title: string; start: string; duration?: number }>;
  view?: string;
  theme?: string;
  selectable?: boolean;
  timezone?: string;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: { id: string; title: string; start: string }) => void;
}) {
  const today = new Date()
  const days = Array.from({ length: 35 }, (_, i) =>
    new Date(today.getFullYear(), today.getMonth(), i - today.getDay() + 1)
  )

  const eventsForDay = (d: Date) =>
    events.filter((event) => new Date(event.start).toDateString() === d.toDateString())

  return (
    <div className="nx-calendar">
      <h2>
        {'Nexa Calendar - ' + view + ' | theme:' + theme + (timezone ? ' | ' + timezone : '')}
      </h2>
      <div className="header">
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        {selectable ? (
          <button onClick={() => onDateSelect?.(new Date())}>+ Add Event</button>
        ) : null}
      </div>
      <div className="grid">
        {days.map((d, index) => (
          <div
            key={index}
            className={'day ' + (d.toDateString() === today.toDateString() ? 'today' : '')}
            onClick={() => selectable && onDateSelect?.(d)}
            style={selectable ? { cursor: 'pointer' } : undefined}
          >
            <div className="num">{d.getDate()}</div>
            {eventsForDay(d).map(event => (
              <div
                key={event.id}
                className="event"
                onClick={(mouseEvent) => {
                  mouseEvent.stopPropagation()
                  onEventClick?.(event)
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}`;

export const mockSvelteCalendar = `<script>
  // Simulated calendar component for StackBlitz demos.
  export let events = []
  export let view = 'month'
  export let theme = 'ocean'
  export let selectable = false
  export let timezone = null

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  const today = new Date()
  const days = Array.from({ length: 35 }, (_, i) =>
    new Date(today.getFullYear(), today.getMonth(), i - today.getDay() + 1)
  )

  const eventsForDay = (d) =>
    events.filter((event) => new Date(event.start).toDateString() === d.toDateString())
<\/script>

<div class="nx-calendar">
  <h2>{'Nexa Calendar - ' + view + ' | theme:' + theme + (timezone ? ' | ' + timezone : '')}</h2>
  <div class="header">
    <span style="font-size:13px;color:#64748b">
      {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
    </span>
    {#if selectable}
      <button on:click={() => dispatch('dateSelect', new Date())}>+ Add Event</button>
    {/if}
  </div>

  <div class="grid">
    {#each days as d}
      <div
        class={'day ' + (d.toDateString() === today.toDateString() ? 'today' : '')}
        on:click={() => selectable && dispatch('dateSelect', d)}
        style={selectable ? 'cursor:pointer' : ''}
      >
        <div class="num">{d.getDate()}</div>
        {#each eventsForDay(d) as event}
          <div class="event" on:click|stopPropagation={() => dispatch('eventClick', event)}>
            {event.title}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>`;

export const vueBase = (appVue: string): ExampleConfig => ({
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nexa Calendar - Vue</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"><\/script>
</body>
</html>`,
  'vite.config.js': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: { host: '0.0.0.0' },
})`,
  'package.json': JSON.stringify(
    {
      name: 'nexa-calendar-vue',
      private: true,
      scripts: { dev: 'vite', build: 'vite build' },
      dependencies: { vue: '^3.4.0' },
      devDependencies: {
        vite: '^5.0.0',
        '@vitejs/plugin-vue': '^5.0.0',
        typescript: '^5.2.0',
      },
    },
    null,
    2
  ),
  'src/main.js': `import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')`,
  'src/mock-calendar.js': mockVueCalendar,
  'src/style.css': MOCK_STYLES,
  'src/App.vue': appVue,
});

export const reactBase = (
  appTsx: string,
  extraFiles: Record<string, string> = {}
): ExampleConfig => ({
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nexa Calendar - React</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"><\/script>
</body>
</html>`,
  'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0' },
})`,
  'package.json': JSON.stringify(
    {
      name: 'nexa-calendar-react',
      private: true,
      scripts: { dev: 'vite', build: 'vite build' },
      dependencies: { react: '^18.2.0', 'react-dom': '^18.2.0' },
      devDependencies: {
        vite: '^5.0.0',
        '@vitejs/plugin-react': '^4.0.0',
        typescript: '^5.2.0',
      },
    },
    null,
    2
  ),
  'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)`,
  'src/NxCalendar.tsx': mockReactCalendar,
  'src/style.css': MOCK_STYLES,
  'src/App.tsx': appTsx,
  ...extraFiles,
});

export const svelteBase = (
  appSvelte: string,
  extraFiles: Record<string, string> = {}
): ExampleConfig => ({
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nexa Calendar - Svelte</title>
</head>
<body>
  <script type="module" src="/src/main.js"><\/script>
</body>
</html>`,
  'vite.config.js': `import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  server: { host: '0.0.0.0' },
})`,
  'package.json': JSON.stringify(
    {
      name: 'nexa-calendar-svelte',
      private: true,
      scripts: { dev: 'vite', build: 'vite build' },
      dependencies: { svelte: '^4.0.0' },
      devDependencies: { vite: '^5.0.0', '@sveltejs/vite-plugin-svelte': '^3.0.0' },
    },
    null,
    2
  ),
  'src/main.js': `import App from './App.svelte'

const app = new App({ target: document.body })

export default app`,
  'src/MockCalendar.svelte': mockSvelteCalendar,
  'src/style.css': MOCK_STYLES,
  'src/App.svelte': appSvelte,
  ...extraFiles,
});

export const vanillaBase = (html: string): ExampleConfig => ({
  'index.html': html,
});
