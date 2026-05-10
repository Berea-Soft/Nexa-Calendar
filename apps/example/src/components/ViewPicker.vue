<template>
  <div class="view-grid">
    <button
      v-for="v in VIEWS"
      :key="v.key"
      class="view-btn"
      :class="{ active: modelValue === v.key }"
      @click="$emit('update:modelValue', v.key)"
    >
      {{ v.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { VIEWS } from '../data'
import type { ViewType } from '../data'

defineProps<{ modelValue: ViewType }>()
defineEmits<{ (e: 'update:modelValue', v: ViewType): void }>()
</script>

<style scoped>
.view-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.view-btn {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #334155;
  background: #1e293b;
  color: #94a3b8;
  transition: all 0.15s;
}
.view-btn:hover { background: #334155; color: #f1f5f9; }
.view-btn.active { background: #475569; border-color: #64748b; color: #f1f5f9; }
</style>
