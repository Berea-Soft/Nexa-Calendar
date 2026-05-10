<template>
  <div class="framework-picker">
    <label>Framework</label>
    <div class="picker-options">
      <button
        v-for="fw in FRAMEWORKS"
        :key="fw.key"
        :class="['picker-btn', { active: modelValue === fw.key }]"
        @click="$emit('update:modelValue', fw.key)"
      >
        {{ fw.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FRAMEWORKS } from '../data';
import type { FrameworkKey } from '../data';

defineProps<{ modelValue: FrameworkKey }>();
defineEmits<{ 'update:modelValue': [value: FrameworkKey] }>();
</script>

<style scoped>
.framework-picker {
  margin-bottom: 16px;
}
.framework-picker label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.picker-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.picker-btn {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #334155;
  border-radius: 6px;
  background: #1e293b;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}
.picker-btn:hover {
  background: #334155;
  color: #e2e8f0;
}
.picker-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}
</style>
