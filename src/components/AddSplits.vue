<template>
  <div class="container mt-4">
    <h1 class="mb-4 text-center heading">Add Expense</h1>
    <div class="row">
      <div class="col-md-12 add-card">
        <div class="custom-card mb-4">
          <div class="custom-card-header bg-nav d-flex justify-content-between">
            <h5 class="card-title">Expense Details</h5>
            <router-link to="/Mysplits" class="border-0 rounded-pill text-dark">
              <i
                class="bi bi-arrow-left-circle-fill text-white"
                data-toggle="tooltip"
                title="Back"
                data-placement="top"
              ></i>
            </router-link>
          </div>
          <div class="custom-card-body">
            <div class="mb-3">
              <label for="expenseDescription" class="form-label">Description</label>

              <input
                type="name"
                id="expenseDescription"
                class="form-control"
                v-model="formData.description"
                :class="{
                  'input-error':
                    !isDescriptionValid || !isDescriptionLengthValid || hasNumbersInDescription,
                  'input-valid':
                    isDescriptionValid && isDescriptionLengthValid && !hasNumbersInDescription
                }"
                @blur="validateDescription"
                @input="validateDescriptionLength"
              />

              <p v-if="!isDescriptionValid" class="text-danger">Description is required.</p>
              <p v-if="!isDescriptionLengthValid" class="text-danger">
                Description is should be in below 20 letters
              </p>
            </div>
            <div class="mb-3">
              <label for="payerUserId" class="form-label">Payer</label>
              <div class="d-flex justify-content-center payer-div bg-nav border order-secondary">
                <i class="bi bi-person-circle me-2 text-white" style="font-size: 25px"></i>
                <div class="d-flex justify-content-center">
                  <!-- <img
                    :src="formData.payerProfilePicture"
                    class="rounded-circle custom-profile-img"
                    alt="Payer's Profile"
                  /> -->
                </div>

                <select
                  id="payerUserId"
                  class="form-select"
                  v-model="formData.payerUserId"
                  :class="{
                    'input-error': !isPayerValid && formData.payerUserId === '',
                    'input-valid': isPayerValid && formData.payerUserId !== ''
                  }"
                  @blur="validatePayer"
                >
                  <option value="" disabled>Select a payer</option>
                  <option
                    v-for="email in suggestedEmails"
                    :key="email"
                    :value="email"
                    :class="{
                      'text-white bg-nav': email === user?.email,
                      'fw-semibold': email === user?.email
                    }"
                  >
                    {{ emailWithMe(email, formData.payerUserId, user?.email) }}
                  </option>
                </select>

                
              </div>

              <p v-if="!isPayerValid" class="text-danger">Payer is required.</p>
            </div>
            <div class="mb-3">
              <label for="expenseAmount" class="form-label">Amount</label>
              <input
                type="number"
                id="expenseAmount"
                class="form-control"
                v-model="formData.amount"
                :class="{
                  'input-error': !isAmountValid && formData.amount === 0,
                  'input-valid': isAmountValid && formData.amount > 0
                }"
                @blur="validateAmount"
                @input="validateAmount"
                inputmode="numeric"
              />
              <p v-if="!isAmountValid" class="text-danger">Amount must be greater than 0.</p>
            </div>
            <div class="mb-3">
              <label for="expenseDate" class="form-label">Date</label>
              <input
                type="date"
                id="expenseDate"
                class="form-control"
                v-model="formData.date"
                :class="{
                  'input-error': !isDateValid && formData.date === '',
                  'input-valid': isDateValid && formData.date !== ''
                }"
                @blur="validateDate"
              />
              <p v-if="!isDateValid" class="text-danger">Date is required.</p>
            </div>
          </div>
        </div>
        <div class="custom-card mb-4">
          <div class="custom-card-header bg-nav d-flex justify-content-between">
            <h5 class="card-title">Participants</h5>
            <button class="add-button border-0 bg-dark rounded-pill" @click="addParticipant">
              <i
                class="bi bi-person-fill-add"
                data-toggle="tooltip"
                title="Add"
                data-placement="top"
              ></i>
            </button>
          </div>
          <div class="custom-card-body">
            <div v-for="(participant, index) in formData.participants" :key="index">
              <div class="mb-3 d-flex justify-content-between align-items-center">
                <label :for="`participantName${index}`" class="form-label me-2">Name:</label>
                <div class="input-group">
                  <select id="participantUserId" class="form-select" v-model="participant.userId">
                    <option value="" disabled>Select a participant</option>
                    <option
                      v-for="email in suggestedEmails.filter((e) => e !== formData.payerUserId)"
                      :key="email"
                      :value="email"
                      :class="{
                        'text-white bg-nav': email === user?.email,
                        'fw-semibold': email === user?.email
                      }"
                    >
                      {{ emailWithMe(email, participant.userId, user?.email) }}
                    </option>
                  </select>
                </div>
                <label :for="`participantName${index}`" class="form-label ms-4 me-2">Share:</label>
                <div class="input-group">
                  <input
                    :id="`participantName${index}`"
                    class="form-control"
                    v-model="participant.share"
                    type="number"
                  />
                  <button @click="removeParticipant(index)" class="cancel-icon bg-danger">
                    <i class="bi bi-x text-white"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-4 mx-auto d-flex justify-content-center">
              <button
                class="button-save"
                @click="saveExpense"
                v-if="isDescriptionValid && isPayerValid && isAmountValid && isFormComplete"
              >
                <!-- <i class="bi bi-floppy-fill"></i>  -->
                Save
              </button>
              <button class="button-cancle" @click="cancelExpense">
                <!-- <i class="bi bi-x-square-fill"></i> -->
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axiosInstance from '../services/service'
import router from '../router'
import { useToast } from 'vue-toastification'
import { useAuth0 } from '@auth0/auth0-vue'

