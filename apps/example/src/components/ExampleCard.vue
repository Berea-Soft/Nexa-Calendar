<template>
  <div class="ex-card" :class="{ active }" @click="$emit('select')">
    <div class="ex-header">
      <span class="ex-icon">{{ icon }}</span>
      <div class="ex-title">{{ title }}</div>
    </div>
    <div class="ex-desc">{{ desc }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  desc: string;
  icon: string;
  active: boolean;
}>();
defineEmits<{ (e: 'select'): void }>();
</script>

<style scoped>
.ex-card {
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
  background: #1e293b;
}
.ex-card:hover {
  background: #334155;
  border-color: #475569;
}
.ex-card.active {
  background: #1e3a5f;
  border-color: #3b82f6;
}
.ex-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ex-icon {
  font-size: 1rem;
}
.ex-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #f1f5f9;
}
.ex-desc {
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 4px;
  margin-left: 28px;
}
</style>
