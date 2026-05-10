<template>
  <div class="demo-container">
    <div class="calendar-wrapper">
      <nx-calendar ref="calRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue';
import '@nexa-calendar/ui';
import {
  BASE_EVENTS,
  DRAG_DROP_EVENTS,
  BACKGROUND_EVENTS,
  SELECTABLE_EVENTS,
  TIMELINE_EVENTS,
  RESOURCE_EVENTS,
  RESOURCES,
  BIZ_HOURS,
  EXAMPLE_VIEWS,
  TIMEZONES,
  TIMEZONE_EVENTS_UTC,
} from '../data';
import type { NxTheme, ViewType, ExampleKey, FrameworkKey } from '../data';

const props = defineProps<{
  theme: NxTheme;
  lang: string;
  view: ViewType;
  example: ExampleKey;
  framework: FrameworkKey;
  timezone?: string;
  eventLimit?: number;
  bizHours?:
    | { daysOfWeek: number[]; startTime: string; endTime: string }
    | { daysOfWeek: number[]; startTime: string; endTime: string }[]
    | false;
  showBizHours?: boolean;
  showWeekends?: boolean;
  editable?: boolean;
  slotDuration?: number;
  hourHeight?: number;
  slotLabelFormat?: string;
  minTime?: string;
  maxTime?: string;
}>();

console.log(
  'CalendarDemo props bizHours:',
  props.bizHours,
  'bizHours type:',
  typeof props.bizHours
);

const activeTab = ref<'view' | 'code'>('view');

interface NxCalendarEl extends HTMLElement {
  theme: NxTheme;
  locale: string;
  view: ViewType;
  events: unknown[];
  resources: unknown[];
  editable: boolean;
  eventStartEditable: boolean;
  eventDurationEditable: boolean;
  dayMaxEvents: number | boolean;
  businessHours: unknown;
  weekends: boolean;
  showNonCurrentDates: boolean;
  fixedWeekCount: boolean;
  views: ViewType[];
  addEvent: (e: unknown) => void;
  requestUpdate: () => void;
  slotDuration?: number;
  hourHeight?: number;
  slotLabelFormat?: string;
  minTime?: string;
  maxTime?: string;
}

const calRef = ref<NxCalendarEl>();

function cal(): NxCalendarEl | undefined {
  return calRef.value;
}

function getExampleViews(example: ExampleKey): ViewType[] {
  return EXAMPLE_VIEWS[example] as ViewType[];
}

function getValidView(example: ExampleKey, candidate?: ViewType): ViewType {
  const supportedViews = getExampleViews(example);
  return candidate && supportedViews.includes(candidate) ? candidate : supportedViews[0];
}

const currentView = computed(() => getValidView(props.example, props.view));
const codeSnippet = computed(() =>
  generateCode(props.example, currentView.value, props.lang, props.theme, props.framework)
);

function parseOffsetMinutes(offset: string): number {
  const sign = offset.startsWith('-') ? -1 : 1;
  const [hours, minutes] = offset.slice(1).split(':').map(Number);
  return sign * (hours * 60 + minutes);
}

