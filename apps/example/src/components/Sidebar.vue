<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-title">Nexa-Calendar</div>
      <div class="logo-sub">Lit 3 · TimeGuard · SOLID</div>
    </div>

    <div class="sidebar-body">

      <!-- Framework -->
      <FrameworkPicker :model-value="framework" @update:model-value="$emit('update:framework', $event)" />

      <!-- Theme -->
      <ThemePicker :model-value="theme" @update:model-value="$emit('update:theme', $event)" />

      <!-- Language -->
      <LangPicker :model-value="lang" @update:model-value="$emit('update:lang', $event)" />

      <!-- Examples (each collapsible) -->
      <div class="examples-list">
          <div
            v-for="ex in EXAMPLES"
            :key="ex.key"
            class="example-item"
          >
            <!-- Example header (clickable) -->
            <div
              class="example-header"
              :class="{ active: example === ex.key }"
              @click="toggleExample(ex.key)"
            >
              <span class="example-icon">{{ ex.icon }}</span>
              <div class="example-info">
                <div class="example-title">{{ t(`demo.examples.${ex.key}.title`) }}</div>
                <div class="example-desc">{{ t(`demo.examples.${ex.key}.desc`) }}</div>
              </div>
              <span class="example-chevron">{{ expandedExample === ex.key ? '▼' : '▶' }}</span>
            </div>

            <!-- Example settings (collapsible) -->
            <div v-if="expandedExample === ex.key" class="example-settings">
              <!-- Views for this example -->
              <div class="settings-group">
                <label class="settings-label">{{ t('demo.sidebar.view') }}</label>
                <div class="view-options">
                  <button
                    v-for="v in EXAMPLE_VIEWS[ex.key]"
                    :key="v"
                    :class="['view-btn', { active: view === v && example === ex.key }]"
                    @click="selectView(ex.key, v)"
                  >
                    {{ getViewLabel(v) }}
                  </button>
                </div>
              </div>

              <!-- Example-specific options -->
              <template v-if="ex.key === 'timezones'">
                <div class="settings-group">
                  <label class="settings-label">{{ t('demo.sidebar.timezone') }}</label>
                  <select
                    class="settings-select"
                    :value="timezone"
                    @change="$emit('update:timezone', ($event.target as HTMLSelectElement).value)"
                  >
                    <option v-for="tz in TIMEZONES" :key="tz.code" :value="tz.code">
                      {{ tz.label }} ({{ tz.offset }})
                    </option>
                  </select>
                </div>
              </template>

              <template v-else-if="ex.key === 'locales'">
                <div class="settings-group">
                  <label class="settings-label">{{ t('demo.sidebar.language') }}</label>
                  <select
                    class="settings-select"
                    :value="lang"
                    @change="emit('update:lang', ($event.target as HTMLSelectElement).value)"
                  >
                    <option v-for="lg in LANGS" :key="lg.code" :value="lg.code">
                      {{ lg.flag }} {{ lg.label }}
                    </option>
                  </select>
                </div>
              </template>

              <template v-else-if="ex.key === 'theming'">
                <div class="settings-group">
                  <label class="settings-label">{{ t('demo.sidebar.theme') }}</label>
                  <div class="theme-options">
                    <button
                      v-for="t in THEMES"
                      :key="t.key"
                      :class="['theme-btn', { active: theme === t.key }]"
                      :style="{ backgroundColor: t.color }"
                      @click="$emit('update:theme', t.key)"
                      :title="t.label"
                    >
                      <span v-if="theme === t.key" class="theme-check">✓</span>
                    </button>
                  </div>
                </div>
              </template>

              <template v-else-if="ex.key === 'eventlimit'">
                <div class="settings-group">
                  <label class="settings-label">{{ t('demo.sidebar.maxEvents') }}: {{ eventLimit }}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    :value="eventLimit"
                    @input="$emit('update:eventLimit', parseInt(($event.target as HTMLInputElement).value))"
                    class="settings-range"
                  />
                </div>
              </template>

              <template v-else-if="ex.key === 'business'">
                <div class="settings-group">
                  <label class="settings-label">{{ t('demo.sidebar.businessHours') }}</label>
                  <div class="biz-hours">
                    <div class="biz-row">
                      <span>{{ t('demo.sidebar.start') }}:</span>
                      <select
                        :value="bizStart"
                        @change="$emit('update:bizStart', ($event.target as HTMLSelectElement).value)"
                      >
                        <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                      </select>
                    </div>
                    <div class="biz-row">
                      <span>{{ t('demo.sidebar.end') }}:</span>
                      <select
                        :value="bizEnd"
                        @change="$emit('update:bizEnd', ($event.target as HTMLSelectElement).value)"
                      >
                        <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="ex.key === 'full'">
                <div class="settings-group">
                  <label class="settings-label">{{ t('demo.sidebar.options') }}</label>
                  <div class="checkbox-group">
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        :checked="showBizHours"
                        @change="$emit('update:showBizHours', ($event.target as HTMLInputElement).checked)"
                      />
                      {{ t('demo.sidebar.businessHours') }}
                    </label>
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        :checked="showWeekends"
                        @change="$emit('update:showWeekends', ($event.target as HTMLInputElement).checked)"
                      />
                      {{ t('demo.sidebar.showWeekends') }}
                    </label>
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        :checked="editable"
                        @change="$emit('update:editable', ($event.target as HTMLInputElement).checked)"
                      />
                      {{ t('demo.sidebar.editable') }}
                    </label>
                  </div>
                </div>

                <template v-if="showBizHours">
                  <div class="settings-group">
                    <label class="settings-label">{{ t('demo.sidebar.bizConfig') }}</label>
                    <select
                      class="settings-select"
                      :value="bizConfig"
                      @change="$emit('update:bizConfig', ($event.target as HTMLSelectElement).value)"
                    >
                      <option v-for="(label, key) in BIZ_CONFIG_LABELS" :key="key" :value="key">
                        {{ t(`demo.biz_configs.${key}`) }}
                      </option>
                    </select>
                  </div>
                </template>

                <template v-if="showBizHours && bizConfig === 'custom'">
                  <div class="settings-group">
                    <label class="settings-label">{{ t('demo.sidebar.selectDays') }}</label>
                    <div class="days-check">
                      <label v-for="day in DAYS_OF_WEEK" :key="day.value" class="day-check">
                        <input
                          type="checkbox"
                          :checked="bizDays.includes(day.value)"
                          @change="toggleDay(day.value)"
                        />
                        {{ day.label }}
                      </label>
                    </div>
                  </div>
                  <div class="settings-group">
                    <label class="settings-label">{{ t('demo.sidebar.customHours') }}</label>
                    <div class="time-range">
                      <select
                        :value="bizStart"
                        @change="$emit('update:bizStart', ($event.target as HTMLSelectElement).value)"
                      >
                        <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                      </select>
                      <span>{{ t('demo.sidebar.to') }}</span>
                      <select
                        :value="bizEnd"
                        @change="$emit('update:bizEnd', ($event.target as HTMLSelectElement).value)"
                      >
                        <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                      </select>
                    </div>
                  </div>
                </template>

                <div class="settings-group">
                  <label class="settings-label">Time Range</label>
                  <div class="time-range">
                    <select :value="minTime" @change="$emit('update:minTime', ($event.target as HTMLSelectElement).value)">
                      <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                    </select>
                    <span>{{ t('demo.sidebar.to') }}</span>
                    <select :value="maxTime" @change="$emit('update:maxTime', ($event.target as HTMLSelectElement).value)">
                      <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                    </select>
                  </div>
                </div>

                <div class="settings-group">
                  <label class="settings-label">{{ t('demo.sidebar.slotDuration') }}: {{ slotDuration }} min</label>
                  <div class="slot-options">
                    <button
                      v-for="sd in SLOT_DURATIONS"
                      :key="sd.value"
                      :class="['slot-btn', { active: slotDuration === sd.value }]"
                      @click="$emit('update:slotDuration', sd.value)"
                    >
                      {{ sd.label }}
                    </button>
                  </div>
                </div>

                <div class="settings-group">
                  <label class="settings-label">{{ t('demo.sidebar.hourHeight') }}</label>
                  <select
                    class="settings-select"
                    :value="hourHeight"
                    @change="$emit('update:hourHeight', parseInt(($event.target as HTMLSelectElement).value))"
                  >
                    <option v-for="hh in HOUR_HEIGHTS" :key="hh.value" :value="hh.value">
                      {{ hh.label }}
                    </option>
                  </select>
                </div>

                <div class="settings-group">
                  <label class="settings-label">{{ t('demo.sidebar.timeFormat') }}</label>
                  <select
                    class="settings-select"
                    :value="slotLabelFormat"
                    @change="$emit('update:slotLabelFormat', ($event.target as HTMLSelectElement).value)"
                  >
                    <option v-for="fmt in TIME_FORMATS" :key="fmt.value" :value="fmt.value">
                      {{ fmt.label }}
                    </option>
                  </select>
                </div>
              </template>
            </div>
          </div>
        </div>

      <!-- Add event -->
      <button class="add-btn" @click="$emit('addEvent')">+ {{ t('demo.sidebar.addEvent') }}</button>

    </div>

    <div class="sidebar-footer">
      Powered by TimeGuard · Lit 3 · TypeScript
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { EXAMPLES, EXAMPLE_VIEWS, TIMEZONES, LANGS, THEMES, VIEWS, SLOT_DURATIONS, HOUR_HEIGHTS, TIME_FORMATS, DAYS_OF_WEEK } from '../data'
import type { NxTheme, ViewType, ExampleKey, FrameworkKey } from '../data'
import FrameworkPicker from './FrameworkPicker.vue'
import ThemePicker from './ThemePicker.vue'
import LangPicker from './LangPicker.vue'

