<template>
  <nav class="navbar bg-nav navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand title h-color ms-1"
        ><i class="bi bi-cash-stack me-2 cash"></i>Bill Buddy</router-link
      >

      <button
        class="navbar-toggler bg-primary"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <button
        v-if="!isAuthenticated"
        class="btn btn-primary custom-button"
        data-toggle="tooltip"
        title="Log In"
        data-placement="top"
        @click="login"
      >
        <i class="bi bi-box-arrow-in-right h-color"></i> Log In
      </button>

      <div
        v-if="isAuthenticated"
        class="dropdown d-flex me-3"
        data-toggle="tooltip"
        title="More Details"
        data-placement="top"
      >
        <img
          :src="user?.picture"
          alt="profilePicture"
          style="height: 35px; width: 35px"
          class="img-fluid rounded-circle cursor-pointer"
          data-bs-toggle="dropdown"
          referrerPolicy="no-referrer"
          />
          <!-- this is for image session is expired   'referrerPolicy="no-referrer"' -->

        <ul class="dropdown-menu mr-16 dropdown-menu-end text-white bg-user">
          <li>
            <router-link to="/profilePage" class="dropdown-item text-dark">Profile</router-link>
          </li>
          <li>
            <button class="btn btn-transperent ms-1" @click="handleLogout">Sign Out</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { ref, onMounted, computed } from 'vue'
import router from '../router'
import axiosInstance from '../services/service'

const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()

const isActiveLink = (to: string) => {
  return computed(() => router.currentRoute.value.path === to).value
}

const Welcome = 'Welcome'
interface UserDetails {
  profilePicture: string | undefined
  email: string | undefined
}

const userDetails = ref<UserDetails>({
  profilePicture: user.value?.picture,
  email: user.value?.email
})

// }
const login = () => {
  loginWithRedirect()
  router.push('/Mysplits')
}
const fetchData = async () => {
  try {
    const response = await axiosInstance.get('/users/transactions')
    // expenses.value = response.data
    // console.log(response.data)
  } catch (error) {
    console.error('Error fetching transaction data:', error)
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    fetchData()
  }
})

const handleLogout = () => {
  logout({ logoutParams: { returnTo: window.location.origin } })
}
</script>

<style scoped lang="scss">
//  .navbar {
//   background: linear-gradient(90deg, #160024, rgb(78, 1, 114), #230033);
// }

.custom-button {
  background-color: transparent;
  color: rgb(253, 253, 253);
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s;
  font-weight: bolder;
}
.heading {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 24px;
}
.cash {
  height: 30 px;
  width: 30px;
}
</style>
