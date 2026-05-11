<template>
  <div class="demos2-page">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">🚀 Interactive Demos</h1>
        <p class="text-slate-400 text-lg">
          Select a framework and explore interactive calendar examples. Edit the code in real-time
          and see the results instantly.
        </p>
      </div>

      <!-- Framework Selector -->
      <div class="mb-12 flex flex-wrap gap-3">
        <button
          v-for="fw in frameworks"
          :key="fw.key"
          @click="selectedFramework = fw.key"
          :class="[
            'px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2',
            selectedFramework === fw.key
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50',
          ]"
        >
          <span class="text-xl">{{ fw.emoji }}</span>
          {{ fw.label }}
        </button>
      </div>

      <!-- Example Selector -->
      <div class="mb-8">
        <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Select Example
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="example in currentExamples"
            :key="example.key"
            @click="selectedExample = example.key"
            :class="[
              'p-4 rounded-lg text-left transition-all border',
              selectedExample === example.key
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600/50 hover:bg-slate-800/50',
            ]"
          >
            <div class="text-2xl mb-2">{{ example.emoji }}</div>
            <div class="font-semibold text-white text-sm">{{ example.title }}</div>
            <div class="text-xs text-slate-400 mt-1">{{ example.description }}</div>
          </button>
        </div>
      </div>

      <!-- Sandpack Container -->
      <div class="sandpack-wrapper">
        <div class="sandpack-header">
          <h3 class="font-semibold text-white">
            {{ currentExample?.title }} · {{ currentFramework?.label }}
          </h3>
          <p class="text-xs text-slate-400 mt-1">Edit code below and see live preview</p>
        </div>
        <div class="sandpack-container">
          <Sandpack
            :key="`${selectedFramework}-${selectedExample}`"
            :template="sandpackTemplate"
            :files="currentFiles"
            :customSetup="customSetup"
            :options="sandpackOptions"
            theme="dark"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Sandpack } from 'sandpack-vue3';

type FrameworkKey = 'vue' | 'react' | 'svelte';

interface Framework {
  key: FrameworkKey;
  label: string;
  emoji: string;
}

interface Example {
  key: string;
  title: string;
  description: string;
  emoji: string;
}

const frameworks: Framework[] = [
  { key: 'vue', label: 'Vue 3', emoji: '💚' },
  { key: 'react', label: 'React', emoji: '⚛️' },
  { key: 'svelte', label: 'Svelte', emoji: '🔥' },
];

const examplesByFramework: Record<FrameworkKey, Example[]> = {
  vue: [
    {
      key: 'basic',
      title: 'Basic Calendar',
      description: 'Simple month view with events',
      emoji: '📅',
    },
    {
      key: 'interactive',
      title: 'Interactive',
      description: 'Drag, drop & create events',
      emoji: '✋',
    },
    { key: 'themes', title: 'Themes', description: 'Multiple theme styles', emoji: '🎨' },
    { key: 'timezones', title: 'Timezones', description: 'Handle multiple timezones', emoji: '🌐' },
    { key: 'responsive', title: 'Responsive', description: 'Mobile-friendly layout', emoji: '📱' },
    { key: 'advanced', title: 'Advanced', description: 'Custom slots & styling', emoji: '⚡' },
  ],
  react: [
    {
      key: 'basic',
      title: 'Basic Calendar',
      description: 'Simple month view with events',
      emoji: '📅',
    },
    {
      key: 'interactive',
      title: 'Interactive',
      description: 'Drag, drop & create events',
      emoji: '✋',
    },
    { key: 'hooks', title: 'Custom Hooks', description: 'Event management hooks', emoji: '🎣' },
    { key: 'timezones', title: 'Timezones', description: 'Handle multiple timezones', emoji: '🌐' },
    { key: 'responsive', title: 'Responsive', description: 'Mobile-friendly layout', emoji: '📱' },
    { key: 'advanced', title: 'Advanced', description: 'Custom components', emoji: '⚡' },
  ],
  svelte: [
    {
      key: 'basic',
      title: 'Basic Calendar',
      description: 'Simple month view with events',
      emoji: '📅',
    },
    {
      key: 'interactive',
      title: 'Interactive',
      description: 'Reactive event handling',
      emoji: '✋',
    },
    { key: 'stores', title: 'Svelte Stores', description: 'State management', emoji: '💾' },
    { key: 'timezones', title: 'Timezones', description: 'Handle multiple timezones', emoji: '🌐' },
    { key: 'responsive', title: 'Responsive', description: 'Mobile-friendly layout', emoji: '📱' },
    { key: 'advanced', title: 'Advanced', description: 'Animations & transitions', emoji: '⚡' },
  ],
};

