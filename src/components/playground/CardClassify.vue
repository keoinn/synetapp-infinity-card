<template>
  <div class="card-playground">
    <div class="drop-areas-container">
      <div
        v-for="(profession, index) in professions"
        :key="index"
        class="drop-area"
        @drop.prevent="handleDrop"
        @dragover.prevent
      >
        {{ profession }}
      </div>
    </div>
    <div class="card-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="card"
        :style="{ transitionDelay: `${index * 100}ms` }"
        draggable="true"
        @dragstart="handleDragStart(card)"
      >
        {{ card.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const professions = ref(['職業一', '職業二', '職業三']);
const cards = ref([
  { id: 1, content: '卡片 1' },
  { id: 2, content: '卡片 2' },
  { id: 3, content: '卡片 3' }
]);
const draggedCard = ref(null);

const router = useRouter();

const handleDragStart = (card) => {
  draggedCard.value = card;
};

const handleDrop = (event) => {
  event.preventDefault();
  if (draggedCard.value) {
    alert(`你已經成功拖曳 ${draggedCard.value.content}`);
    cards.value = cards.value.filter((c) => c.id !== draggedCard.value.id);
    draggedCard.value = null;
  }
};

const handleActive = (item) => {
  return router.currentRoute.value.path.replace('/', '') === item;
};

onMounted(() => {
  document.body.setAttribute('ondragstart', 'true');
});
</script>

<style lang="scss" scoped>
.card-playground {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: lightblue;
  position: relative;
  width: 100%;
  min-height: 600px;
}

.drop-areas-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: relative;
  top: 20px;
}

.drop-area {
  flex: 1;
  height: 100px;
  margin: 0 10px;
  padding: 20px;
  text-align: center;
  border: 2px dashed #ccc;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.card-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.card {
  margin: 10px;
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
