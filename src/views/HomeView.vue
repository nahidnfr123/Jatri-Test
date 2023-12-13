<script setup>
import {onMounted, ref, watch} from "vue";
import {usePostStore} from "@/stores/posts.js";
import {storeToRefs} from "pinia";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import Pagination from "@/components/pagination.vue";

const postStore = usePostStore()
const {paginatedPosts: posts} = storeToRefs(postStore)
const isLoading = ref(true)
const sortBy = ref('')
const query = ref('')

const init = async () => {
  isLoading.value = true
  await postStore.fetchPosts()
  isLoading.value = false
}

onMounted(() => init())

// watch
watch(sortBy, (newVal, oldValue) => {
  if (oldValue !== newVal) {
    postStore.sortBy = newVal
  }
})

watch(query, (newVal, oldValue) => {
  if (oldValue !== newVal) {
    postStore.query = newVal
  }
})
</script>

<template>
  <main>
    <template v-if="isLoading">
      <LoadingIndicator/>
    </template>
    <template v-else>
      <div class="m-4">
        <div>

          <form>
            <div class="w-full flex flex-wrap gap-4">
              <div class="flex-1">
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input type="search"
                         v-model="query"
                         id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Title..." required>
                  <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
              </div>

              <div class="flex-1 flex">
                <label for="countries" class="block mb-2 text-xs font-medium text-gray-900 dark:text-white">Sort By Title</label>
                <select
                    v-model="sortBy"
                    id="countries"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option selected value="">Default</option>
                  <option value="asc">ASC</option>
                  <option value="desc">DESC</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div v-if="posts && posts.length" class="m-4">
          <!-- component -->
          <div class="min-h-screen items-center justify-center">
            <div>
              <table class="min-w-full shadow-md rounded-xl">
                <thead>
                <tr class="text-2xl">
                  <th class="py-3 px-4 text-left">Title</th>
                  <th class="py-3 px-4 text-left">Body</th>
                </tr>
                </thead>
                <tbody class="">
                <tr v-for="post in posts" :key="post.id" class="border-b border-blue-gray-200">
                  <td class="py-3 px-4 capitalize">{{ post.title }}</td>
                  <td class="py-3 px-4">{{ post.body }}</td>
                </tr>
                </tbody>
              </table>
              <Pagination
                  :options="postStore.pagination"
                  @change-page="(n) => postStore.changePage(n)"
                  @previous-page="postStore.previousPage()"
                  @next-page="postStore.nextPage()"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>