const { user, isAuthenticated } = useAuth0()

const formData = ref({
  payerUserId: '',
  description: '',
  amount: 0,
  date: '',
  isArchived: false,
  participants: [
    {
      userId: '',
      share: 0
    }
  ],
  __v: 0,
  payerProfilePicture: ''
})
type Participant = {
  userId: string
  share: number
}
const hasNumbersInDescription = ref(false)
const validateDescriptionNumbers = () => {
  hasNumbersInDescription.value = /\d/.test(formData.value.description)
}

const validateDescriptionLength = () => {
  isDescriptionLengthValid.value = formData.value.description.length <= 20
}

// New ref to track description length validation
const isDescriptionLengthValid = ref(true)

// Updated form complete computed property
const isFormComplete = computed(() => {
  return (
    isDescriptionValid.value &&
    isDescriptionLengthValid.value &&
    isPayerValid.value &&
    isAmountValid.value &&
    isDateValid.value &&
    !hasNumbersInDescription.value
  )
})

const toast = useToast()

// const isFormComplete = computed(() => {
//   return isDescriptionValid.value && isPayerValid.value && isAmountValid.value && isDateValid.value
// })

const validateDate = () => {
  isDateValid.value = !!formData.value.date
}

const validateDescription = () => {
  isDescriptionValid.value = !!formData.value.description
}
const validateAmount = () => {
  isAmountValid.value = !!formData.value.amount
}
const validatePayer = () => {
  isPayerValid.value = !!formData.value.payerUserId
}

// Define computed property for email display with 'Me'
const emailWithMe = computed(() => (email: string, userId: any, currentUser: any) => {
  if (currentUser && email === currentUser) {
    return `${email.replace(userId, `${userId}`)} (Me)`
  }
  return email
})

const isModalVisible = ref(false)

const suggestedEmails = ref([])
const selectedEmail = ref('You')
const selectedPeopleToAdd = ref([])
const selectedPeople = ref<Participant[]>([])

// Form validation states
const isDescriptionValid = ref(true)
const isPayerValid = ref(true)
const isAmountValid = ref(true)
const isDateValid = ref(true)
const isParticipantValid = ref(false)

const getSuggestedEmails = async () => {
  try {
    const response = await axiosInstance.get('/getSuggestedEmails')
    suggestedEmails.value = response.data
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching suggested emails:', error)
  }
}

const closeModal = () => {
  isModalVisible.value = false
}

