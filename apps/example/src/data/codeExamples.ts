export const codeExamples = {
  vue: {
    basic: `<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
    {"imports": {"vue": "https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js", "@nexa-calendar/ui": "https://cdn.jsdelivr.net/npm/@nexa-calendar/ui/dist/index.js"}}
  </script>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { createApp, ref } from 'vue'
    import NxCalendar from '@nexa-calendar/ui'
    import '@nexa-calendar/ui/dist/styles.css'
    const events = ref([{id:'1',title:'Team Meeting',start:new Date().toISOString(),duration:60}])
    createApp({components:{NxCalendar},setup(){return{events}},template:'<nx-calendar :events="events" view="month" theme="ocean"/>'}).mount('#app')
  </script>
</body>
</html>`,
    interactive: `<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
    {"imports": {"vue": "https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js", "@nexa-calendar/ui": "https://cdn.jsdelivr.net/npm/@nexa-calendar/ui/dist/index.js"}}
  </script>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { createApp, ref } from 'vue'
    import NxCalendar from '@nexa-calendar/ui'
    import '@nexa-calendar/ui/dist/styles.css'
    const events = ref([{id:'1',title:'Event',start:new Date().toISOString(),duration:60}])
    createApp({components:{NxCalendar},methods:{addEvent(d){events.value.push({id:Date.now(),title:'New',start:d,duration:60})}},setup(){return{events,addEvent:()=>{}},template:'<nx-calendar :events="events" view="week" @date-select="addEvent"/>'}).mount('#app')
  </script>
</body>
</html>`,
    themes: `<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
    {"imports": {"vue": "https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js", "@nexa-calendar/ui": "https://cdn.jsdelivr.net/npm/@nexa-calendar/ui/dist/index.js"}}
  </script>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { createApp, ref } from 'vue'
    import NxCalendar from '@nexa-calendar/ui'
    import '@nexa-calendar/ui/dist/styles.css'
    const theme = ref('ocean')
    const events = ref([{id:'1',title:'Event',start:new Date().toISOString(),duration:60}])
    createApp({components:{NxCalendar},setup(){return{theme,events}},template:'<nx-calendar :events="events" :theme="theme" view="month"/>').mount('#app')
  </script>
</body>
</html>`,
  },
  react: {
    basic: `import { useState } from 'react'
import NxCalendar from '@nexa-calendar/react'
import '@nexa-calendar/ui/dist/styles.css'

export default function App() {
  const [events] = useState([
    { id: '1', title: 'Team Meeting', start: new Date().toISOString(), duration: 60 }
  ])
  return <NxCalendar events={events} view="month" theme="ocean" />
}`,
    interactive: `import { useState } from 'react'
import NxCalendar from '@nexa-calendar/react'
import '@nexa-calendar/ui/dist/styles.css'

export default function App() {
  const [events, setEvents] = useState([
    { id: '1', title: 'Event', start: new Date().toISOString(), duration: 60 }
  ])
  return <NxCalendar events={events} view="week" theme="rose" />
}`,
    hooks: `import { useState, useCallback } from 'react'
import NxCalendar from '@nexa-calendar/react'
import '@nexa-calendar/ui/dist/styles.css'

export default function App() {
  const [events, setEvents] = useState([])
  const addEvent = useCallback((event) => {
    setEvents(prev => [...prev, event])
  }, [])
  return <NxCalendar events={events} view="month" theme="ocean" />
}`,
  },
  svelte: {
    basic: `<script>
  import NxCalendar from '@nexa-calendar/svelte'
  import '@nexa-calendar/ui/dist/styles.css'
  let events = [{id:'1',title:'Event',start:new Date().toISOString(),duration:60}]
</script>

<nx-calendar {events} view="month" theme="ocean" />`,
    interactive: `<script>
  import NxCalendar from '@nexa-calendar/svelte'
  import '@nexa-calendar/ui/dist/styles.css'
  let events = [{id:'1',title:'Event',start:new Date().toISOString(),duration:60}]
</script>

<nx-calendar {events} view="week" theme="rose" />`,
  },
  angular: {
    basic: `import { Component } from '@angular/core'
import { NxCalendar } from '@nexa-calendar/angular'
import '@nexa-calendar/ui/dist/styles.css'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NxCalendar],
  template: '<nx-calendar [events]="events" view="month" theme="ocean" />'
})
export class AppComponent {
  events = [{id:'1',title:'Event',start:new Date().toISOString(),duration:60}]
}`,
    interactive: `import { Component } from '@angular/core'
import { NxCalendar } from '@nexa-calendar/angular'
import '@nexa-calendar/ui/dist/styles.css'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NxCalendar],
  template: '<nx-calendar [events]="events" view="week" theme="rose" />'
})
export class AppComponent {
  events = [{id:'1',title:'Event',start:new Date().toISOString(),duration:60}]
}`,
  },
  vanilla: {
    basic: `<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
    {"imports": {"@nexa-calendar/ui": "https://cdn.jsdelivr.net/npm/@nexa-calendar/ui/dist/index.js"}}
  </script>
</head>
<body>
  <nx-calendar id="calendar" view="month" theme="ocean"></nx-calendar>
  <script type="module">
    import '@nexa-calendar/ui/dist/styles.css'
    const calendar = document.getElementById('calendar')
    calendar.events = [{id:'1',title:'Team Meeting',start:new Date().toISOString(),duration:60}]
  </script>
</body>
</html>`,
    interactive: `<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
    {"imports": {"@nexa-calendar/ui": "https://cdn.jsdelivr.net/npm/@nexa-calendar/ui/dist/index.js"}}
  </script>
</head>
<body>
  <nx-calendar id="calendar" view="week" theme="rose"></nx-calendar>
  <script type="module">
    import '@nexa-calendar/ui/dist/styles.css'
    const calendar = document.getElementById('calendar')
    calendar.events = [{id:'1',title:'Event',start:new Date().toISOString(),duration:60}]
    calendar.addEventListener('date-select', (e) => console.log('Date:', e.detail))
  </script>
</body>
</html>`,
  },
};