function formatShiftedIso(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function shiftIsoToOffset(iso: string, offset: string): string {
  const shifted = new Date(new Date(iso).getTime() + parseOffsetMinutes(offset) * 60_000);
  return formatShiftedIso(shifted);
}

function buildTimezoneEvents(timezoneCode?: string) {
  const timezone = TIMEZONES.find(item => item.code === timezoneCode) ?? TIMEZONES[0];

  return TIMEZONE_EVENTS_UTC.map(event => ({
    ...event,
    start: shiftIsoToOffset(String(event.start), timezone.offset),
    ...(event.end ? { end: shiftIsoToOffset(String(event.end), timezone.offset) } : {}),
  }));
}

function resetDefaults(c: NxCalendarEl) {
  c.theme = props.theme;
  c.locale = props.lang;
  c.view = currentView.value;
  c.views = getExampleViews(props.example);
  c.editable = true;
  c.eventStartEditable = true;
  c.eventDurationEditable = true;
  c.dayMaxEvents = false;
  c.businessHours = false;
  c.weekends = true;
  c.showNonCurrentDates = true;
  c.fixedWeekCount = true;
  c.events = [];
  c.resources = [];
  c.slotDuration = props.slotDuration ?? 60;
  c.hourHeight = props.hourHeight ?? 48;
  c.slotLabelFormat = props.slotLabelFormat ?? 'h:mm a';
  c.minTime = props.minTime ?? '00:00';
  c.maxTime = props.maxTime ?? '24:00';
}

function applyExample(key: ExampleKey, c: NxCalendarEl) {
  resetDefaults(c);
  c.views = getExampleViews(key);
  c.view = getValidView(key, props.view);

  const useBizHours = props.bizHours !== undefined ? props.bizHours : BIZ_HOURS;
  const useWeekends = props.showWeekends !== undefined ? props.showWeekends : true;
  const useEditable = props.editable !== undefined ? props.editable : true;

  switch (key) {
    case 'full':
      c.events = BASE_EVENTS;
      c.dayMaxEvents = 5;
      c.businessHours = useBizHours;
      c.weekends = useWeekends;
      c.editable = useEditable;
      c.eventStartEditable = useEditable;
      c.eventDurationEditable = useEditable;
      break;

    case 'business':
      c.events = BASE_EVENTS.filter((e: any) => e.id !== 4);
      c.businessHours = useBizHours;
      c.weekends = false;
      c.showNonCurrentDates = false;
      break;

    case 'minimal':
      c.events = BASE_EVENTS.slice(0, 4);
      c.editable = false;
      c.eventStartEditable = false;
      c.eventDurationEditable = false;
      break;

    case 'noweekends':
      c.events = BASE_EVENTS;
      c.weekends = false;
      c.showNonCurrentDates = false;
      break;

    case 'eventlimit':
      c.events = BASE_EVENTS;
      c.dayMaxEvents = props.eventLimit || 3;
      c.businessHours = useBizHours;
      break;

    case 'timeline':
      c.events = TIMELINE_EVENTS;
      break;

    case 'resource-timeline':
      c.resources = RESOURCES;
      c.events = RESOURCE_EVENTS;
      break;

    case 'year':
      c.events = BASE_EVENTS;
      break;

    case 'drag-drop':
      c.events = DRAG_DROP_EVENTS;
      c.editable = true;
      c.eventStartEditable = true;
      break;

    case 'background-events':
      c.events = BACKGROUND_EVENTS;
      break;

    case 'selectable':
      c.events = SELECTABLE_EVENTS;
      break;

    case 'locales':
      c.events = BASE_EVENTS;
      c.locale = props.lang;
      break;

    case 'theming':
      c.events = BASE_EVENTS;
      c.theme = props.theme;
      break;

    case 'timezones':
      c.events = buildTimezoneEvents(props.timezone);
      break;

    default:
      c.events = BASE_EVENTS;
  }
  c.requestUpdate();
}

async function init() {
  await customElements.whenDefined('nx-calendar');
  await nextTick();
  const c = cal();
  if (!c) return;

  attachEventListeners(c);
  applyExample(props.example, c);
}

function attachEventListeners(c: NxCalendarEl) {
  c.addEventListener('eventClick', (e: Event) => {
    const ev = (e as CustomEvent).detail?.event ?? (e as CustomEvent).detail;
    window.alert('Event clicked: ' + ev.title);
  });
  c.addEventListener('dateClick', (e: Event) => {
    const { date, allDay } = (e as CustomEvent).detail;
    const title = window.prompt('New event title:');
    if (title) {
      c.addEvent({
        title,
        start: date,
        allDay,
        backgroundColor:
          '#' +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0'),
      });
    }
  });
  c.addEventListener('eventDrop', (e: Event) => {
    const { event, oldStart, newStart } = (e as CustomEvent).detail;
    console.log('Event moved:', event.title, 'from', oldStart, 'to', newStart);
  });
  c.addEventListener('eventResize', (e: Event) => {
    const { event, oldEnd, newEnd } = (e as CustomEvent).detail;
    console.log('Event resized:', event.title, 'from', oldEnd, 'to', newEnd);
  });
}

onMounted(init);

watch(
  () => props.example,
  key => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      applyExample(key, c);
    });
  }
);

watch(
  () => props.lang,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      c.locale = v;
      c.requestUpdate();
    });
  }
);

watch(
  () => props.view,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      c.views = getExampleViews(props.example);
      c.view = getValidView(props.example, v);
      if (props.example === 'resource-timeline') c.resources = RESOURCES;
      c.requestUpdate();
    });
  }
);

watch(
  () => props.theme,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      c.theme = v;
      c.requestUpdate();
    });
  }
);

watch(
  () => props.eventLimit,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      if (props.example === 'eventlimit') {
        c.dayMaxEvents = v ?? true;
        c.requestUpdate();
      }
    });
  }
);