const cancelExpense = () => {
  // Clear the form data and reset validation states
  formData.value.description = ''
  formData.value.amount = 0
  formData.value.payerUserId = ''
  formData.value.isArchived = false
  formData.value.date = ''
  formData.value.participants = [
    {
      userId: '',
      share: 0
    }
  ]
  selectedPeople.value = []
  // Reset validation states
  isDescriptionValid.value = true
  isPayerValid.value = true
  isAmountValid.value = true
  isDateValid.value = true
}

const addSelectedPeople = () => {
  selectedPeople.value = [...selectedPeople.value, ...selectedPeopleToAdd.value]
  selectedPeopleToAdd.value = []
}

const addParticipant = () => {
  formData.value.participants.push({
    userId: '',
    share: 0
  })
}

const removeParticipant = (index: number) => {
  formData.value.participants.splice(index, 1)
}

async function saveExpense() {
  // Reset validation states
  isDescriptionValid.value = !!formData.value.description
  isPayerValid.value = !!formData.value.payerUserId
  isAmountValid.value = formData.value.amount > 0
  isDateValid.value = !!formData.value.date

  // Check if all validations pass
  if (isDescriptionValid.value && isPayerValid.value && isAmountValid.value && isDateValid.value) {
    try {
      const postData = {
        description: formData.value.description,
        amount: formData.value.amount,
        payerUserId: formData.value.payerUserId,
        participants: formData.value.participants,
        isArchived: formData.value.isArchived,
        date: formData.value.date
      }

      let totalShare = 0

      // Calculate the total share
      postData.participants.forEach((participant) => {
        totalShare += participant.share
      })

      if (totalShare === postData.amount || totalShare < postData.amount) {
        const response = await axiosInstance.post('/addTransaction', postData)
        console.log('Response:', response.data)

        toast.success('Transaction updated:', response.data)

        clearFormData()
        router.push('/Mysplits')
      } else {
        toast.error('Please enter a valid share. Your share is more than the total amount')
      }
    } catch (error) {
      // Handle errors and display a toast message
      console.error('Error updating transaction:', error)
      toast.error('Error updating transaction')
    }
  }
}

const clearFormData = () => {
  formData.value.description = ''
  formData.value.amount = 0
  formData.value.payerUserId = ''
  formData.value.isArchived = false
  formData.value.date = ''
  formData.value.participants = [
    {
      userId: '',
      share: 0
    }
  ]
  // Reset validation states
  isDescriptionValid.value = true
  isPayerValid.value = true
  isAmountValid.value = true
  isDateValid.value = true
}

onMounted(() => {
  getSuggestedEmails()
})
</script>

<style scoped>
.custom-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.custom-card-header {
  color: white;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.cancel-icon {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: red;
}

.add-button {
  background-color: #9bafe6;
  color: rgb(255, 255, 255);
}
.custom-card-body {
  padding: 20px;
}
#userId {
  font-weight: bold;
}

.form-label {
  font-weight: bold;
}

.custom-card-body .mb-3 {
  margin-bottom: 1.5rem;
}

.payer-div {
  border-width: 2px;
  padding: 10px;
  border-radius: 10px;
}
.custom-card-body .btn-primary {
  margin-top: 1rem;
}

.warning-icon {
  font-size: 50px;
}
.text-danger {
  color: red;
}

/* Modal Overlay */
/* Modal Overlay */
/* Modal Overlay */
.modal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 999; /* Ensure it's above other content */
}

/* Modal */
.modal {
  width: 30%; /* Set a fixed width */
  height: auto; /* Set a fixed height */
  background: #fffdfd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
  text-align: center;
  display: inline-block; /* Center horizontally */
  vertical-align: middle; /* Center vertically */
  margin-left: 40%;
}

/* Modal Text */
.modal p {
  font-size: 16px;
  margin-bottom: 15px;
  font-weight: bold;
}

/* OK Button */
.modal button {
  background: #007bff; /* Blue color */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}
.input-error {
  border: 1px solid #ff0000; /* Red border color */
}

.input-valid {
  border: 1px solid #2ecc71; /* Green border color */
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
