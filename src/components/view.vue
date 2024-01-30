<template>
  <div class="container mt-4">
    <h1 class="mb-4 text-center">Expense Details</h1>
    <div class="row justify-content-center ">
      <div class="col-md-8 " v-for="expense in expenses" :key="expense._id">
        <div class="card mb-4">
          <div class="card-header d-flex bg-nav justify-content-between  custom-card-header text-white">
            <h5 class="card-title ">{{ expense.description }}</h5>
            <router-link to="/Mysplits" class="text-dark rounded-pill">
              <i class="bi bi-arrow-left-circle-fill text-white"></i>
            </router-link>
          </div>
          <div class="card-body bg-user">
            <div class="expense-info">
              <div class="payer-info mt-2">
                <strong class="me-2">Payer:</strong>
                <span class="user-id bg-date">{{ expense.payerUserId }}</span>
              </div>
              <hr class="custom-hr" />
              <div class="expense-amount">
                <strong class="me-1">Total Amount:</strong>
                <span class="badge bg-success rounded-pill">
                  ${{ expense.amount.toFixed(2) }}
                </span>
              </div>
              <div class="expense-date  d-flex">
                <strong>Date:</strong>
                <div class="bg-date pt-1 ps-2 pe-2"> {{ formatDate(expense.date) }} </div>
                
              </div>
            </div>
            <div class="participants">
              <h5 class="mt-4 mb-3">Participants</h5>
              <div class="row">
                <div class="col-md-6 " v-for="participant in expense.participants" :key="participant.userId">
                  <div class="card mb-3 ">
                    <div class="card-body participant-item m-0 bg-nav shadow-lg">
                      <div class="participant-info">
                        <strong class="me-2 text-white">Share:</strong>
                        <span class="badge bg-success rounded-pill mb-2 fw-semibold">
                          ${{ participant.share }}
                        </span>
                      </div>
                      <div class="user-id bg-date">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../services/service'

const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()

const expenses = ref<Transaction[]>([])
const userDetails = ref<UserDetails | null>(null)
const router = useRouter()

interface UserDetails {
  profilePicture: string | undefined
  email: string | undefined
}

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

const fetchTransactionData = async (transactionId: any) => {
  try {
    const response = await axiosInstance.get(`/transaction/${transactionId}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching transaction data:', error)
    return null
  }
}

const formatDate = (date: any) => {
  return new Date(date).toLocaleDateString()
}

const fetchUserData = async () => {
  userDetails.value = { profilePicture: user.value?.picture, email: user.value?.email }

  const transactionId = router.currentRoute.value.params.id

  if (transactionId) {
    const transactionDetails = await fetchTransactionData(transactionId)
    if (transactionDetails) {
      expenses.value = [transactionDetails]
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
  transform: translateY(-5px);
}

.custom-card-header {
  color: white;
  padding: 10px;
  align-items: center;
}

.card-title {
  font-size: 24px;
}

.expense-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.payer-info,
.expense-amount,
.expense-date {
  margin-bottom: 10px;
}

.expense-amount-value {
  background-color: #28a745;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
}

.participants {
  margin-top: 20px;
}

.custom-text {
  font-size: 18px;
}

.participant-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.participant-item {
  margin: 10px;
  text-align: center;
}

.share-amount {
  background-color: #28a745;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
}

.user-id {
  border-radius: 5px;
  padding: 5px 10px;
}
</style>
