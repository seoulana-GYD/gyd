'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js'
import { FC, useCallback, useState } from 'react'
import { notify } from '../utils/notifications'
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Bank } from './bank'
import idl from './bank.json'
import * as splToken from '@solana/spl-token'

import {
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  // createGenericFile,
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
  sol,
} from '@metaplex-foundation/umi'
import { mockStorage } from '@metaplex-foundation/umi-storage-mock'
// import * as fs from "node:fs";
import secret from './id.json'
import { useRouter } from 'next/navigation'
//import { sign } from 'node:crypto'

const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)

// Devnet RPC URL
const DEVNET_URL = 'https://api.devnet.solana.com'
const programID = new PublicKey('7nLFD23KKdVb82fJDJEDgQ1N6ZBy1AsW5e5R9Vizc6VF')

const umi = createUmi(DEVNET_URL)

const creatorWallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(secret)
)
const creator = createSignerFromKeypair(umi, creatorWallet)
umi.use(keypairIdentity(creator))
umi.use(mplTokenMetadata())
umi.use(mockStorage())

const nftDetail = {
  name: 'AI genrated NFT',
  symbol: 'AINFT',
  uri: 'https://img.freepik.com/free-vector/cute-comic-shiba-inu-different-poses-vector-illustrations-set-dog-cartoon-character-standing-sitting-symbol-2018-isolated-white-background-pets-domestic-animals-new-year-concept_74855-24437.jpg?t=st=1743857219~exp=1743860819~hmac=98b2c44bac430d8710abfe062e1163f7ce25cbf1ee7a0125bb1c42221299f77c&w=826',
  royalties: 5.5,
  description: 'GYD NFT',
  imgType: 'image/png',
  attributes: [{ trait_type: 'Speed', value: 'Quick' }],
}

// 지갑 설정 (예시, Phantom 지갑 사용)
const getProvider = (connection: Connection, wallet: any) => {
  if (!wallet || !wallet.publicKey) {
    throw new Error('Wallet not connected!') // 에러 처리
  }

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  )
  return provider
}

async function mintNft(metadataUri: string) {
  try {
    const mint = generateSigner(umi)
    await createNft(umi, {
      mint,
      name: nftDetail.name,
      symbol: nftDetail.symbol,
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(nftDetail.royalties),
      creators: [{ address: creator.publicKey, verified: true, share: 100 }],
    }).sendAndConfirm(umi)
    console.log(`Created NFT: ${mint.publicKey.toString()}`)
  } catch (e) {
    throw e
  }
}

export const RequestGenerate: FC = () => {
  const { connection } = useConnection()
  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { getUserSOLBalance, imageUrl } = useUserSOLBalanceStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onClick = useCallback(async () => {
    if (!publicKey) {
      console.log('error', 'Wallet not connected!')
      // notify({
      //   type: 'error',
      //   message: 'error',
      //   description: 'Wallet not connected!',
      // })
      return
    }

    let signature: TransactionSignature = ''

    try {
      signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)

      // Get the lates block hash to use on our transaction and confirmation
      let latestBlockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        'confirmed'
      )

      notify({
        type: 'success',
        message: 'Airdrop successful!',
        txid: signature,
      })

      getUserSOLBalance(publicKey, connection)
    } catch (error: any) {
      notify({
        type: 'error',
        message: `Airdrop failed!`,
        description: error?.message,
        txid: signature,
      })
      console.log('error', `Airdrop failed! ${error?.message}`, signature)
    }
  }, [publicKey, connection, getUserSOLBalance])

  async function mintNft(metadataUri: string, receipt: PublicKey) {
    try {
      console.log('receipt', receipt)

      // 랜덤 숫자 생성 (1000부터 9999까지)
      const randomNum = Math.floor(Math.random() * 9000) + 1000

      // 기존 이름에 랜덤 숫자 추가
      const randomizedName = `${nftDetail.name} #${randomNum}`

      console.log('metadataUri', metadataUri)

      const mint = generateSigner(umi)
      await createNft(umi, {
        mint,
        name: randomizedName,
        symbol: nftDetail.symbol,
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(nftDetail.royalties),
        creators: [{ address: creator.publicKey, verified: true, share: 100 }],
        tokenOwner: receipt,
      }).sendAndConfirm(umi)

      console.log(`Created NFT: ${mint.publicKey.toString()}`)
    } catch (e) {
      throw e
    }
  }

  const createNFT = async () => {
    try {
      if (!publicKey) {
        console.error('Wallet not connected!')
        return
      }
      setLoading(true)
      // const anchProvider = getProvider(connection, { publicKey, signTransaction, signAllTransactions });
      // const program = new Program<Bank>(idl_object, anchProvider);

      // // Provider의 지갑을 signer로 설정
      const signer = publicKey
      // console.log("signer",signer)

      // // 필요한 PDA 및 ATA 계산
      // let [vaultData, bump_a] = PublicKey.findProgramAddressSync(
      //   [Buffer.from("valut_data"), signer.toBuffer()],
      //   program.programId
      // );

      // let [newMint, bump_m] = PublicKey.findProgramAddressSync(
      //   [Buffer.from("mint"), signer.toBuffer()],
      //   program.programId
      // );

      // let newVault = splToken.getAssociatedTokenAddressSync(
      //   newMint,
      //   vaultData,
      //   true
      // );

      // console.log("New Vault:", newVault.toString());
      // console.log("Authority:", vaultData.toString());
      // console.log("New Mint:", newMint.toString());
      // console.log("Signer:", signer.toString());

      // await program.methods
      //   .initialize(imageUrl) // or URL, depending on what you're passing
      //   .accounts({
      //     signer: signer,
      //     valutData: vaultData,
      //     newMint: newMint,
      //     newValut: newVault,
      //     systemProgram: SystemProgram.programId,
      //     tokenProgram: splToken.TOKEN_PROGRAM_ID,
      //     associatedTokenProgram: splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      //   })
      //   .signers([]) // Phantom 지갑 사용 시 signers 배열은 빈 배열로 설정
      //   .rpc();
      console.log('imageUri', imageUrl)
      console.log('signer', signer, signer.toString())
      const resNft = await mintNft(imageUrl, signer)
      console.log('resNft', resNft)
      console.log('Wow, new bank was created')
      router.push('/gachart')
    } catch (error) {
      console.error('Error while creating a bank: ' + error)
    } finally {
      setLoading(false)
    }
  }
  if (!imageUrl) return null

  return (
    <div className="flex flex-row justify-center">
      <div className="relative group items-center">
        <div
          className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                    rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
        ></div>

        <button
          className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          onClick={createNFT}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Converting...
            </span>
          ) : (
            <span>Generate </span>
          )}
        </button>
      </div>
    </div>
  )
}
