import {
  MOCK_STYLES,
  buildFrameworkExamples,
  getEventArrayExpression,
  type DemoExampleKey,
  type DemoScenario,
  vanillaBase,
} from './shared';
import type { FrameworkExamples } from './types';

function buildVanillaHtml(exampleKey: DemoExampleKey, scenario: DemoScenario): string {
  const timezoneValue = scenario.timezone ? `'${scenario.timezone}'` : 'null';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nexa Calendar - Vanilla JS</title>
  <style>
    ${MOCK_STYLES}
    body { margin: 0; padding: 20px; background: #020617; }
  </style>
</head>
<body>
  <div id="calendar" class="nx-calendar">
    <h2 id="title"></h2>
    <div class="info" id="info"></div>
    <div class="header">
      <span id="month-label" style="font-size:13px;color:#64748b"></span>
      <span id="count" style="font-size:13px;color:#94a3b8"></span>
    </div>
    <div class="grid" id="grid"></div>
  </div>

  <script>
    const view = '${scenario.view}'
    const theme = '${scenario.theme}'
    const timezone = ${timezoneValue}
    const selectable = ${Boolean(scenario.selectable)}
    const info = '${scenario.info}'

    let events = ${getEventArrayExpression(exampleKey)}
    let nextId = events.length + 1

    const today = new Date()

    document.getElementById('title').textContent =
      'Nexa Calendar - ' + view + ' | theme:' + theme + (timezone ? ' | ' + timezone : '')
    document.getElementById('info').textContent = info
    document.getElementById('month-label').textContent =
      today.toLocaleString('default', { month: 'long', year: 'numeric' })

    function updateCount() {
      const count = events.length
      document.getElementById('count').textContent =
        count + ' event' + (count === 1 ? '' : 's')
    }

    function render() {
      const grid = document.getElementById('grid')
      grid.innerHTML = ''

      const days = Array.from({ length: 35 }, (_, index) =>
        new Date(today.getFullYear(), today.getMonth(), index - today.getDay() + 1)
      )

      days.forEach((day) => {
        const cell = document.createElement('div')
        const isToday = day.toDateString() === today.toDateString()
        cell.className = 'day' + (isToday ? ' today' : '')
        if (selectable) {
          cell.style.cursor = 'pointer'
          cell.title = 'Click to add event'
        }

        const num = document.createElement('div')
        num.className = 'num'
        num.textContent = String(day.getDate())
        cell.appendChild(num)

        events
          .filter((event) => new Date(event.start).toDateString() === day.toDateString())
          .forEach((event) => {
            const tag = document.createElement('div')
            tag.className = 'event'
            tag.textContent = event.title
            tag.onclick = (mouseEvent) => {
              mouseEvent.stopPropagation()
              alert('Clicked: ' + event.title)
            }
            cell.appendChild(tag)
          })

        if (selectable) {
          cell.onclick = () => {
            events = [
              ...events,
              {
                id: String(nextId++),
                title: 'Event #' + (nextId - 1),
                start: day.toISOString(),
                duration: 60,
              },
            ]
            updateCount()
            render()
          }
        }

        grid.appendChild(cell)
      })
    }

    updateCount()
    render()
  <\/script>
</body>
</html>`;
}

export const vanillaExamples: FrameworkExamples = buildFrameworkExamples((exampleKey, scenario) =>
  vanillaBase(buildVanillaHtml(exampleKey, scenario))
);
