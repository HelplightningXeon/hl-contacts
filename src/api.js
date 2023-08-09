
import axios from 'axios'
import { isEmpty } from 'ramda'

// ------------------------------------
// Config
// ------------------------------------
export const apiKey = window.environment?.API_KEY || ''
export const galdrUrl = window.environment?.GALDR_URL || ''

// Set Axios Defaults
const retrievedObject = localStorage.getItem('hl-user') || sessionStorage.getItem('hl-user')
export const token = retrievedObject && !isEmpty(JSON.parse(retrievedObject)) ? JSON.parse(retrievedObject).enterpriseToken : ''

// params: url parts with the first part being the domain part
// e.g. urlJoin('http://foo.bar/', '/baz')
const urlJoin = (...args) => {
  let baseUrl = args[0]
  // remove all trailing slashes
  while (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1)
  }
  // remove all leading, trailing slashes
  for (let i = 1; i < (args.length - 1); i++) {
    let part = args[i]
    while (part.startsWith('/')) {
      part = part.slice(1)
    }
    while (part.endsWith('/')) {
      part = part.slice(0, -1)
    }
    baseUrl += '/' + part
  }
  let lastPart = args[args.length - 1]
  // remove all leading slashes
  while (lastPart.startsWith('/')) {
    lastPart = lastPart.slice(1)
  }
  baseUrl += '/' + lastPart
  return baseUrl
}

export const galdrWrapper = (...paths) => {
  const url = urlJoin(galdrUrl, ...paths)
  const instance = axios.create({
    baseURL: url,
    timeout: 60000,
    headers: {
      'x-helplightning-api-key': apiKey,
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  })
  return instance
}

export const galdrClient = galdrWrapper('api', 'v1')
export const galdrClientV1R1 = galdrWrapper('api', 'v1r1')
export const galdrClientRevision = (revision) => galdrWrapper('api', revision)

export const initializeApiHeaders = (token) => {
  galdrClient.defaults.headers.Authorization = token
  galdrClientV1R1.defaults.headers.Authorization = token
}

// initialized during login only
export const initializeApiHeadersOnLogin = (currentUser, enterpriseToken) => {
  galdrClient.defaults.headers.Authorization = enterpriseToken || currentUser.token
  galdrClientV1R1.defaults.headers.Authorization = enterpriseToken || currentUser.token
}