watch(
  () => [props.bizHours, props.example],
  ([v, ex]) => {
    console.log('WATCH triggered - bizHours:', v, 'example:', ex);
    nextTick(() => {
      const c = cal();
      if (!c) {
        console.log('Calendar not ready yet');
        return;
      }
      if (ex === 'business' || ex === 'full') {
        // Force new object reference for Lit reactivity
        const newBizHours =
          v === false ? false : Array.isArray(v) ? [...v.map(h => ({ ...h }))] : { ...v };
        c.businessHours = newBizHours;
        console.log('Set businessHours on calendar:', newBizHours);
        c.requestUpdate();
      }
    });
  },
  { immediate: true }
);

watch(
  () => props.showWeekends,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      if (props.example === 'full') {
        c.weekends = v ?? true;
        c.requestUpdate();
      }
    });
  }
);

watch(
  () => props.editable,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      if (props.example === 'full') {
        c.editable = v ?? true;
        c.eventStartEditable = v ?? true;
        c.eventDurationEditable = v ?? true;
        c.requestUpdate();
      }
    });
  }
);

watch(
  () => props.timezone,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      if (props.example === 'timezones') {
        c.events = buildTimezoneEvents(v);
        c.requestUpdate();
      }
    });
  }
);

watch(
  () => props.slotDuration,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      c.slotDuration = v;
      c.requestUpdate();
    });
  }
);

watch(
  () => props.hourHeight,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      c.hourHeight = v;
      c.requestUpdate();
    });
  }
);

watch(
  () => props.slotLabelFormat,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      c.slotLabelFormat = v;
      c.requestUpdate();
    });
  }
);

watch(
  () => props.minTime,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      c.minTime = v;
      c.requestUpdate();
    });
  }
);

watch(
  () => props.maxTime,
  v => {
    nextTick(() => {
      const c = cal();
      if (!c) return;
      c.maxTime = v;
      c.requestUpdate();
    });
  }
);

function addRandomEvent() {
  const c = cal();
  if (!c) return;
  const today = new Date();
  const y = today.getFullYear();
  const mo = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const h = String(10 + Math.floor(Math.random() * 6)).padStart(2, '0');
  c.addEvent({
    title: 'New Event',
    start: `${y}-${mo}-${day}T${h}:00:00`,
    backgroundColor:
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0'),
  });
}

defineExpose({ addRandomEvent });

type HandlerKind = 'selectable' | 'dragdrop';

interface SnippetConfig {
  declarations: string[];
  propNames: string[];
  handler?: HandlerKind;
}

function serializeBusinessHours(value: typeof props.bizHours): string {
  if (value === false) return 'false';
  const hours = value || BIZ_HOURS;
  return `{ daysOfWeek: [${hours.daysOfWeek.join(', ')}], startTime: '${hours.startTime}', endTime: '${hours.endTime}' }`;
}

function baseEventsSnippet(): string {
  return `const today = new Date().toISOString().slice(0, 10)
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

const events = [
  { id: 1, title: 'Sprint Planning', start: today + 'T09:00:00', end: today + 'T10:00:00', backgroundColor: '#3b82f6' },
  { id: 2, title: 'Design Review', start: tomorrow + 'T14:00:00', end: tomorrow + 'T15:00:00', backgroundColor: '#10b981' },
  { id: 3, title: 'Weekly Sync', start: today + 'T16:00:00', end: today + 'T16:30:00', backgroundColor: '#8b5cf6' },
]`;
}

function timelineEventsSnippet(): string {
  return `const today = new Date().toISOString().slice(0, 10)
const plus2 = new Date(Date.now() + (2 * 86400000)).toISOString().slice(0, 10)
const plus4 = new Date(Date.now() + (4 * 86400000)).toISOString().slice(0, 10)

const events = [
  { id: 1, title: 'Project Kickoff', start: today + 'T09:00:00', end: today + 'T11:00:00', backgroundColor: '#3b82f6' },
  { id: 2, title: 'Development Sprint', start: plus2 + 'T09:00:00', end: plus4 + 'T17:00:00', backgroundColor: '#10b981' },
]`;
}

function dragDropEventsSnippet(): string {
  return `const today = new Date().toISOString().slice(0, 10)
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

const events = [
  { id: 1, title: 'Move Me', start: today + 'T10:00:00', end: today + 'T11:00:00', backgroundColor: '#3b82f6', startEditable: true, durationEditable: true },
  { id: 2, title: 'Resizable', start: tomorrow + 'T13:00:00', end: tomorrow + 'T14:30:00', backgroundColor: '#10b981', durationEditable: true },
]`;
}

