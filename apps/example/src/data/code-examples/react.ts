import {
  buildFrameworkExamples,
  getEventArrayExpression,
  reactBase,
  type DemoExampleKey,
  type DemoScenario,
} from './shared';
import type { FrameworkExamples } from './types';

function buildReactApp(exampleKey: DemoExampleKey, scenario: DemoScenario): string {
  const timezoneValue = scenario.timezone ? `'${scenario.timezone}'` : 'undefined';

  return `import { useRef, useState } from 'react'
import './style.css'
import NxCalendar from './NxCalendar'

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  duration?: number;
  [key: string]: unknown;
}

const view = '${scenario.view}'
const theme = '${scenario.theme}'
const timezone = ${timezoneValue}
const selectable = ${Boolean(scenario.selectable)}
const info = '${scenario.info}'

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => ${getEventArrayExpression(exampleKey)})
  const nextId = useRef(events.length + 1)

  const handleDateSelect = (date: Date | string) => {
    if (!selectable) return
    setEvents(prev => [
      ...prev,
      {
        id: String(nextId.current++),
        title: 'Event #' + (nextId.current - 1),
        start: date instanceof Date ? date.toISOString() : date,
        duration: 60,
      },
    ])
  }

  const handleEventClick = (event: { title: string }) => {
    alert('Clicked: ' + event.title)
  }

  return (
    <div>
      <div className="info">{info}</div>
      <NxCalendar
        events={events}
        view={view}
        theme={theme}
        timezone={timezone}
        selectable={selectable}
        onDateSelect={handleDateSelect}
        onEventClick={handleEventClick}
      />
    </div>
  )
}`;
}

export const reactExamples: FrameworkExamples = buildFrameworkExamples((exampleKey, scenario) =>
  reactBase(buildReactApp(exampleKey, scenario))
);
