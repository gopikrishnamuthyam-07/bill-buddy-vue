<template>
  <div class="main-container bg-nav col-12">
    <h1 class="mb-4 text-center mt-5">Profile</h1>
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="profile-card text-center bg-date">
          <div class="profile-image">
            <img
              :src="user?.picture"
              :alt="'Profile Picture'"
              class="img-fluid rounded-circle profile-picture"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 class="card-title text-dark">{{ user?.name }}</h1>
          <h5 class="card-text text-dark mt-2">{{ user?.email }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { user, isAuthenticated } = useAuth0()
</script>

<style scoped>
.profile-card {
  max-width: 100%;
  padding: 20px;
  border: none;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  color: #fff;
  transition: transform 0.2s;
  animation: fade-in 1s ease;
}

.main-container {
  min-height: 94vh;
  padding: 20px;
}
.profile-card:hover {
  transform: scale(1.02);
  animation: bounce 0.5s ease infinite;
}

.profile-image {
  padding: 10px;
  margin: 0 auto 20px;
  display: inline-block;
}

.profile-picture {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);

}
</style>