const { t } = useI18n()

const props = defineProps<{
  theme: NxTheme
  lang: string
  view: ViewType
  example: ExampleKey
  framework: FrameworkKey
  timezone: string
  eventLimit: number
  bizStart: string
  bizEnd: string
  bizDays: number[]
  bizConfig: string
  showBizHours: boolean
  showWeekends: boolean
  editable: boolean
  slotDuration: number
  hourHeight: number
  slotLabelFormat: string
  minTime: string
  maxTime: string
}>()

const emit = defineEmits<{
  'update:theme': [v: NxTheme]
  'update:lang': [v: string]
  'update:view': [v: ViewType]
  'update:example': [v: ExampleKey]
  'update:framework': [v: FrameworkKey]
  'update:timezone': [v: string]
  'update:eventLimit': [v: number]
  'update:bizStart': [v: string]
  'update:bizEnd': [v: string]
  'update:bizDays': [v: number[]]
  'update:bizConfig': [v: string]
  'update:showBizHours': [v: boolean]
  'update:showWeekends': [v: boolean]
  'update:editable': [v: boolean]
  'update:slotDuration': [v: number]
  'update:hourHeight': [v: number]
  'update:slotLabelFormat': [v: string]
  'update:minTime': [v: string]
  'update:maxTime': [v: string]
  'addEvent': []
}>()

