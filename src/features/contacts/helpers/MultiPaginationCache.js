import axios from 'axios'

export default class MultiPaginationCache {
  constructor (caches) {
    this.caches = caches
    this.total = -1
  }

  reset = () => {
    this.caches.forEach(cache => cache.reset())
    this.total = -1
  }

  fetchData = (start, end) => {
    return this.fetchSize().then(() => {
      let offset = 0
      const requests = []
      this.caches.forEach((cache) => {
        requests.push(cache.fetchData(start - offset, end - offset))
        offset += cache.total
      })
      return axios.all(requests).then((results) => [].concat(...results))
    })
  }

  fetchSize = () => {
    return new Promise((resolve, reject) => {
      if (this.total === -1) {
        const requests = this.caches.map((cache) => cache.fetchSize())
        axios.all(requests).then((sizes) => {
          this.total = sizes.reduce((a, b) => a + b, 0)
          resolve(this.total)
        })
      } else {
        resolve(this.total)
      }
    })
  }
}
