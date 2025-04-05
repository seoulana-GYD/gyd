import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionSignature } from '@solana/web3.js'
import { FC, useCallback } from 'react'
import { notify } from '../utils/notifications'
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Bank } from './bank'
import idl from './bank.json'
import * as splToken from "@solana/spl-token";




const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)

// Devnet RPC URL
const DEVNET_URL = "https://api.devnet.solana.com";
const programID = new PublicKey("7nLFD23KKdVb82fJDJEDgQ1N6ZBy1AsW5e5R9Vizc6VF");


// 지갑 설정 (예시, Phantom 지갑 사용)
const getProvider = (connection: Connection, wallet: any) => {
  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet not connected!"); // 에러 처리
  }

  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  return provider;
};

export const RequestGenerate: FC = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { getUserSOLBalance,  imageUrl } = useUserSOLBalanceStore()
  

  const onClick = useCallback(async () => {
    if (!publicKey) {
      console.log('error', 'Wallet not connected!')
      notify({
        type: 'error',
        message: 'error',
        description: 'Wallet not connected!',
      })
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


  const createNFT = async () => {
    try {
      if (!publicKey) {
        console.error('Wallet not connected!');
        return;
      }
  
      const anchProvider = getProvider(connection, { publicKey, signTransaction, signAllTransactions });
      const program = new Program<Bank>(idl_object, anchProvider);
  
      // Provider의 지갑을 signer로 설정
      const signer = publicKey;
  
      // 필요한 PDA 및 ATA 계산
      let [vaultData, bump_a] = PublicKey.findProgramAddressSync(
        [Buffer.from("valut_data"), signer.toBuffer()],
        program.programId
      );
  
      let [newMint, bump_m] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint"), signer.toBuffer()],
        program.programId
      );
  
      let newVault = splToken.getAssociatedTokenAddressSync(
        newMint,
        vaultData,
        true
      );
  
      console.log("New Vault:", newVault.toString());
      console.log("Authority:", vaultData.toString());
      console.log("New Mint:", newMint.toString());
      console.log("Signer:", signer.toString());
  
      await program.methods
        .initialize(imageUrl) // or URL, depending on what you're passing
        .accounts({
          signer: signer,
          valutData: vaultData,
          newMint: newMint,
          newValut: newVault,
          systemProgram: SystemProgram.programId,
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
          associatedTokenProgram: splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([]) // Phantom 지갑 사용 시 signers 배열은 빈 배열로 설정
        .rpc();
  
      console.log("Wow, new bank was created");
    } catch (error) {
      console.error('Error while creating a bank: ' + error);
    }
  };


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
          <span>Generate </span>
        </button>
      </div>
    </div>
  )
}
