import create, { State } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface UserSOLBalanceStore extends State {
  balance: number
  imageUrl: string
  randomUrl: string
  getUserSOLBalance: (publicKey: PublicKey, connection: Connection) => void
  setImageUrl: (newUrl: string) => void
  setRandomUrl: (newUrl: string) => void
}

const useUserSOLBalanceStore = create<UserSOLBalanceStore>((set, _get) => ({
  balance: 0,
  imageUrl: '',
  randomUrl: '',
  getUserSOLBalance: async (publicKey, connection) => {
    let balance = 0
    try {
      balance = await connection.getBalance(publicKey, 'confirmed')
      balance = balance / LAMPORTS_PER_SOL
    } catch (e) {
      console.log(`error getting balance: `, e)
    }
    set((s) => {
      s.balance = balance
      console.log(`balance updated, `, balance)
    })
  },
  setImageUrl: (newUrl) =>
    set((prev) => ({
      imageUrl: newUrl,
    })),
  setRandomUrl: (newUrl) =>
    set((prev) => ({
      randomUrl: newUrl,
    })),
}))

export default useUserSOLBalanceStore
