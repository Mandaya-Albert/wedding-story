import type { Firestore } from 'firebase/firestore'

declare module '#app' {
  interface NuxtApp {
    $firestore: Firestore
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $firestore: Firestore
  }
}

export {}