const selectedFramework = ref<FrameworkKey>('vue');
const selectedExample = ref('basic');

const currentFramework = computed(() => frameworks.find(f => f.key === selectedFramework.value));
const currentExamples = computed(() => examplesByFramework[selectedFramework.value]);
const currentExample = computed(
  () => currentExamples.value.find(e => e.key === selectedExample.value) || currentExamples.value[0]
);

const sandpackTemplate = computed(() => {
  return selectedFramework.value === 'vue'
    ? 'vue3'
    : selectedFramework.value === 'react'
      ? 'react'
      : selectedFramework.value === 'svelte'
        ? 'svelte'
        : 'angular';
});

const customSetup = computed(() => ({
  dependencies: {
    '@nexa-calendar/vue': 'unpkg',
    '@nexa-calendar/react': 'unpkg',
    '@nexa-calendar/ui': 'unpkg',
    lit: '^3.0.0',
  },
}));

const sandpackOptions = {
  showTabs: true,
  showLineNumbers: true,
  showConsoleButton: false,
  resizablePanels: true,
  wrapContent: false,
  closableTabs: false,
  editorHeight: 700,
  recompileMode: 'delayed' as const,
  recompileDelay: 500,
};

const vueExamples: Record<string, Record<string, string>> = {
  basic: {
    '/src/App.vue': `<script setup>
import { ref } from 'vue'
import NxCalendar from '@nexa-calendar/vue'
import '@nexa-calendar/ui/styles.css'

const events = ref([
  { 
    id: '1', 
    title: 'Team Meeting', 
    start: new Date().toISOString(),
    duration: 60
  },
  { 
    id: '2', 
    title: 'Project Deadline', 
    start: new Date(Date.now() + 86400000).toISOString(),
    duration: 480
  }
])

const handleEventClick = (event) => {
  console.log('Event clicked:', event)
}
<\/script>

<template>
  <div class="calendar-wrapper">
    <NxCalendar 
      :events="events"
      view="month"
      theme="ocean"
      @event-click="handleEventClick"
    />
  </div>
</template>

<style>
.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}
</style>`,
  },
  interactive: {
    '/src/App.vue': `<script setup>
import { ref } from 'vue'
import NxCalendar from '@nexa-calendar/vue'
import '@nexa-calendar/ui/styles.css'

const events = ref([
  { id: '1', title: 'Event 1', start: new Date().toISOString(), duration: 60 }
])

const handleDateSelect = (date) => {
  const newEvent = {
    id: Date.now().toString(),
    title: 'New Event',
    start: date.toISOString(),
    duration: 60
  }
  events.value.push(newEvent)
}

const handleEventDrop = (event, newStart) => {
  const idx = events.value.findIndex(e => e.id === event.id)
  if (idx >= 0) {
    events.value[idx].start = newStart.toISOString()
  }
}
<\/script>

<template>
  <div class="calendar-wrapper">
    <div class="mb-4 p-3 bg-blue-50 rounded text-sm">
      💡 Click on a date to create an event, drag events to reschedule
    </div>
    <NxCalendar 
      :events="events"
      view="week"
      theme="rose"
      :selectable="true"
      :draggable="true"
      @date-select="handleDateSelect"
      @event-drop="handleEventDrop"
    />
  </div>
</template>

<style>
.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}
</style>`,
  },
  themes: {
    '/src/App.vue': `<script setup>
import { ref } from 'vue'
import NxCalendar from '@nexa-calendar/vue'
import '@nexa-calendar/ui/styles.css'

const selectedTheme = ref('ocean')
const themes = ['light', 'dark', 'ocean', 'rose', 'forest', 'amber']

const events = ref([
  { id: '1', title: 'Event', start: new Date().toISOString(), duration: 60 }
])
<\/script>

<template>
  <div class="calendar-wrapper">
    <div class="mb-4 flex gap-2 flex-wrap">
      <button
        v-for="theme in themes"
        :key="theme"
        @click="selectedTheme = theme"
        :class="[
          'px-3 py-1 rounded text-sm font-medium transition-all',
          selectedTheme === theme
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ theme }}
      </button>
    </div>
    <NxCalendar 
      :events="events"
      :theme="selectedTheme"
      view="month"
    />
  </div>
</template>

<style>
.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}
</style>`,
  },
  timezones: {
    '/src/App.vue': `<script setup>
import { ref } from 'vue'
import NxCalendar from '@nexa-calendar/vue'
import '@nexa-calendar/ui/styles.css'

const timezone = ref('UTC')
const timezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']

const events = ref([
  { 
    id: '1', 
    title: 'Global Meeting', 
    start: new Date().toISOString(),
    timezone: 'UTC',
    duration: 60 
  }
])
<\/script>

<template>
  <div class="calendar-wrapper">
    <div class="mb-4">
      <label class="text-sm font-medium">Timezone:</label>
      <select v-model="timezone" class="ml-2 px-2 py-1 border rounded">
        <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
      </select>
    </div>
    <NxCalendar 
      :events="events"
      :timezone="timezone"
      view="day"
      theme="ocean"
    />
  </div>
</template>

<style>
.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}
</style>`,
  },
  responsive: {
    '/src/App.vue': `<script setup>
import { ref } from 'vue'
import NxCalendar from '@nexa-calendar/vue'
import '@nexa-calendar/ui/styles.css'

const isMobile = ref(window.innerWidth < 768)

const events = ref([
  { id: '1', title: 'Event 1', start: new Date().toISOString(), duration: 60 },
  { id: '2', title: 'Event 2', start: new Date(Date.now() + 86400000).toISOString(), duration: 120 }
])
<\/script>

<template>
  <div class="calendar-wrapper">
    <NxCalendar 
      :events="events"
      :view="isMobile ? 'day' : 'month'"
      theme="ocean"
      responsive
    />
  </div>
</template>

<style>
.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .calendar-wrapper {
    height: 400px;
  }
}
</style>`,
  },
  advanced: {
    '/src/App.vue': `<script setup>
import { ref } from 'vue'
import NxCalendar from '@nexa-calendar/vue'
import '@nexa-calendar/ui/styles.css'

const events = ref([
  { 
    id: '1', 
    title: 'Custom Event',
    start: new Date().toISOString(),
    duration: 60,
    customClass: 'bg-blue-500'
  }
])
<\/script>

<template>
  <div class="calendar-wrapper">
    <NxCalendar 
      :events="events"
      view="week"
      theme="ocean"
    >
      <template #event="{ event }">
        <div class="p-2">
          <strong>{{ event.title }}</strong>
          <p class="text-xs">Custom rendering</p>
        </div>
      </template>
    </NxCalendar>
  </div>
</template>

<style>
.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}
</style>`,
  },
};

