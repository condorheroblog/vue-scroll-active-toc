<script setup lang="ts">
defineProps<{
	modelValue: boolean
	label: string
	hint?: string
}>();

const emit = defineEmits<{
	"update:modelValue": [value: boolean]
}>();
</script>

<template>
  <label class="flex cursor-pointer items-start justify-between gap-4">
    <span>
      <span class="block text-sm font-medium text-slate-700 dark:text-slate-200">{{ label }}</span>
      <span v-if="hint" class="mt-0.5 block text-xs leading-relaxed text-slate-400 dark:text-slate-500">
        {{ hint }}
      </span>
    </span>
    <input
      :checked="modelValue"
      type="checkbox"
      class="peer sr-only"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span
      class="relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-slate-300 transition peer-checked:bg-brand-500 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 dark:bg-white/15 dark:peer-focus-visible:ring-offset-[#0a0f1c]"
    >
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition ltr:translate-x-0.5 peer-checked:ltr:translate-x-[18px]"
      />
    </span>
  </label>
</template>
