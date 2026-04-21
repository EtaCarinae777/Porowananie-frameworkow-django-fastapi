import { getUrl } from './client'

const getToken = () => localStorage.getItem('token')

export const getLoans = async () => {
  const res = await fetch(getUrl() + '/api/loans/', {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  })
  return res.json()
}

export const createLoan = async (loan) => {
  const res = await fetch(getUrl() + '/api/loans/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(loan)
  })
  return res.json()
}