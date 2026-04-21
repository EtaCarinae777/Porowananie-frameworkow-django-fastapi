import { getUrl } from './client'

export const getMembers = async () => {
  const res = await fetch(getUrl() + '/api/members/')
  return res.json()
}

export const createMember = async (member) => {
  const res = await fetch(getUrl() + '/api/members/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member)
  })
  return res.json()
}