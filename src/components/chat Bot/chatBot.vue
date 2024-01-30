<!-- <template>
  <div>
    <div v-for="message in messages" :key="message.id" class="message" :class="{ 'user-message': message.type === 'user', 'bot-message': message.type === 'bot' }">
      {{ message.text }}
    </div>
    <div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface UserDetails {
 const messages : string;
}

const messages = ref([]);
const newMessage = ref('');

const sendMessage = () => {
  if (newMessage.trim() === '') return;

  // Add the user's message to the chat
  const userMessage = { text: newMessage, id: messages.length, type: 'user' };
  messages.push(userMessage);
  newMessage.value = '';

  // Simulate the bot's response (replace this with actual logic)
  const botResponse = getBotResponse(userMessage.text);

  // Add the bot's response to the chat
  messages.push({ text: botResponse, id: messages.length, type: 'bot' });
};

const getBotResponse = (userMessage) => {
  // Replace this with actual bot logic or API call
  return `Bot: I received your message: "${userMessage}"`;
};
</script>

<style scoped>
.message {
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
}

.user-message {
  background-color: #3498db;
  color: #fff;
  align-self: flex-end;
}

.bot-message {
  background-color: #e0e0e0;
}
</style> -->
<template>
  <div>

  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>