const expandedExample = ref<ExampleKey | null>(props.example)

const BIZ_CONFIG_LABELS = {
  default: '',
  extended: '',
  morning: '',
  afternoon: '',
  nightShift: '',
  split: '',
  weekend: '',
  custom: ''
}

function toggleExample(key: ExampleKey) {
  if (props.example !== key) {
    emit('update:example', key)
    emit('update:view', EXAMPLE_VIEWS[key][0] as ViewType)
    expandedExample.value = key
    return
  }

  expandedExample.value = expandedExample.value === key ? null : key
}

function selectView(key: ExampleKey, nextView: string) {
  emit('update:example', key)
  emit('update:view', nextView as ViewType)
  expandedExample.value = key
}

const hours = computed(() => {
  const arr = []
  for (let h = 0; h < 24; h++) {
    arr.push(`${h.toString().padStart(2, '0')}:00`)
  }
  return arr
})

function toggleDay(day: number) {
  const current = [...props.bizDays]
  const idx = current.indexOf(day)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(day)
    current.sort()
  }
  emit('update:bizDays', current)
}

function getViewLabel(v: string): string {
  const view = VIEWS.find(x => x.key === v)
  return view?.label || v
}

watch(() => props.example, (nextExample) => {
  expandedExample.value = nextExample
}, { immediate: true })
</script>

