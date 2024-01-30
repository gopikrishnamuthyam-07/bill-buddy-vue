<template>
  <div class="container mt-4">
    <h1 class="mb-4 text-center heading">Groups</h1>
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div v-if="groupDetails">
          <h3>Group Details</h3>
          <p><strong>Group Name:</strong> {{ groupDetails.groupName }}</p>
          <h4>Participants:</h4>
          <ul>
            <li v-for="(participant, index) in groupDetails.participantsInGroup" :key="index">
              {{ participant }}
            </li>
          </ul>
        </div>
        <div v-else class="text-center">
          <img
            src="../assets/NotfoundImages/images.png"
            alt="Not Found Image"
            class="not-found-image"
            referrerPolicy="no-referrer"
          />
          <p class="not-found-message text">Oops! We couldn't find any Groups</p>
          <div class="text-center">
            <p class=" paragraph text-center mt-5 heading">
              Back to Menu
              <router-link
                to="/"
                class="bi bi-arrow-up-left-square-fill ms-2 text-danger icon"
              ></router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axiosInstance from '../services/service'

const groupDetails = ref<any>(null)
const route = useRoute()

const fetchGroupDetails = async () => {
  try {
    const groupId = route.params.groupId // Assuming "groupId" is a route parameter
    if (groupId) {
      const response = await axiosInstance.get(`/myGroups/${groupId}`)
      groupDetails.value = response.data
    }
  } catch (error) {
    console.error('Error fetching group details:', error)
  }
}

onMounted(() => {
  fetchGroupDetails()
})
</script>
<style scoped>
.not-found-image {
  height: 200px;
  width: 200px;
  opacity: 1;
  animation: zoomInOut 5s infinite alternate;
}

@keyframes zoomInOut {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.5);
  }
}
.text{
  color: rgb(185, 185, 185);
}
.paragraph{
 text-decoration: underline;
 font-size:12px;
 font-weight: 600;
}
</style>