function backgroundEventsSnippet(): string {
  return `const today = new Date().toISOString().slice(0, 10)

const events = [
  { id: 1, title: 'Busy Block', start: today + 'T08:00:00', end: today + 'T18:00:00', display: 'background', backgroundColor: '#f97316' },
  { id: 2, title: 'Regular Meeting', start: today + 'T10:00:00', end: today + 'T11:00:00', backgroundColor: '#10b981' },
]`;
}

function resourceTimelineSnippet(): string {
  return `const today = new Date().toISOString().slice(0, 10)
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

const resources = [
  { id: 'r1', title: 'Room A' },
  { id: 'r2', title: 'Room B', children: [
    { id: 'r2a', title: 'Room B1' },
    { id: 'r2b', title: 'Room B2' },
  ]},
]

const events = [
  { id: 101, title: 'Room A Setup', start: today + 'T08:00:00', end: today + 'T10:00:00', resourceId: 'r1', backgroundColor: '#0ea5e9' },
  { id: 102, title: 'Room B Workshop', start: today + 'T11:00:00', end: today + 'T13:00:00', resourceId: 'r2a', backgroundColor: '#f59e0b' },
  { id: 103, title: 'Room B2 Interview', start: tomorrow + 'T14:00:00', end: tomorrow + 'T16:00:00', resourceId: 'r2b', backgroundColor: '#06b6d4' },
]`;
}

function timezoneEventsSnippet(timezoneCode: string): string {
  const timezone = TIMEZONES.find(item => item.code === timezoneCode) ?? TIMEZONES[0];
  return `const timezone = '${timezone.code}'
const timezoneOffset = '${timezone.offset}'
const utcEvents = [
  { id: 'tz-1', title: 'Global Standup', start: '2026-05-08T14:00:00.000Z', end: '2026-05-08T14:30:00.000Z', backgroundColor: '#3b82f6' },
  { id: 'tz-2', title: 'Client Review', start: '2026-05-09T17:00:00.000Z', end: '2026-05-09T18:00:00.000Z', backgroundColor: '#10b981' },
]

const toMinutes = (offset: string) => {
  const sign = offset.startsWith('-') ? -1 : 1
  const [hours, minutes] = offset.slice(1).split(':').map(Number)
  return sign * ((hours * 60) + minutes)
}

const toLocalIso = (iso: string, offset: string) => {
  const shifted = new Date(new Date(iso).getTime() + (toMinutes(offset) * 60000))
  const year = shifted.getUTCFullYear()
  const month = String(shifted.getUTCMonth() + 1).padStart(2, '0')
  const day = String(shifted.getUTCDate()).padStart(2, '0')
  const hours = String(shifted.getUTCHours()).padStart(2, '0')
  const minutes = String(shifted.getUTCMinutes()).padStart(2, '0')
  return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':00'
}

const events = utcEvents.map((event) => ({
  ...event,
  start: toLocalIso(event.start, timezoneOffset),
  end: event.end ? toLocalIso(event.end, timezoneOffset) : undefined,
}))`;
}

