<template>
  <div class="main-container bg-nav">
    <div v-if="!isAuthenticated">
      <div class="text-container">
        <i class="bi bi-cash-coin cash-icon h-color icon-transition"></i>
        <h1 class="text-center hedding h-color">WELCOME TO BILL BUDDY</h1>
        <h5 class="text-center subtitle h-color">"I'm here to remind you to share"</h5>
      </div>
      <div class="text-center">
        <p class="paragraph text-center mt-5 h-color">
          For more details, please login
          <i class="bi icon bi-arrow-up-right-square-fill ms-2 icon-transition" @click="login"></i>
        </p>
      </div>
    </div>
    <div v-if="isAuthenticated">
      <div class="text-container">
        <i class="bi bi-cash-coin cash-icon h-color icon-transition"></i>
        <h1 class="text-center hedding h-color">WELCOME TO BILL BUDDY</h1>
        <h5 class="text-center subtitle h-color">"I'm here to remind you to share"</h5>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { reactive } from 'vue'
import router from '../router'

const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
const login = () => {
  loginWithRedirect()
  router.push("/Mysplits")
}
</script>

<style scoped>
.main-container {
  min-height: 94vh;
  padding: 20px;
}

.text-container {
  padding-top: 15%;
  text-align: center;
}

.hedding {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 48px;
}

.bi-cash-coin {
  font-size: 52px;
}

.paragraph {
  font-family: sans-serif;
  font-size: 16px;
  text-align: center;
  text-decoration-line: underline;
}

.subtitle {
  font-family: monospace;
  font-size: 24px;
}

.icon {
  font-size: 24px;
}

/* Add a transition on icon hover */
.icon-transition {
  transition: transform 0.3s ease;
}

.icon-transition:hover {
  transform: scale(1.1);
}

/* Media query for smaller screens (adjust as needed) */
@media (max-width: 768px) {
  .main-container {
    padding: 10px;
  }

  .hedding {
    font-size: 36px;
  }

  .paragraph {
    font-size: 14px;
  }

  .subtitle {
    font-size: 20px;
  }

  .icon {
    font-size: 20px;
  }
}
</style>
