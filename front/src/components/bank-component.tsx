import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { FC, useEffect, useRef, useState } from 'react'
import { notify } from '../utils/notifications'

import { Program, AnchorProvider, setProvider } from '@coral-xyz/anchor'
import idl from './bank.json'
import { Bank } from './bank'
import { PublicKey } from '@solana/web3.js'
import diceAnimation from './dice.json'
import Lottie from 'lottie-react'
import useUserSOLBalanceStore from 'stores/useUserSOLBalanceStore'
import { useWindowSize } from 'react-use' // 창 크기 가져오려면 필요
import Confetti from 'react-confetti'

const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)
const programID = new PublicKey(idl.address)

export const BankComponent: FC = () => {
  const ourWallet = useWallet()
  const { connection } = useConnection()
  const { imageUrl, setRandomUrl } = useUserSOLBalanceStore()
  // const [banks, setBanks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showconfetti, setShowconfetti] = useState(false)
  const lottieRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { width, height } = useWindowSize()

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      //@ts-ignore
      ourWallet,
      AnchorProvider.defaultOptions()
    )
    setProvider(provider)
    return provider
  }
  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        lottieRef.current?.setSpeed(0.6)
        lottieRef.current?.play()
      }, 100) // 💡 Lottie 렌더링 이후 실행
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [showModal])

  // const createBank = async () => {
  //   try {
  //     const anchProvider = getProvider()
  //     const program = new Program<Bank>(idl_object, anchProvider)

  //     await program.methods
  //       .create('New Bank')
  //       .accounts({
  //         user: anchProvider.publicKey,
  //       })
  //       .rpc()

  //     console.log('Wow, new bank was created')
  //   } catch (error) {
  //     console.error('Error while creating a bank: ' + error)
  //   }
  // }

  const rollMatch = async () => {
    try {
      setShowModal(true)
      let timer = setTimeout(() => {
        setShowModal(false)
        setRandomUrl('/doge.png')
        setShowconfetti(true)
        notify({
          type: 'success',
          message: "You've Been Matched successful! 🎉",
          // txid: signature,
        })
      }, 5000)
      // clearTimeout(timer)
    } catch (error) {
      console.error('Error: ' + error)
    }
  }

  // const depositBank = async (publicKey) => {
  //   try {
  //     const anchProvider = getProvider()
  //     const program = new Program<Bank>(idl_object, anchProvider)

  //     await program.methods
  //       .deposit(new BN(0.1 * web3.LAMPORTS_PER_SOL))
  //       .accounts({
  //         bank: publicKey,
  //         user: anchProvider.publicKey,
  //       })
  //       .rpc()

  //     console.log(' Deposit done: ' + publicKey)
  //   } catch (error) {
  //     console.error('Error while depositing to a bank: ' + error)
  //   }
  // }

  return (
    <div>
      {/* {banks.map((bank) => {
        return (
          <div className="md:hero-content flex flex-col">
            <h1>{bank.name.toString()}</h1>
            <span>{bank.balance.toString()}</span>
            <button
              className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
              onClick={() => depositBank(bank.pubkey)}
            >
              <span>Deposit 0.1</span>
            </button>
          </div>
        )
      })} */}
      <div className="flex flex-row justify-center">
        <div className="relative group items-center">
          <div
            className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
          ></div>
          {/* <button
            className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
            onClick={createBank}
          >
            <div className="hidden group-disabled:block">
              Wallet not connected
            </div>
            <span className="block group-disabled:hidden">Create Bank</span>
          </button> */}
          <button
            className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
            onClick={rollMatch}
          >
            <div className="hidden group-disabled:block">
              Wallet not connected
            </div>
            {!showModal && (
              <span className="block group-disabled:hidden">
                Roll the Match
              </span>
            )}
          </button>
        </div>
      </div>
      {showModal && (
        <dialog className="modal modal-open bg-transparent">
          <div className="modal-box bg-transparent shadow-none flex flex-col items-center">
            <h3 className="font-bold text-lg mb-4">Matching...</h3>
            <Lottie
              lottieRef={lottieRef}
              animationData={diceAnimation}
              loop
              autoplay={false}
            />
          </div>
        </dialog>
      )}
      {showconfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={200}
          recycle={false} // 한 번만 터지게
        />
      )}
    </div>
  )
}