function getSnippetConfig(
  ex: ExampleKey,
  vw: ViewType,
  lang: string,
  theme: NxTheme
): SnippetConfig {
  const declarations = [
    `const view = '${vw}'`,
    `const locale = '${lang}'`,
    `const theme = '${theme}'`,
    `const views = [${getExampleViews(ex)
      .map(viewName => `'${viewName}'`)
      .join(', ')}]`,
  ];

  switch (ex) {
    case 'full':
      declarations.push(
        baseEventsSnippet(),
        `const editable = ${props.editable !== undefined ? String(props.editable) : 'true'}`,
        'const dayMaxEvents = 5',
        `const weekends = ${props.showWeekends !== undefined ? String(props.showWeekends) : 'true'}`,
        `const businessHours = ${serializeBusinessHours(props.bizHours)}`,
        `const slotDuration = ${props.slotDuration ?? 60}`,
        `const hourHeight = ${props.hourHeight ?? 48}`,
        `const slotLabelFormat = '${props.slotLabelFormat ?? 'h:mm a'}'`,
        `const minTime = '${props.minTime ?? '00:00'}'`,
        `const maxTime = '${props.maxTime ?? '24:00'}'`
      );
      return {
        declarations,
        propNames: [
          'view',
          'locale',
          'theme',
          'views',
          'events',
          'editable',
          'dayMaxEvents',
          'weekends',
          'businessHours',
          'slotDuration',
          'hourHeight',
          'slotLabelFormat',
          'minTime',
          'maxTime',
        ],
      };

    case 'business':
      declarations.push(
        baseEventsSnippet(),
        `const businessHours = ${serializeBusinessHours(props.bizHours)}`,
        'const weekends = false',
        'const showNonCurrentDates = false'
      );
      return {
        declarations,
        propNames: [
          'view',
          'locale',
          'theme',
          'views',
          'events',
          'businessHours',
          'weekends',
          'showNonCurrentDates',
        ],
      };

    case 'minimal':
      declarations.push(baseEventsSnippet(), 'const editable = false');
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'events', 'editable'],
      };

    case 'noweekends':
      declarations.push(
        baseEventsSnippet(),
        'const weekends = false',
        'const showNonCurrentDates = false'
      );
      return {
        declarations,
        propNames: [
          'view',
          'locale',
          'theme',
          'views',
          'events',
          'weekends',
          'showNonCurrentDates',
        ],
      };

    case 'eventlimit':
      declarations.push(baseEventsSnippet(), `const dayMaxEvents = ${props.eventLimit ?? 3}`);
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'events', 'dayMaxEvents'],
      };

    case 'timeline':
      declarations.push(timelineEventsSnippet());
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'events'],
      };

    case 'resource-timeline':
      declarations.push(resourceTimelineSnippet());
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'resources', 'events'],
      };

    case 'year':
      declarations.push(baseEventsSnippet());
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'events'],
      };

    case 'drag-drop':
      declarations.push(
        dragDropEventsSnippet(),
        'const editable = true',
        'const eventStartEditable = true',
        'const eventDurationEditable = true'
      );
      return {
        declarations,
        propNames: [
          'view',
          'locale',
          'theme',
          'views',
          'events',
          'editable',
          'eventStartEditable',
          'eventDurationEditable',
        ],
        handler: 'dragdrop',
      };

    case 'background-events':
      declarations.push(backgroundEventsSnippet());
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'events'],
      };

    case 'selectable':
      declarations.push(baseEventsSnippet());
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'events'],
        handler: 'selectable',
      };

    case 'locales':
      declarations.push(baseEventsSnippet());
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'events'],
      };

    case 'theming':
      declarations.push(baseEventsSnippet());
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'events'],
      };

    case 'timezones':
      declarations.push(timezoneEventsSnippet(props.timezone ?? 'America/New_York'));
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'events'],
      };

    default:
      declarations.push(baseEventsSnippet());
      return {
        declarations,
        propNames: ['view', 'locale', 'theme', 'views', 'events'],
      };
  }
}