const reactExamples: Record<string, Record<string, string>> = {
  basic: {
    '/App.jsx': `import { useState } from 'react'
import NxCalendar from '@nexa-calendar/react'
import '@nexa-calendar/ui/styles.css'

export default function App() {
  const [events] = useState([
    { 
      id: '1', 
      title: 'Team Meeting', 
      start: new Date().toISOString(),
      duration: 60
    }
  ])

  return (
    <div className="calendar-wrapper">
      <NxCalendar events={events} view="month" theme="ocean" />
    </div>
  )
}`,
    '/style.css': `.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}`,
  },
  interactive: {
    '/App.jsx': `import { useState } from 'react'
import NxCalendar from '@nexa-calendar/react'
import '@nexa-calendar/ui/styles.css'

export default function App() {
  const [events, setEvents] = useState([
    { id: '1', title: 'Event 1', start: new Date().toISOString(), duration: 60 }
  ])

  const handleDateSelect = (date) => {
    setEvents([...events, {
      id: Date.now().toString(),
      title: 'New Event',
      start: date.toISOString(),
      duration: 60
    }])
  }

  return (
    <div className="calendar-wrapper">
      <div className="info-box">💡 Click dates to create events</div>
      <NxCalendar 
        events={events}
        view="week"
        theme="rose"
        selectable
        onDateSelect={handleDateSelect}
      />
    </div>
  )
}`,
    '/style.css': `.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.info-box {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #dbeafe;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}`,
  },
  hooks: {
    '/App.jsx': `import { useState, useCallback } from 'react'
import NxCalendar from '@nexa-calendar/react'
import '@nexa-calendar/ui/styles.css'

export default function App() {
  const [events, setEvents] = useState([])

  const useCalendarEvents = () => {
    const addEvent = useCallback((event) => {
      setEvents(prev => [...prev, event])
    }, [])

    const removeEvent = useCallback((id) => {
      setEvents(prev => prev.filter(e => e.id !== id))
    }, [])

    return { events, addEvent, removeEvent }
  }

  const { events: calEvents } = useCalendarEvents()

  return (
    <div className="calendar-wrapper">
      <NxCalendar events={calEvents} view="month" theme="ocean" />
    </div>
  )
}`,
    '/style.css': `.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}`,
  },
  timezones: {
    '/App.jsx': `import { useState } from 'react'
import NxCalendar from '@nexa-calendar/react'
import '@nexa-calendar/ui/styles.css'

export default function App() {
  const [timezone, setTimezone] = useState('UTC')
  const timezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']

  return (
    <div className="calendar-wrapper">
      <div className="tz-selector">
        <label>Timezone: </label>
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          {timezones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>
      <NxCalendar timezone={timezone} view="day" theme="ocean" />
    </div>
  )
}`,
    '/style.css': `.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.tz-selector {
  margin-bottom: 1rem;
}

.tz-selector select {
  margin-left: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}`,
  },
  responsive: {
    '/App.jsx': `import { useState, useEffect } from 'react'
import NxCalendar from '@nexa-calendar/react'
import '@nexa-calendar/ui/styles.css'

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="calendar-wrapper">
      <NxCalendar view={isMobile ? 'day' : 'month'} theme="ocean" responsive />
    </div>
  )
}`,
    '/style.css': `.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .calendar-wrapper {
    height: 400px;
  }
}`,
  },
  advanced: {
    '/App.jsx': `import NxCalendar from '@nexa-calendar/react'
import '@nexa-calendar/ui/styles.css'

export default function App() {
  const events = [
    { id: '1', title: 'Custom Event', start: new Date().toISOString(), duration: 60 }
  ]

  return (
    <div className="calendar-wrapper">
      <NxCalendar 
        events={events}
        view="week"
        theme="ocean"
        renderEvent={({ event }) => (
          <div className="custom-event">
            <strong>{event.title}</strong>
            <p>Custom component</p>
          </div>
        )}
      />
    </div>
  )
}`,
    '/style.css': `.calendar-wrapper {
  height: 600px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.custom-event {
  padding: 0.5rem;
}`,
  },
};

