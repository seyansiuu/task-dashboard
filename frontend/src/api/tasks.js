import axios from 'axios'

const API_URL = 'http://localhost:5001/api/tasks'

export async function getTasks() {
  const response = await axios.get(API_URL)
  return response.data.data
}

export async function createTask(task) {
  const response = await axios.post(API_URL, task)
  return response.data.data
}

export async function updateTask(id, task) {
  const response = await axios.put(`${API_URL}/${id}`, task)
  return response.data.data
}

export async function deleteTask(id) {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data.data
}
