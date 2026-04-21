let activeBackend = 'django'
const listeners = []

export const setBackend = (backend) => {
  activeBackend = backend
  listeners.forEach(fn => fn(backend))
}

export const getBackend = () => activeBackend

export const onBackendChange = (fn) => {
  listeners.push(fn)
  return () => listeners.splice(listeners.indexOf(fn), 1)
}

export const getUrl = () => {
  if (activeBackend === 'django') {
    return 'http://localhost:8001'
  } else {
    return 'http://localhost:8002'
  }
}