function getSnippetHandlers(kind: HandlerKind | undefined, framework: FrameworkKey) {
  if (!kind) {
    return {
      declarations: [] as string[],
      bindings: [] as string[],
      webSetup: [] as string[],
    };
  }

  if (kind === 'selectable') {
    if (framework === 'react') {
      return {
        declarations: [
          `const handleDateClick = (event: CustomEvent<{ date: string; allDay: boolean }>) => {
  const { date, allDay } = event.detail
  const title = window.prompt('New event title:')
  if (title) console.log({ title, date, allDay })
}`,
        ],
        bindings: ['onDateClick={handleDateClick}'],
        webSetup: [],
      };
    }

    if (framework === 'vue') {
      return {
        declarations: [
          `const handleDateClick = ({ date, allDay }: { date: string; allDay: boolean }) => {
  const title = window.prompt('New event title:')
  if (title) console.log({ title, date, allDay })
}`,
        ],
        bindings: ['@dateClick="handleDateClick"'],
        webSetup: [],
      };
    }

    if (framework === 'svelte') {
      return {
        declarations: [
          `function handleDateClick(event: CustomEvent<{ date: string; allDay: boolean }>) {
  const { date, allDay } = event.detail
  const title = window.prompt('New event title:')
  if (title) console.log({ title, date, allDay })
}`,
        ],
        bindings: ['on:dateClick={handleDateClick}'],
        webSetup: [],
      };
    }

    return {
      declarations: [
        `function handleDateClick(event) {
  const { date, allDay } = event.detail
  const title = window.prompt('New event title:')
  if (title) console.log({ title, date, allDay })
}`,
      ],
      bindings: [],
      webSetup: [`cal.addEventListener('dateClick', handleDateClick)`],
    };
  }

  if (framework === 'react') {
    return {
      declarations: [
        `const handleEventDrop = (event: CustomEvent) => {
  console.log('eventDrop', event.detail)
}

const handleEventResize = (event: CustomEvent) => {
  console.log('eventResize', event.detail)
}`,
      ],
      bindings: ['onEventDrop={handleEventDrop}', 'onEventResize={handleEventResize}'],
      webSetup: [],
    };
  }

  if (framework === 'vue') {
    return {
      declarations: [
        `const handleEventDrop = (payload: unknown) => {
  console.log('eventDrop', payload)
}

const handleEventResize = (payload: unknown) => {
  console.log('eventResize', payload)
}`,
      ],
      bindings: ['@eventDrop="handleEventDrop"', '@eventResize="handleEventResize"'],
      webSetup: [],
    };
  }

  if (framework === 'svelte') {
    return {
      declarations: [
        `function handleEventDrop(event: CustomEvent) {
  console.log('eventDrop', event.detail)
}

function handleEventResize(event: CustomEvent) {
  console.log('eventResize', event.detail)
}`,
      ],
      bindings: ['on:eventDrop={handleEventDrop}', 'on:eventResize={handleEventResize}'],
      webSetup: [],
    };
  }

  return {
    declarations: [
      `function handleEventDrop(event) {
  console.log('eventDrop', event.detail)
}

function handleEventResize(event) {
  console.log('eventResize', event.detail)
}`,
    ],
    bindings: [],
    webSetup: [
      `cal.addEventListener('eventDrop', handleEventDrop)`,
      `cal.addEventListener('eventResize', handleEventResize)`,
    ],
  };
}

function generateCode(
  ex: ExampleKey,
  vw: ViewType,
  lang: string,
  theme: NxTheme,
  fw: FrameworkKey
): string {
  const config = getSnippetConfig(ex, vw, lang, theme);
  const handlers = getSnippetHandlers(config.handler, fw);
  const scriptBody = [...config.declarations, ...handlers.declarations].join('\n\n');

  if (fw === 'react') {
    const propLines = config.propNames.map(name => `      ${name}={${name}}`);
    return `import { NxCalendar } from '@nexa-calendar/react'

${scriptBody}

export function CalendarExample() {
  return (
    <NxCalendar
${propLines.join('\n')}
${handlers.bindings.map(binding => `      ${binding}`).join('\n')}
    />
  )
}`;
  }

  if (fw === 'vue') {
    const propLines = config.propNames.map(name => `    :${name}="${name}"`);
    return `<script setup lang="ts">
import { NxCalendar } from '@nexa-calendar/vue'

${scriptBody}
<\/script>

<template>
  <NxCalendar
${propLines.join('\n')}
${handlers.bindings.map(binding => `    ${binding}`).join('\n')}
  />
</template>`;
  }

  if (fw === 'svelte') {
    const propLines = config.propNames.map(name => `  ${name}={${name}}`);
    return `<script lang="ts">
  import NxCalendar from '@nexa-calendar/svelte/NxCalendar.svelte'

${scriptBody
  .split('\n')
  .map(line => (line ? `  ${line}` : ''))
  .join('\n')}
<\/script>

<NxCalendar
${propLines.join('\n')}
${handlers.bindings.map(binding => `  ${binding}`).join('\n')}
/>`;
  }

  const setupLines = [
    "const cal = document.querySelector('nx-calendar')",
    ...config.propNames.map(name => `cal.${name} = ${name}`),
    ...handlers.webSetup,
  ];

  return `<nx-calendar></nx-calendar>

<script type="module">
  import '@nexa-calendar/ui'

${scriptBody
  .split('\n')
  .map(line => (line ? `  ${line}` : ''))
  .join('\n')}

  ${setupLines.join('\n  ')}
<\/script>`;
}
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.demo-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #1e293b;
  margin-bottom: 0;
}

.tab-btn {
  padding: 10px 24px;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  background: #1e293b;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  color: #e2e8f0;
  background: #334155;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: #0f172a;
}

.calendar-wrapper {
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.45);
}

.calendar-wrapper nx-calendar {
  display: block;
}

.code-wrapper {
  background: #0d1117;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.45);
  max-height: 600px;
  overflow-y: auto;
}

.code-block {
  padding: 20px;
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.6;
  color: #e6edf3;
  white-space: pre;
  tab-size: 2;
}
</style>
