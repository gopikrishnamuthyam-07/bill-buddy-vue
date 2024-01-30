<template>
  <div class="container mt-4">
    <h1 class="mb-4 text-center heading">Expense List</h1>
    <nav>
      <div class="nav nav-tabs ms-1" id="nav-tab" role="tablist">
        <button
          class="nav-link bg-nav active text-white"
          id="nav-home-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-home"
          type="button"
          role="tab"
          aria-controls="nav-home"
          aria-selected="true"
          @click="($event) => handleClick($event, 'All')"
        >
          All
        </button>
        <button
          class="nav-link text-white bg-nav"
          id="nav-profile-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-profile"
          type="button"
          role="tab"
          aria-controls="nav-profile"
          aria-selected="false"
          @click="($event) => handleClick($event, 'Archived')"
        >
          Archived
        </button>
      </div>
    </nav>

    <div class="search-bar mb-4 ms-1" v-if="activeTab === 'All'">
      <input
        type="text"
        class="form-control search-input"
        v-model="searchQuery"
        placeholder="Search Here"
        @input="handleSearchInput"
      />
      <i class="bi bi-search search-icon ms-3"></i>
    </div>
    <ul class="suggested-emails" v-show="showSuggestions && searchQuery !== ''">
      <li
        v-for="(email, index) in suggestedEmails"
        :key="index"
        @click="selectSuggestedEmail(email)"
      >
        {{ email }}
      </li>
    </ul>

    <div class="tab-content" id="nav-tabContent">
      <div
        class="tab-pane fade show active bg-white"
        id="nav-home"
        role="tabpanel"
        aria-labelledby="nav-home-tab"
      >
        <div v-if="loading" class="spinner-container">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
            <div class="col" v-for="expense in filteredExpenses" :key="expense._id">
              <div class="custom-card mb-4 bg-user">
                <div class="custom-card-header bg-nav d-flex justify-content-between">
                  <h5 class="card-title text-truncate">{{ toTitleCase(expense.description) }}</h5>
                  <button
                    v-if="expense.payerUserId === user?.email"
                    class="bi bi-trash-fill text-white button-save"
                    @click="userDelete(expense._id, 'expenses')"
                    data-toggle="tooltip"
                    title="Delete"
                    data-placement="top"
                  ></button>
                </div>

                <div class="custom-card-body">
                  <div class="mb-3 text-center">
                    <strong class="">Payer</strong>

                    <div class="mt-2 mb-2">
                      <img
                        :src="expense.payerProfilePicture"
                        class="rounded-circle custom-profile-img shadow-lg"
                        alt="Payer's Profile"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <span class="user-id ms-1 ps-4 pe-4 pb-1 pt-0 text-truncate">{{
                      getPayerUsername(expense.payerUserId)
                    }}</span>

                    <div class="mt-3">
                      <button
                        v-if="expense.payerUserId === user?.email"
                        class="bi icons bi-archive action-buttons"
                        data-toggle="tooltip"
                        title="Archive"
                        data-placement="top"
                        @click="archiveTransaction(expense._id)"
                      >
                        Archive
                      </button>
                      <router-link :to="{ name: 'view', params: { id: expense._id } }">
                        <button
                          class="bi icons ms-3 me-3 bi-eye action-buttons"
                          data-toggle="tooltip"
                          title="View"
                          data-placement="top"
                        >
                          View
                        </button>
                      </router-link>
                      <router-link :to="{ name: 'Update', params: { id: expense._id } }">
                        <button
                          class="bi icons bi-pencil-square action-buttons"
                          data-toggle="tooltip"
                          title="Edit"
                          data-placement="top"
                        >
                          Edit
                        </button>
                      </router-link>
                    </div>
                  </div>

                  <div class="row my-card d-flex justify-content-between">
                    <div class="col-12 col-md-6 col-lg-3">
                      <h6 class="mb-0 mt-1 custom-text d-flex">
                        <strong>Amount:</strong>
                        <span class="ps-1 pe-2 ms-2 bg-amount rounded-pill">
                          ${{ expense.amount.toFixed(2) }}
                        </span>
                      </h6>
                    </div>
                    <div class="col-12 col-md-6 ms-5">
                      <div class="mb-0 custom-text">
                        <strong>Date:</strong>
                        <span class="bg-date">
                          {{ formatDate(expense.date) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="text-center d-flex justify-content-between mb-2">
                    <strong class="custom-text">Participants</strong>
                  </div>
                  <div class="d-flex bg-nav rounded p-3">
                    <div v-for="participant in expense.participants" :key="participant.userId">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="align-items-center">
                          <img
                            :src="participant.profilePicture"
                            class="rounded-circle me-2 participant-profile-img"
                            alt="Participant's Profile"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isFilteredAvailable" class="not-found-container text-center">
            <img
              src="../assets/NotfoundImages/download.png"
              alt="Not Found Image"
              class="not-found-image"
              referrerPolicy="no-referrer"
            />
            <p class="not-found-message">Oops! We couldn't find any results.</p>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
        <div v-if="loading" class="spinner-container">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else>
          <!-- Your existing archive container code -->
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 bg-white">
            <div class="col" v-for="expense in Archivedexpenses" :key="expense._id">
              <div class="mt-2">
                <div class="custom-card shadow-lg mb-4 bg-user">
                  <div class="custom-card-header bg-nav d-flex justify-content-between">
                    <h5 class="card-title text-truncate">{{ expense.description }}</h5>
                    <i
                      v-if="expense.payerUserId === user?.email"
                      class="bi bi-trash-fill text-white"
                      @click="userDelete(expense._id, 'Archivedexpenses')"
                    ></i>
                  </div>
                  <div class="custom-card-body">
                    <div class="mb-3 mt-2 text-center">
                      <div class="col-12 mb-2">
                        <strong class="text-center">Payer</strong>
                      </div>
                      <span class="ps-1 pe-1 text-truncate user-id">{{ expense.payerUserId }}</span>
                      <div class="mt-3 mb-3 col-12 d-flex justify-content-between flex-wrap">
                        <router-link :to="{ name: 'view', params: { id: expense._id } }">
                          <button
                            class="bi icons ms-3 me-3 bi-eye action-buttons"
                            data-toggle="tooltip"
                            title="View"
                            data-placement="top"
                          >
                            View
                          </button>
                        </router-link>
                        <router-link :to="{ name: 'Update', params: { id: expense._id } }">
                          <button
                            class="bi icons bi-pencil-square action-buttons"
                            data-toggle="tooltip"
                            title="Edit"
                            data-placement="top"
                          >
                            Edit
                          </button>
                        </router-link>
                      </div>
                    </div>
                    <hr class="custom-hr" />
                    <div class="d-flex justify-content-between flex-wrap mb-2 my-card">
                      <div class="mb-0 mt-1 custom-text">
                        <strong>Amount:</strong>
                        <span class="ps-1 pe-1 ms-2 text-white bg-amount rounded-pill">
                          ${{ expense.amount.toFixed(2) }}
                        </span>
                      </div>
                      <div class="mb-0 custom-text">
                        <strong>Date:</strong>
                        <div class="d-flex align-items-center">
                          <span class="ps-1 pe-1 ms-2 bg-date date-background rounded-pill">
                            {{ formatDate(expense.date) }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="text-center d-flex justify-content-between mb-2">
                      <strong class="custom-text">Participants</strong>
                    </div>
                    <div class="align-items-center archive-participants bg-nav">
                      <div v-for="participant in expense.participants" :key="participant.userId" class=" overflow-auto">
                        <div class="text-center">
                          {{ participant.userId }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axiosInstance from '../services/service'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'

const { user, loginWithRedirect, logout } = useAuth0()

interface UserDetails {
  profilePicture: string | undefined
  email: string | undefined
}
let userDetails = ref<UserDetails | null>(null)

export interface Transaction {
  _id: string
  payerUserId: string
  description: string
  amount: number
  date: Date | string
  isArchived: boolean
  payerProfilePicture: string
  participants?: Participant[]
}
type Participant = {
  userId: string
  share: number
  profilePicture: string
}

const activeTab = ref('All')
const handleClick = (event: MouseEvent, tab: string) => {
  activeTab.value = tab
  tabButtons.forEach((btn) => {
    btn.classList.remove('active')
  })
  ;(event.target as HTMLElement).classList.add('active')
  showSuggestions.value = false // Close the suggestions when switching tabs
  searchQuery.value = '' // Clear the search query when switching tabs
}

const toTitleCase = (description: string) => {
  return description
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

const searchQuery = ref('')
const suggestedEmails = ref([])
const showSuggestions = ref(false)
const selectedEmail = ref('')

const filteredExpenses = computed(() => {
  if (!expenses.value.length) {
    isFilteredAvailable.value = false
  }

  if (searchQuery.value) {
    const filteredData = expenses.value.filter((expense) => {
      const matchesSearch =
        expense.payerUserId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchesSearch
    })

    isFilteredAvailable.value = filteredData.length === 0
    return filteredData
  } else {
    isFilteredAvailable.value = false
    return expenses.value
  }
})

const showSuggestedEmails = async () => {
  try {
    const response = await axiosInstance.get(
      `/findParticipantsByEmail?searchTerm=${searchQuery.value}`
    )
    suggestedEmails.value = response.data
    showSuggestions.value = suggestedEmails.value.length > 0
  } catch (error) {
    console.error('Error fetching suggested emails:', error)
  }
}
const handleSearchInput = async () => {
  if (searchQuery.value === '') {
    showSuggestions.value = false
    suggestedEmails.value = []
    selectedEmail.value = ''
  } else {
    try {
      const response = await axiosInstance.get(
        `/findParticipantsByEmail?searchTerm=${searchQuery.value}`
      )

      suggestedEmails.value = response.data

      showSuggestions.value = suggestedEmails.value.length > 0
    } catch (error) {
      console.error('Error fetching suggested emails:', error)
    }
  }
}

const selectSuggestedEmail = (email: string) => {
  searchQuery.value = email
  showSuggestions.value = false
  selectedEmail.value = email
}

const tabButtons = document.querySelectorAll('.nav-link')

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tabButtons.forEach((btn) => {
      btn.classList.remove('active')
    })

    button.classList.add('active')
  })
})

const loading = ref(true)
const isFilteredAvailable = ref(false)
const expenses = ref<Transaction[]>([])
const Archivedexpenses = ref<Transaction[]>([])

const isArchived = (expense: { isArchived: boolean }) => {
  return computed(() => expense.isArchived === true)
}

const getPayerUsername = (userId: string) => {
  const nameMatch = userId.match(/[A-Za-z\s]+/)
  if (nameMatch && nameMatch.length > 0) {
    const extractedName = nameMatch[0]

    const camelCaseName = extractedName
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase()
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join('')

    return camelCaseName
  }
  return userId
}

const fetchData = async () => {
  try {
    const response = await axiosInstance.get('/users/transactions')
    expenses.value = response.data
    loading.value = false

    // console.log(response.data)
  } catch (error) {
    console.error('Error fetching transaction data:', error)
  }
}

const fetchArchivedTransactions = async () => {
  try {
    const response = await axiosInstance.get('/archived-transactions')
    Archivedexpenses.value = response.data
    loading.value = false

    // console.log(response.data)
  } catch (error) {
    console.error('Error fetching transaction data:', error)
  }
}

const archiveTransaction = async (id: any) => {
  try {
    const response = await axiosInstance.post(`/transactions/${id}/archive`)
    expenses.value = response.data
    fetchArchivedTransactions()
    fetchData()
    // console.log(response.data)
  } catch (error) {
    console.error('Error fetching transaction data:', error)
  }
}

// Function to format a date
const formatDate = (date: string | Date) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

const userDelete = async (id: any, arrayName: string) => {
  try {
    const response = await axiosInstance.delete(`/transactions/${id}`)
    // console.log(response.data)
    alert('Are you sure to delete')
    if (arrayName === 'expenses') {
      expenses.value = expenses.value.filter((expense) => expense._id !== id)
    } else if (arrayName === 'Archivedexpenses') {
      Archivedexpenses.value = Archivedexpenses.value.filter((expense) => expense._id !== id)
    }
  } catch (error) {
    console.error('Error deleting transaction:', error)
  }
}

// const searchQuery = ref('')

const fetchUserData = async () => {
  userDetails.value = { profilePicture: user.value?.picture, email: user.value?.email }
  if (user.value) {
    try {
      // console.log(userDetails.value)
      const response = await axiosInstance.post('/createOrGetUser', userDetails.value)
      userDetails.value = response.data
      // console.log(userDetails.value)
      fetchData()
      fetchArchivedTransactions()
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }
}

onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
.custom-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.custom-card:hover {
  transform: translateY(5px) scale(1.02);
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 5px;
  font-size: 16px;
  background-color: transparent;
}

.search-icon {
  font-size: 24px;
  color: #bebebe;
  margin-right: 10px;
  cursor: pointer;
}

.active {
  background-color: rgba(0, 0, 0, 0.1);
  color: black;
}

.search-icon:hover {
  color: #333;
  transform: scale(1.1);
  transition:
    color 0.2s,
    transform 0.2s;
}
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.wrong {
  cursor: pointer;
}

.archive-participants {
  padding: 11px;
  border-radius: 10px;
  color: white;
  font-weight: 400;
  font-size: 14px;
  max-height: 44px;
  overflow-y: auto !important;

}
.custom-card-header {
  color: white;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
/* .date-background {
  padding-bottom: 1px;
  background-color: #ffffff;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 50%;
} */

.custom-card-body {
  padding: 20px;
}

.custom-card-footer {
  background-color: #f8f9fa;
  padding: 10px 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.custom-text {
  font-size: 16px;
  text-align: center;
}

.custom-hr {
  border-top: 1px solid #e0e0e0;
}

.custom-list-item {
  padding: 10px 20px;
}
.participant-profile-img {
  height: 40px;
  width: 40px;
}

.custom-badge {
  font-size: 14px;
  padding: 6px 12px;
}

.nav-link.active {
  background-color: hsl(179, 89%, 26%);
  color: rgb(255, 255, 255) !important;
  width: 100px;
  padding: 4px 14px;
  border: none;
  text-decoration: none;
  margin-right: 4px;
  margin-left: 4px;
  animation: zoom 1s alternate infinite;
  margin-bottom: 2px;
}
@keyframes zoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}
.nav-tabs {
  border: none;
  margin-bottom: 1px;
}
.not-found-container {
  margin-top: 20px;
  padding: 20px;
  /* border: 2px solid #ffefef; */
  border-radius: 8px;
  background-color: white;
}

.not-found-image {
  width: auto;
  height: auto;
  animation: zoomInOut 8s infinite alternate;
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

.not-found-message {
  margin-top: 10px;
  font-size: 28px;
  color: #b6b1b1;
  font-family: monospace;
  font-weight: 700;
  animation: zoomInOut 10s infinite alternate;
}

.archive-participants {
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #cbd5e0;
}

.archive-participants::-webkit-scrollbar {
  width: 5px;
}

.archive-participants::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
 border-radius: 10px;
}

.archive-participants::-webkit-scrollbar-track {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color:hsl(180, 40%, 19%);
}
</style>