<style scoped>
.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: #0f172a;
  border-right: 1px solid #1e293b;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sidebar-logo {
  padding: 20px 16px 12px;
  border-bottom: 1px solid #1e293b;
}

.logo-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -0.02em;
}

.logo-sub {
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 2px;
}

.sidebar-body {
  padding: 16px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.sidebar-section {
  margin-bottom: 20px;
}

.section-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 8px;
  padding: 0 4px;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.example-item {
  border: 1px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.15s;
}

.example-item:hover {
  border-color: #334155;
}

.example-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  background: #1e293b;
  transition: background 0.15s;
}

.example-header:hover {
  background: #334155;
}

.example-header.active {
  background: #1e3a5f;
  border-color: #3b82f6;
}

.example-icon {
  font-size: 1.1rem;
}

.example-info {
  flex: 1;
  min-width: 0;
}

.example-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #f1f5f9;
}

.example-desc {
  font-size: 0.65rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.example-chevron {
  font-size: 0.65rem;
  color: #64748b;
}

.example-settings {
  padding: 12px;
  background: #0f172a;
  border-top: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-range span {
  font-size: 0.7rem;
  color: #64748b;
}

.time-range select {
  padding: 4px 8px;
  font-size: 0.7rem;
  border: 1px solid #475569;
  border-radius: 4px;
  background: #1e293b;
  color: #f1f5f9;
}

.slot-options {
  display: flex;
  gap: 4px;
}

.slot-btn {
  padding: 4px 8px;
  font-size: 0.65rem;
  font-weight: 500;
  border: 1px solid #475569;
  border-radius: 4px;
  background: #1e293b;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s;
}

.slot-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.slot-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.days-check {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.day-check {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: #94a3b8;
  cursor: pointer;
}

.day-check input {
  accent-color: #3b82f6;
  cursor: pointer;
}

.view-options {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.view-btn {
  padding: 4px 8px;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid #475569;
  border-radius: 4px;
  background: #1e293b;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s;
}

.view-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.view-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.settings-select {
  padding: 6px 10px;
  font-size: 0.75rem;
  border: 1px solid #475569;
  border-radius: 4px;
  background: #1e293b;
  color: #f1f5f9;
  cursor: pointer;
}

.theme-options {
  display: flex;
  gap: 6px;
}

.theme-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}

.theme-btn:hover {
  transform: scale(1.15);
}

.theme-btn.active {
  border-color: #3b82f6;
}

.theme-check {
  color: #fff;
  font-size: 0.7rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.settings-range {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #334155;
  cursor: pointer;
  -webkit-appearance: none;
}

.settings-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.biz-hours {
  display: flex;
  gap: 12px;
}

.biz-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.biz-row span {
  font-size: 0.7rem;
  color: #94a3b8;
}

.biz-row select {
  padding: 4px 8px;
  font-size: 0.7rem;
  border: 1px solid #475569;
  border-radius: 4px;
  background: #1e293b;
  color: #f1f5f9;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #94a3b8;
  cursor: pointer;
}

.checkbox-label input {
  accent-color: #3b82f6;
}

.add-btn {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  background: #16a34a;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.add-btn:hover { background: #15803d; }

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid #1e293b;
  font-size: 0.65rem;
  color: #334155;
  text-align: center;
}
</style>