const svelteExamples: Record<string, Record<string, string>> = {
  basic: {
    '/App.svelte': `<script>
  import NxCalendar from '@nexa-calendar/svelte'
  import '@nexa-calendar/ui/styles.css'

  let events = [
    { id: '1', title: 'Event', start: new Date().toISOString(), duration: 60 }
  ]
<\/script>

<div class="calendar-wrapper">
  <NxCalendar {events} view="month" theme="ocean" />
</div>

<style>
  :global(.calendar-wrapper) {
    height: 600px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
  }
</style>`,
  },
  interactive: {
    '/App.svelte': `<script>
  import NxCalendar from '@nexa-calendar/svelte'
  import '@nexa-calendar/ui/styles.css'

  let events = [{ id: '1', title: 'Event', start: new Date().toISOString(), duration: 60 }]

  function handleDateSelect(date) {
    events = [...events, {
      id: Date.now().toString(),
      title: 'New Event',
      start: date.toISOString(),
      duration: 60
    }]
  }
<\/script>

<div class="calendar-wrapper">
  <div class="info">💡 Click dates to create events</div>
  <NxCalendar {events} view="week" theme="rose" on:dateSelect={handleDateSelect} />
</div>

<style>
  :global(.calendar-wrapper) {
    height: 600px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
  }
  .info {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: #dbeafe;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }
</style>`,
  },
  stores: {
    '/App.svelte': `<script>
  import { writable } from 'svelte/store'
  import NxCalendar from '@nexa-calendar/svelte'
  import '@nexa-calendar/ui/styles.css'

  const events = writable([
    { id: '1', title: 'Event', start: new Date().toISOString(), duration: 60 }
  ])
<\/script>

<div class="calendar-wrapper">
  <NxCalendar events={$events} view="month" theme="ocean" />
</div>

<style>
  :global(.calendar-wrapper) {
    height: 600px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
  }
</style>`,
  },
  timezones: {
    '/App.svelte': `<script>
  import NxCalendar from '@nexa-calendar/svelte'
  import '@nexa-calendar/ui/styles.css'

  let timezone = 'UTC'
  const timezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']
<\/script>

<div class="calendar-wrapper">
  <div class="tz-selector">
    <label>Timezone:</label>
    <select bind:value={timezone}>
      {#each timezones as tz}
        <option value={tz}>{tz}</option>
      {/each}
    </select>
  </div>
  <NxCalendar {timezone} view="day" theme="ocean" />
</div>

<style>
  :global(.calendar-wrapper) {
    height: 600px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
  }
  .tz-selector {
    margin-bottom: 1rem;
  }
  select {
    margin-left: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }
</style>`,
  },
  responsive: {
    '/App.svelte': `<script>
  import NxCalendar from '@nexa-calendar/svelte'
  import '@nexa-calendar/ui/styles.css'

  let isMobile = window.innerWidth < 768

  function handleResize() {
    isMobile = window.innerWidth < 768
  }
<\/script>

<svelte:window on:resize={handleResize} />

<div class="calendar-wrapper">
  <NxCalendar view={isMobile ? 'day' : 'month'} theme="ocean" responsive />
</div>

<style>
  :global(.calendar-wrapper) {
    height: 600px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    :global(.calendar-wrapper) {
      height: 400px;
    }
  }
</style>`,
  },
  advanced: {
    '/App.svelte': `<script>
  import NxCalendar from '@nexa-calendar/svelte'
  import '@nexa-calendar/ui/styles.css'

  let events = [
    { id: '1', title: 'Custom Event', start: new Date().toISOString(), duration: 60 }
  ]
<\/script>

<div class="calendar-wrapper">
  <NxCalendar {events} view="week" theme="ocean">
    <svelte:fragment slot="event" let:event>
      <div class="custom-event">
        <strong>{event.title}</strong>
        <p>Custom rendering</p>
      </div>
    </svelte:fragment>
  </NxCalendar>
</div>

<style>
  :global(.calendar-wrapper) {
    height: 600px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
  }
  .custom-event {
    padding: 0.5rem;
  }
</style>`,
  },
};

const currentFiles = computed(() => {
  const fw = selectedFramework.value;
  const ex = selectedExample.value;

  if (fw === 'vue') return vueExamples[ex] || vueExamples.basic;
  if (fw === 'react') return reactExamples[ex] || reactExamples.basic;
  return svelteExamples[ex] || svelteExamples.basic;
});
</script>

<style scoped>
.demos2-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1a1f3a 100%);
  padding: 20px 0;
}

.sandpack-wrapper {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 8px 10px -6px rgba(0, 0, 0, 0.2);
  height: 700px;
}

.sandpack-header {
  padding: 16px 24px;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.sandpack-container {
  width: 100%;
  min-height: 600px;
}

.sandpack-container :deep(.sp-wrapper) {
  width: 100% !important;
  height: 700px !important;
}

.sandpack-container :deep(.sp-layout) {
  width: 100% !important;
  height: 100% !important;
}
</style>
