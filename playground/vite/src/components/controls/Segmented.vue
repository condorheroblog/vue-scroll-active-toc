<script setup lang="ts" generic="T extends string">
defineProps<{
	modelValue: T
	options: { value: T; label: string }[]
	ariaLabel?: string
}>();

const emit = defineEmits<{
	"update:modelValue": [value: T]
}>();
</script>

<template>
  <div
    class="grid gap-1 rounded-lg bg-slate-100 p-1 dark:bg-white/5"
    :style="{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }"
    role="group"
    :aria-label="ariaLabel"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="rounded-md px-2 py-1.5 text-xs font-semibold transition"
      :class="
        modelValue === option.value
          ? 'bg-white text-brand-700 shadow-sm dark:bg-white/10 dark:text-brand-300'
          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
      "
      :aria-pressed="modelValue === option.value"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
