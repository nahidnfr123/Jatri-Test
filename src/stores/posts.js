import {defineStore} from 'pinia'

const apiBaseUrl = import.meta.env.VITE_BASE_URL

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: null,
    pagination: {
      total: 0,
      per_page: 10,
      current_page: 1,
      last_page: 1,
      from: 1,
      to: 1,
    },
    sortBy: '', // '', asc, desc
    query: '',
  }),
  getters: {
    paginatedPosts() {
      const {current_page, per_page} = this.pagination
      const start = (current_page - 1) * per_page
      const end = current_page * per_page

      let data = this.posts

      // filter by title
      if (this.query) {
        data = data?.filter(obj => {
          return obj.title.toLowerCase().includes(this.query.toLowerCase())
        })
      }

      // Sort by ascending or descending
      if (this.sortBy === 'asc') {
        data = data?.sort((a, b) => {
          if (a.title < b.title) return -1;
          if (a.title > b.title) return 1;
          return 0;
        })
      } else if (this.sortBy === 'desc') {
        data = data?.sort((a, b) => {
          if (a.title > b.title) return -1;
          if (a.title < b.title) return 1;
          return 0;
        })
      }
      if (!data || !data.length) return []

      return data.slice(start, end)
    },
  },
  actions: {
    fetchPosts() {
      try {
        fetch(apiBaseUrl + '/posts', {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
          },
        }).then(res => {
          if (!res.ok) {
            const error = new Error(res.statusText);
            error.json = res.json();
            throw error;
          }
          return res.json();
        }).then(json => {
          this.posts = json
          this.pagination.total = this.posts?.length
          this.pagination.last_page = Math.ceil(this.pagination.total / this.pagination.per_page)
          this.pagination.from = (this.pagination.current_page - 1) * this.pagination.per_page + 1
          this.pagination.to = this.pagination.from + (this.pagination.per_page - 1)
        })
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    previousPage() {
      if (this.pagination.current_page > 1) {
        this.pagination.current_page--
        this.pagination.from = (this.pagination.current_page - 1) * this.pagination.per_page + 1
        this.pagination.to = this.pagination.from + (this.pagination.per_page - 1)
      }
    },
    nextPage() {
      if (this.pagination.current_page < this.pagination.last_page) {
        this.pagination.current_page++
        this.pagination.from = (this.pagination.current_page - 1) * this.pagination.per_page + 1
        this.pagination.to = this.pagination.from + (this.pagination.per_page - 1)
      }
    },
    changePage(page) {
      this.pagination.current_page = page
      this.pagination.from = (this.pagination.current_page - 1) * this.pagination.per_page + 1
      this.pagination.to = this.pagination.from + (this.pagination.per_page - 1)
    }
  },
})
