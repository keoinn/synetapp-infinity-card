<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        icon
        size="32"
        variant="text"
        class="language-switcher"
      >
        <v-icon icon="mdi-translate" />
      </v-btn>
    </template>
    
    <v-list>
      <v-list-item
        v-for="(language, code) in availableLanguages"
        :key="code"
        :value="code"
        :active="currentLocale === code"
        @click="switchLanguage(code)"
      >
        <template #prepend>
          <v-icon
            :icon="getLanguageIcon(code)"
            size="20"
          />
        </template>
        <v-list-item-title>{{ language }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'

const { locale } = useI18n()
const appStore = useAppStore()

const availableLanguages = {
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  'en': 'English'
}

const currentLocale = computed(() => appStore.locale)

const getLanguageIcon = (code) => {
  const icons = {
    'zh-TW': 'mdi-flag',
    'zh-CN': 'mdi-flag',
    'en': 'mdi-flag'
  }
  return icons[code] || 'mdi-flag'
}

const switchLanguage = (newLocale) => {
  locale.value = newLocale
  appStore.setLocale(newLocale)
  // 保存到 localStorage
  localStorage.setItem('app-locale', newLocale)
}
</script>

<style scoped lang="scss">
.language-switcher {
  color: rgba(0, 0, 0, 0.87);
  opacity: 0.8;
}
</style>
