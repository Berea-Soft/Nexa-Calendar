<template>
  <div class="demo-page">
    <Sidebar
      v-model:theme="theme"
      v-model:lang="lang"
      v-model:view="view"
      v-model:example="example"
      v-model:framework="framework"
      v-model:timezone="timezone"
      v-model:eventLimit="eventLimit"
      v-model:bizStart="bizStart"
      v-model:bizEnd="bizEnd"
      v-model:bizDays="bizDays"
      v-model:bizConfig="bizConfig"
      v-model:showBizHours="showBizHours"
      v-model:showWeekends="showWeekends"
      v-model:editable="editable"
      v-model:slotDuration="slotDuration"
      v-model:hourHeight="hourHeight"
      v-model:slotLabelFormat="slotLabelFormat"
      v-model:minTime="minTime"
      v-model:maxTime="maxTime"
      @add-event="calDemo?.addRandomEvent()"
    />
    <main class="app-main">
      <CalendarDemo
        ref="calDemo"
        :theme="theme"
        :lang="lang"
        :view="view"
        :example="example"
        :framework="framework"
        :timezone="timezone"
        :event-limit="eventLimit"
        :biz-hours="bizHours"
        :show-biz-hours="showBizHours"
        :show-weekends="showWeekends"
        :editable="editable"
        :slot-duration="slotDuration"
        :hour-height="hourHeight"
        :slot-label-format="slotLabelFormat"
        :min-time="minTime"
        :max-time="maxTime"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import CalendarDemo from '../components/CalendarDemo.vue';
import { BIZ_HOURS_CONFIG } from '../data';
import type { NxTheme, ViewType, ExampleKey, FrameworkKey } from '../data';

const theme = ref<NxTheme>('light');
const lang = ref<string>('en');
const view = ref<ViewType>('month');
const example = ref<ExampleKey>('full');
const framework = ref<FrameworkKey>('webcomponents');
const timezone = ref<string>('America/New_York');
const eventLimit = ref<number>(3);
const bizStart = ref<string>('09:00');
const bizEnd = ref<string>('18:00');
const bizDays = ref<number[]>([1, 2, 3, 4, 5]);
const bizConfig = ref<string>('default');
const showBizHours = ref<boolean>(true);
const showWeekends = ref<boolean>(true);
const editable = ref<boolean>(true);
const slotDuration = ref<number>(60);
const hourHeight = ref<number>(48);
const slotLabelFormat = ref<string>('h:mm a');
const minTime = ref<string>('00:00');
const maxTime = ref<string>('24:00');

const calDemo = ref<InstanceType<typeof CalendarDemo>>();

const bizHours = computed(() => {
  if (example.value === 'full' && !showBizHours.value) return false;
  if (
    example.value === 'full' &&
    showBizHours.value &&
    bizConfig.value !== 'default' &&
    bizConfig.value !== 'custom'
  ) {
    const config = BIZ_HOURS_CONFIG[bizConfig.value as keyof typeof BIZ_HOURS_CONFIG];
    if (Array.isArray(config)) return config;
    return config;
  }
  if (example.value === 'full' && showBizHours.value && bizConfig.value === 'custom') {
    return { daysOfWeek: bizDays.value, startTime: bizStart.value, endTime: bizEnd.value };
  }
  return { daysOfWeek: [1, 2, 3, 4, 5], startTime: bizStart.value, endTime: bizEnd.value };
});
</script>

<style scoped>
.demo-page {
  display: flex;
  min-height: 100vh;
}
.app-main {
  flex: 1;
  padding: 24px;
  min-width: 0;
  overflow: auto;
}
</style>
