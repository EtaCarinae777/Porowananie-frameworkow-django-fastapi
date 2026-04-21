import { getUrl } from './client'

export const getBooks = async () => {
  const res = await fetch(getUrl() + '/api/books/')
  return res.json()
}

export const getBook = async (id) => {
  const res = await fetch(getUrl() + '/api/books/' + id + '/')
  return res.json()
}

export const createBook = async (book) => {
  const res = await fetch(getUrl() + '/api/books/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  })
  return res.json()
}

export const deleteBook = async (id) => {
  await fetch(getUrl() + '/api/books/' + id + '/', {
    method: 'DELETE'
  })
}