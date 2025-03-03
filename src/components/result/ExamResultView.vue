<script setup>
import { ref } from 'vue'
</script>

<template>
  <!-- TODO: Start: 檢視報告 // fullscreen -->
  <v-dialog
    transition="dialog-bottom-transition"
    scrollable
    height="80%"
    class="report-dialog"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="flat"
        size="small"
        color="primary"
        rounded="xl"
        class="mb-1"
        text="檢視報告"
      />
    </template>

    <template #default="{ isActive }">
      <v-card>
        <!-- 工具箱 -->
        <v-toolbar>
          <v-btn
            icon="mdi-close"
            @click="isActive.value = false"
          />

          <v-toolbar-title>測驗結果</v-toolbar-title>

          <v-spacer />

          <v-toolbar-items>
            <v-btn
              text="下載報告"
              variant="text"
              @click="isActive.value = false"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text="關閉報告頁面"
            @click="isActive.value = false"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
.report-dialog {
  max-height: 100vh;
}
</style>
