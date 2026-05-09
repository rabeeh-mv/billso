import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin((nuxtApp) => {
  const config = {
    apiKey: "AIzaSyAGPtQBw1hTe1-7LQIqA2SGyQqRYrzupGg",
    authDomain: "billso-f75b4.firebaseapp.com",
    projectId: "billso-f75b4",
    storageBucket: "billso-f75b4.firebasestorage.app",
    messagingSenderId: "626361609902",
    appId: "1:626361609902:web:90a3afa5b7807e6cc6473f",
    measurementId: "G-VNRM1V425E"
  }

  const app = initializeApp(config)
  const auth = getAuth(app)
  const db = getFirestore(app)

  return {
    provide: {
      auth,
      db
    }
  }
})
