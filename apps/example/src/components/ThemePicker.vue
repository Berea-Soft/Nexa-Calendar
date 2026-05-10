<template>
  <div class="theme-picker">
    <div
      v-for="t in THEMES"
      :key="t.key"
      class="swatch"
      :class="{ active: modelValue === t.key }"
      :style="{
        background: t.color,
        boxShadow: t.border ? `0 0 0 1px ${t.border.split(' ')[2]}` : undefined,
      }"
      :title="t.label"
      @click="$emit('update:modelValue', t.key)"
    />
  </div>
  <p class="theme-label">Theme: {{ currentLabel }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { THEMES } from '../data';
import type { NxTheme } from '../data';

const props = defineProps<{ modelValue: NxTheme }>();
defineEmits<{ (e: 'update:modelValue', v: NxTheme): void }>();

const currentLabel = computed(() => THEMES.find(t => t.key === props.modelValue)?.label ?? '');
</script>

<style scoped>
.theme-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px;
}
.swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition:
    transform 0.15s,
    border-color 0.15s;
  flex-shrink: 0;
}
.swatch:hover {
  transform: scale(1.15);
}
.swatch.active {
  border-color: #fff;
  transform: scale(1.1);
}
.theme-label {
  font-size: 0.68rem;
  color: #475569;
  margin: 6px 0 0 4px;
}
</style>
