<template>
  <div class="container mt-4">
    <h1 class="mb-4 text-center heading">Create Group</h1>
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="custom-card mb-4">
          <div class="custom-card-header d-flex bg-nav text-white justify-content-between">
            <h5 class="card-title">Group Details</h5>
            <button class="action-buttons ms-3 border-0" @click="toggleAddParticipant">
              <i class="bi bi-person-fill-add" title="Add Participant"></i>
            </button>
          </div>
          <div class="mb-3 m-3">
            <label for="groupName" class="form-label">Group Name</label>
            <input
              type="text"
              id="groupNameInput"
              class="form-control"
              v-model="state.groupName"
              :class="{
                'input-error': !isGroupNameValid && !state.groupName,
                'input-valid': isGroupNameValid && state.groupName
              }"
              placeholder="Enter group name"
              @blur="validateGroupName"
              @input="validateGroupName"
            />
            <!-- Display group name validation error -->
            <div v-if="!isGroupNameValid && !state.groupName" class="text-danger mt-2">
              Group name is required.
            </div>
            <div v-if="!isGroupNameValid && state.groupName" class="text-danger mt-2">
              Group name must be 20 characters or less.
            </div>
          </div>

          <!-- Add a search input field -->
          <!-- <label for="groupName" class="form-label ms-3">Participant </label> -->
          <div class="search-bar mb-4 ms-3 me-3" v-if="state.showAddParticipant">
            <input
              type="text"
              class="form-control search-input"
              v-model="state.searchQuery"
              placeholder="Add participants"
              @input="searchParticipants"
            />
            <i class="bi bi-people-fill search-icon ms-3"></i>
          </div>
          <ul class="suggested-emails" v-show="state.showSuggestions && state.searchQuery !== ''">
            <li
              v-for="(email, index) in state.suggestedEmails"
              :key="index"
              @click="selectSuggestedEmail(email)"
            >
              {{ email }}
            </li>
          </ul>

          <div
            v-show="!state.showSuggestions && state.searchQuery !== ''"
            class="not-found-container text-center"
          >
            <img
              src="../assets/NotfoundImages/images.png"
              alt="Not Found Image"
              class="not-found-image"
              referrerPolicy="no-referrer"
            />
            <p class="not-found-message">Oops! We couldn't find any results.</p>
          </div>
          <!-- Display added participants -->
          <!-- Display added participants -->
          <!-- Display added participants -->
          <div class="d-flex flex-wrap justify-content-center">
            <div
              v-for="(participant, index) in state.participantsInGroup"
              :key="index"
              class="m-2 mt-4 ms-3 participant-item"
            >
              <div class="d-flex align-items-center">
                <div class="participant-email-container d-flex">
                  <input
                    v-model="state.participantsInGroup[index]"
                    type="text"
                    id="participantEmailInput"
                    class="form-control mt-1 participant-email"
                    disabled
                  />
                </div>
                <i
                  class="bi bi-x ml-2 text-dark selected-participant"
                  @click="removeParticipant(index)"
                  title="Remove Participant"
                ></i>
              </div>
            </div>
          </div>

          <div class="custom-card-body">
            <div class="d-flex justify-content-center">
              <button class="button-save" @click="createGroup">Create Group</button>
              <router-link to="/Groups" class="button-cancle pt-1"> Back </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ... (script and style sections remain unchanged) -->

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from 'vue-toastification'
import axiosInstance from '../services/service'

interface State {
  groupName: string
  participantsInGroup: string[] // Change here, using the correct property name
  searchQuery: string
  showAddParticipant: boolean
  showSuggestions: boolean
  suggestedEmails: string[]
  error: string | null
}

const state = reactive<State>({
  groupName: '',
  participantsInGroup: [], // Change here, using the correct property name
  searchQuery: '',
  showAddParticipant: false,
  showSuggestions: false,
  suggestedEmails: [],
  error: null
})

// ... (existing code)

const isGroupNameValid = ref(true) // Assuming the group name is initially valid

const validateGroupName = () => {
  let trimmedGroupName = state.groupName.trim()

  // Truncate the input value if it exceeds the length limit
  if (trimmedGroupName.length > 20) {
    trimmedGroupName = trimmedGroupName.slice(0, 20)
    state.groupName = trimmedGroupName // Update the state with the truncated value
  }

  // Check if the group name is not empty
  isGroupNameValid.value = trimmedGroupName.length > 0
}
const toast = useToast()

const toggleAddParticipant = () => {
  state.showAddParticipant = !state.showAddParticipant
}

const searchParticipants = async () => {
  try {
    const response = await axiosInstance.get(
      `/findParticipantsByEmail?searchTerm=${state.searchQuery}`
    )
    const data = response.data
    state.suggestedEmails = data
    state.showSuggestions = data.length > 0
  } catch (error) {
    console.error('Error fetching participants:', error)
  }
}

const selectSuggestedEmail = (email: string) => {
  if (!state.participantsInGroup.includes(email)) {
    state.participantsInGroup.push(email)
  } else {
    console.log('Participant already selected:', email)
  }

  state.searchQuery = ''
  state.showSuggestions = false
}

const removeParticipant = (index: number) => {
  state.participantsInGroup.splice(index, 1)
}

const createGroup = async () => {
  try {
    if (!state.groupName || state.groupName.length > 20) {
      throw new Error('Group name is required and must be 20 characters or less.')
    }

    const groupDetails = {
      groupName: state.groupName,
      participantsInGroup: state.participantsInGroup
    }

    console.log('Request Payload:', groupDetails)

    const response = await axiosInstance.post('/createGroup', groupDetails)

    console.log('Group created successfully:', response.data)
    // Optionally, you can redirect the user or perform other actions
  } catch (error: any) {
    console.error('Error creating group:', error)
    const errorMessage = error.response?.data?.message || 'Error creating group'
    toast.error(errorMessage)
  }
}
</script>

<style scoped>
.custom-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input {
  outline: none;
  font-size: 14px;
  background-color: transparent;
  border: none;
}

.search-icon {
  font-size: 18px;
  color: #0e0d0d;
  margin-right: 10px;
  cursor: pointer;
}
.search-icon:hover {
  color: #333;
  transform: scale(1.1);
  transition:
    color 0.2s,
    transform 0.2s;
}
.custom-card-header {
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.cancle-icon {
  background-color: rgb(192, 4, 4);
  border: 1px solid #ccc;
  border-radius: 5px;
  color: rgb(250, 250, 250);
}

.add-button {
  background-color: #9bafe6;
  color: rgb(255, 255, 255);
}

.custom-card-body {
  padding: 20px;
}

.form-label {
  font-weight: bold;
}
.form-control {
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-card-body {
  margin-bottom: 1rem;
  margin-top: 1rem;
}
.not-found-image {
  height: 100px;
  width: 100px;
  opacity: 1;
  animation: zoomInOut 2s infinite alternate;
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

.participant-item {
  background-color: #166460;
  width: 35%;
  border-radius: 4px;
  padding-right: 4px;
  padding-top: 0%;
}

.participant-email-container {
  flex-grow: 1;
  overflow: hidden;
}

.participant-email {
  border: none;
  background: transparent;
  cursor: default;
  color: rgb(250, 250, 250);
  font-size: 12px;
}

.selected-participant {
  cursor: pointer;
}
</style>