export const examplesByFramework = {
  vue: [
    { key: 'basic', title: 'Basic Calendar', description: 'Simple month view with events', emoji: '📅' },
    { key: 'interactive', title: 'Interactive', description: 'Click to create events', emoji: '✋' },
    { key: 'themes', title: 'Themes', description: 'Switch between themes', emoji: '🎨' },
  ],
  react: [
    { key: 'basic', title: 'Basic Calendar', description: 'Simple month view with events', emoji: '📅' },
    { key: 'interactive', title: 'Interactive', description: 'Click to create events', emoji: '✋' },
    { key: 'hooks', title: 'Custom Hooks', description: 'Event management hooks', emoji: '🎣' },
  ],
  svelte: [
    { key: 'basic', title: 'Basic Calendar', description: 'Simple month view with events', emoji: '📅' },
    { key: 'interactive', title: 'Interactive', description: 'Reactive event handling', emoji: '✋' },
  ],
  angular: [
    { key: 'basic', title: 'Basic Calendar', description: 'Simple month view with events', emoji: '📅' },
    { key: 'interactive', title: 'Interactive', description: 'Click to create events', emoji: '✋' },
  ],
  vanilla: [
    { key: 'basic', title: 'Basic Calendar', description: 'Simple month view with events', emoji: '📅' },
    { key: 'interactive', title: 'Interactive', description: 'Click to create events', emoji: '✋' },
  ],
};

export const frameworks = [
  { key: 'vue', label: 'Vue 3', emoji: '💚' },
  { key: 'react', label: 'React', emoji: '⚛️' },
  { key: 'svelte', label: 'Svelte', emoji: '🔥' },
  { key: 'angular', label: 'Angular', emoji: '🅰️' },
  { key: 'vanilla', label: 'Vanilla JS', emoji: '📜' },
];

export const templateMap = {
  vue: 'vue-cli',
  react: 'create-react-app',
  svelte: 'svelte',
  angular: 'angular-cli',
  vanilla: 'vanilla',
};