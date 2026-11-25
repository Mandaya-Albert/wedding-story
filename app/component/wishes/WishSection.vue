<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Send } from '@lucide/vue'
import { wishService, type Wish } from '~/services/wish.service'

const emit = defineEmits<{
  sent: [message: string]
  error: [message: string]
}>()

const guestName = ref('')
const message = ref('')

const wishes = ref<Wish[]>([])
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

let unsubscribe: (() => void) | undefined

const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.max(1, Math.ceil(wishes.value.length / pageSize)))
const pagedWishes = computed(() => wishes.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1)
  if (current <= 3) return [1, 2, 3, 4, 'ellipsis', total]
  if (current >= total - 2) return [1, 'ellipsis', total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
})

onMounted(() => {
  const { $firestore } = useNuxtApp()

  unsubscribe = wishService.subscribe(
    $firestore,
    (data) => {
      wishes.value = data
      loading.value = false
      if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
    },
    (error) => {
      console.error(error)
      errorMessage.value = 'Gagal mengambil ucapan. Periksa Firestore Security Rules.'
      loading.value = false
      emit('error', errorMessage.value)
    }
  )
})

onUnmounted(() => {
  unsubscribe?.()
})

const submitWish = async () => {
  if (submitting.value) return

  errorMessage.value = ''
  successMessage.value = ''

  try {
    submitting.value = true

    const { $firestore } = useNuxtApp()

    await wishService.create($firestore, {
      guestName: guestName.value,
      message: message.value
    })

    guestName.value = ''
    message.value = ''
    currentPage.value = 1

    successMessage.value = 'Ucapan berhasil dikirim!'
    emit('sent', successMessage.value)
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Gagal mengirim ucapan.'
    emit('error', errorMessage.value)
  } finally {
    submitting.value = false
  }
}

const formatDate = (date: Date | null) => {
  if (!date) return 'Baru saja'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}
</script>

<template>
  <section class="wish-layout">
    <div>
      <p class="eyebrow">Ucapan & Doa</p>
      <h2 class="section-title">Berikan Doa</h2>

      <form class="wish-form" @submit.prevent="submitWish">
        <input v-model="guestName" maxlength="50" required placeholder="Nama Anda" />
        <textarea v-model="message" maxlength="500" required placeholder="Tulis ucapan bahagia..." />
        <button class="submit-btn" type="submit" :disabled="submitting">
          <Send :size="16" />
          {{ submitting ? 'Mengirim...' : 'Kirim Ucapan' }}
        </button>
      </form>

      <p v-if="successMessage" class="wish-status success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="wish-status error">{{ errorMessage }}</p>
    </div>

    <div>
      <p v-if="loading" class="wish-loading">Memuat ucapan...</p>
      <p v-else-if="wishes.length === 0" class="wish-empty">Belum ada ucapan. Jadilah yang pertama!</p>

      <div v-for="wish in pagedWishes" :key="wish.id" class="comment">
        <b>{{ wish.guestName }}</b>
        <p>{{ wish.message }}</p>
        <time>{{ formatDate(wish.createdAt) }}</time>
      </div>

      <nav v-if="wishes.length > 0" class="pagination">
        <button
          v-for="page in pageNumbers"
          :key="String(page) + currentPage"
          :class="{ active: page === currentPage }"
          :disabled="page === 'ellipsis'"
          @click="typeof page === 'number' && (currentPage = page)"
        >
          {{ page === 'ellipsis' ? '...' : page }}
        </button>
      </nav>
    </div>
  </section>
</template>