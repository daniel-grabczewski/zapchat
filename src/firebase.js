import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.ZAP_CHAT_FIREBASE_API_KEY,
  authDomain: process.env.ZAP_CHAT_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.ZAP_CHAT_FIREBASE_PROJECT_ID,
  storageBucket: process.env.ZAP_CHAT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.ZAP_CHAT_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.ZAP_CHAT_FIREBASE_APP_ID,
  measurementId: process.env.ZAP_CHAT_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const storage = getStorage()
export const db = getFirestore()
