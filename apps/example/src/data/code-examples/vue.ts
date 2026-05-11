import {
  buildFrameworkExamples,
  getEventArrayExpression,
  type DemoExampleKey,
  type DemoScenario,
  vueBase,
} from './shared';
import type { FrameworkExamples } from './types';

function buildVueApp(exampleKey: DemoExampleKey, scenario: DemoScenario): string {
  const timezoneValue = scenario.timezone ? `'${scenario.timezone}'` : 'null';

  return `<script setup lang="ts">
import { ref } from 'vue'
import NxCalendar from './mock-calendar.js'

const events = ref(${getEventArrayExpression(exampleKey)})
const view = '${scenario.view}'
const theme = '${scenario.theme}'
const timezone = ${timezoneValue}
const selectable = ${Boolean(scenario.selectable)}
const draggable = ${Boolean(scenario.draggable)}
const info = '${scenario.info}'
let nextId = events.value.length + 1

const onDateSelect = (date: Date | string) => {
  if (!selectable) return
  events.value.push({
    id: String(nextId++),
    title: 'Event #' + (nextId - 1),
    start: date instanceof Date ? date.toISOString() : date,
    duration: 60,
  })
}

const onEventClick = (event: { title: string }) => {
  alert('Clicked: ' + event.title)
}
<\/script>

<template>
  <div>
    <div class="info">{{ info }}</div>
    <NxCalendar
      :events="events"
      :view="view"
      :theme="theme"
      :timezone="timezone || undefined"
      :selectable="selectable"
      :draggable="draggable"
      @dateSelect="onDateSelect"
      @eventClick="onEventClick"
    />
  </div>
</template>`;
}

export const vueExamples: FrameworkExamples = buildFrameworkExamples((exampleKey, scenario) =>
  vueBase(buildVueApp(exampleKey, scenario))
);
