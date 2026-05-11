import {
  buildFrameworkExamples,
  getEventArrayExpression,
  svelteBase,
  type DemoExampleKey,
  type DemoScenario,
} from './shared';
import type { FrameworkExamples } from './types';

function buildSvelteApp(exampleKey: DemoExampleKey, scenario: DemoScenario): string {
  const timezoneValue = scenario.timezone ? `'${scenario.timezone}'` : 'null';

  return `<script>
  import MockCalendar from './MockCalendar.svelte'
  import './style.css'

  let events = ${getEventArrayExpression(exampleKey)}
  const view = '${scenario.view}'
  const theme = '${scenario.theme}'
  const timezone = ${timezoneValue}
  const selectable = ${Boolean(scenario.selectable)}
  const info = '${scenario.info}'
  let nextId = events.length + 1

  function handleDateSelect(event) {
    if (!selectable) return
    const date = event.detail
    events = [
      ...events,
      {
        id: String(nextId++),
        title: 'Event #' + (nextId - 1),
        start: date instanceof Date ? date.toISOString() : date,
        duration: 60,
      },
    ]
  }

  function handleEventClick(event) {
    alert('Clicked: ' + event.detail.title)
  }
<\/script>

<div>
  <div class="info">{info}</div>
  <MockCalendar
    {events}
    {view}
    {theme}
    {timezone}
    selectable={selectable}
    on:dateSelect={handleDateSelect}
    on:eventClick={handleEventClick}
  />
</div>`;
}

export const svelteExamples: FrameworkExamples = buildFrameworkExamples((exampleKey, scenario) =>
  svelteBase(buildSvelteApp(exampleKey, scenario))
);
