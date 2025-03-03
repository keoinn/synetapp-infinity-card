<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import devtools from 'devtools-detect';
// console.log('Is DevTools open:', devtools.isOpen); // TODO: Redirect to other page if devtools is open

</script>
