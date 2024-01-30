<template>
  <div>
    <nav
      class="navbar secondNav navbar-expand-lg navbar-dark d-flex justify-content-between"
      :class="{
        'fixed-top': isNavBarFixed,
        'fixed-background': isNavBarFixed,
        'fixed-text-color': isNavBarFixed,
        'home-background': isHomePage,
        'home-text-color': isHomePage
      }"
      v-if="isAuthenticated"
    >
      <div class="ms-3">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                to="/Mysplits"
                class="nav-link h-color rounded icons action-buttons text-center"
                aria-current="page"
                aria-selected="false"
                active-class="nav-link.active text-white rounded shadow-lg fw-semibold"
                :style="isActiveLink('/Mysplits')"
              >
                My Splits
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/Addsplit"
                class="nav-link h-color rounded icons action-buttons text-center"
                aria-current="page"
                aria-selected="false"
                active-class="nav-link.active icons text-white rounded shadow-lg fw-semibold"
                exact-active-class="action-buttons"
              >
                Add Split
              </router-link>
            </li>
            <li>
              <router-link
                to="/Groups"
                class="nav-link h-color rounded icons action-buttons text-center"
                aria-controls="page"
                aria-selected="false"
                active-class="nav-link.active icons text-white rounded shadow-lg fw-semibold"
                exact-active-class="action-buttons"
              >
                Groups
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <router-link
       v-if="isGroupsRoute"
        to="/CreateGroup"
        class="action-buttons icons me-4"
        aria-selected="true"
        active-class="is-active icons text-white rounded shadow-lg fw-semibold"
        exact-active-class="action-buttons"
        data-toggle="tooltip"
        title="Add Group"
        data-placement="top"
      >
        <i class="bi bi-people">+</i>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router';
import router from '../router'
const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()


const route = useRoute();
const isGroupsRoute = ref(false);

watchEffect(() => {
  // Check if the current route is the Groups component route
  isGroupsRoute.value = route.name === 'Groups';
});


const isActiveLink = (to: string) => {
  return computed(() => router.currentRoute.value.path === to).value
}

const isNavBarFixed = ref(false)
const scrollThreshold = 100 // Adjust this value to set the scroll threshold

const isHomePage = computed(() => router.currentRoute.value.path === '/') // Check if on the home page

const handleScroll = () => {
  if (window.scrollY > scrollThreshold) {
    isNavBarFixed.value = true
  } else {
    isNavBarFixed.value = false
  }
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
</script>

<style scoped></style>
