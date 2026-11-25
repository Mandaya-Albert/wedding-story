import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Firestore
} from 'firebase/firestore'

export interface Wish {
  id: string
  guestName: string
  message: string
  createdAt: Date | null
}

export interface CreateWishPayload {
  guestName: string
  message: string
}

const COLLECTION_NAME = 'Comment-Store'

export const wishService = {

  // Mengirim komentar
  async create(
    db: Firestore,
    payload: CreateWishPayload
  ) {
    const guestName = payload.guestName.trim()
    const message = payload.message.trim()

    if (guestName.length < 2 || guestName.length > 50) {
      throw new Error('Nama harus terdiri dari 2-50 karakter')
    }

    if (!message || message.length > 500) {
      throw new Error('Ucapan harus terdiri dari 1-500 karakter')
    }

    return await addDoc(
      collection(db, COLLECTION_NAME),
      {
        guestName,
        message,
        createdAt: serverTimestamp()
      }
    )
  },

  // Mendengarkan komentar secara realtime
  subscribe(
    db: Firestore,
    callback: (wishes: Wish[]) => void,
    onError?: (error: Error) => void
  ) {
    const wishesQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(20)
    )

    return onSnapshot(
      wishesQuery,
      (snapshot) => {
        const wishes: Wish[] = snapshot.docs.map((doc) => {
          const data = doc.data()

          return {
            id: doc.id,
            guestName: data.guestName,
            message: data.message,
            createdAt: data.createdAt?.toDate() ?? null
          }
        })

        callback(wishes)
      },
      (error) => {
        onError?.(error)
      }
    )
  }
}