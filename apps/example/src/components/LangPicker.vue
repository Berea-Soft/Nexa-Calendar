<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <button
      type="button"
      class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:bg-slate-800/50 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      @click="isOpen = !isOpen"
    >
      <span class="text-base">{{ currentLang?.flag }}</span>
      <span class="hidden sm:inline">{{ currentLang?.label }}</span>
      <span class="sm:hidden">{{ currentLang?.code.toUpperCase() }}</span>
      <IconChevronDown class-name="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-50 w-40 mt-2 overflow-hidden origin-top-right border shadow-xl rounded-xl bg-slate-900 border-slate-700/50 ring-1 ring-black ring-opacity-5 focus:outline-none backdrop-blur-xl bg-opacity-90"
      >
        <div class="py-1">
          <button
            v-for="lang in langs"
            :key="lang.code"
            class="flex items-center w-full px-4 py-2 text-sm transition-colors"
            :class="[
              modelValue === lang.code
                ? 'bg-indigo-500/10 text-indigo-400 font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            ]"
            @click="selectLang(lang.code)"
          >
            <span class="mr-3 text-base">{{ lang.flag }}</span>
            <span>{{ lang.label }}</span>
            <span v-if="modelValue === lang.code" class="ml-auto text-indigo-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { IconChevronDown } from './common/icons'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const langs = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' }
]

const currentLang = computed(() => langs.find(l => l.code === props.modelValue))

const selectLang = (code: string) => {
  emit('update:modelValue', code)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
