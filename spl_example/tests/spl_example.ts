import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SplExample } from "../target/types/spl_example";
import * as splToken from "@solana/spl-token"

// describe("spl_example", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const program = anchor.workspace.SplExample as Program<SplExample>;


//   let signer1 = anchor.web3.Keypair.generate();
//   let signer2 = anchor.web3.Keypair.generate();


//   it("initialize", async () => {
//     await airdrop(program.provider.connection, signer1.publicKey, 500_000_000_000);

//     let [vault_data, bump_a] = anchor.web3.PublicKey.findProgramAddressSync(
//       [Buffer.from("valut_data"), signer1.publicKey.toBuffer()],
//       program.programId
//     );

//     let [new_mint, bump_m] = anchor.web3.PublicKey.findProgramAddressSync(
//       [Buffer.from("mint"), signer1.publicKey.toBuffer()],
//       program.programId
//     );

//     let new_vault = splToken.getAssociatedTokenAddressSync(
//       new_mint,
//       vault_data,
//       true
//     );

//     console.log("new valut", new_vault.toString());
//     console.log("authority", vault_data.toString());
//     console.log("new mint", new_mint.toString());
//     console.log("signer", signer1.publicKey.toString());





//     const tx = await program.methods.initialize("niggleniggleniggleniggle").accounts({
//       signer : signer1.publicKey,
//       valutData : vault_data,
//       newMint :     new_mint,
//       newValut : new_vault,
//       systemProgram :  anchor.web3.SystemProgram.programId,
//       tokenProgram : splToken.TOKEN_PROGRAM_ID,
//       associatedTokenProgram : splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
//     }).signers([signer1]).rpc();

//     console.log("Your transaction signature", tx);
//   });

//   // it("grab", async () => {
//   //   await airdrop(program.provider.connection, signer2.publicKey, 500_000_000_000);




//   //   let [vault_data, bump_a] = anchor.web3.PublicKey.findProgramAddressSync(
//   //     [Buffer.from("valut_data"), signer1.publicKey.toBuffer()],
//   //     program.programId
//   //   );

//   //   let [new_mint, bump_m] = anchor.web3.PublicKey.findProgramAddressSync(
//   //     [Buffer.from("mint"), signer1.publicKey.toBuffer()],
//   //     program.programId
//   //   );

//   //   let new_vault = splToken.getAssociatedTokenAddressSync(
//   //     new_mint,
//   //     vault_data,
//   //     true
//   //   );


//   //   let signer_vault = await splToken.createAssociatedTokenAccount(
//   //     program.provider.connection,
//   //     signer2,
//   //     new_mint,
//   //     signer2.publicKey
//   //   )


//   //   console.log("signer_vault", signer_vault.toString());



//   //   const tx = await program.methods.grab().accounts({
//   //     signer : signer2.publicKey,
//   //     valutData : vault_data,
//   //     mint : new_mint,
//   //     newValut : new_vault,
//   //     signerVault : signer_vault,
//   //     tokenProgram : splToken.TOKEN_PROGRAM_ID,
//   //   }).signers([signer2]).rpc();

//   //   console.log("Your transaction signature", tx);
//   // });
// });

describe("devnet_init_transaction", () => {
  // Configure the client to use the local cluster.

  const connection = new anchor.web3.Connection("https://api.devnet.solana.com", "confirmed");
  const wallet = (anchor.AnchorProvider.local().wallet as anchor.Wallet);
  const provider = new anchor.AnchorProvider(connection, wallet, {commitment: "confirmed"});
  anchor.setProvider(provider);

  const program = anchor.workspace.SplExample as Program<SplExample>;



  it("initialize", async () => {
    console.log("Connected to Devent with saved wallet");

    const signer1 = wallet.payer;  // NodeWallet을 사용하면 payer로 접근해야 함

    let [vault_data, bump_a] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("valut_data"), signer1.publicKey.toBuffer()],
      program.programId
    );

    let [new_mint, bump_m] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("mint"), signer1.publicKey.toBuffer()],
      program.programId
    );

    let new_vault = splToken.getAssociatedTokenAddressSync(
      new_mint,
      vault_data,
      true
    );

    console.log("new valut", new_vault.toString());
    console.log("authority", vault_data.toString());
    console.log("new mint", new_mint.toString());
    console.log("signer", signer1.publicKey.toString());





    const tx = await program.methods.initialize("niggleniggleniggleniggle").accounts({
      signer : signer1.publicKey,
      valutData : vault_data,
      newMint :     new_mint,
      newValut : new_vault,
      systemProgram :  anchor.web3.SystemProgram.programId,
      tokenProgram : splToken.TOKEN_PROGRAM_ID,
      associatedTokenProgram : splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    }).signers([signer1]).rpc();

    console.log("Your transaction signature", tx);
  });

  // it("grab", async () => {
  //   await airdrop(program.provider.connection, signer2.publicKey, 500_000_000_000);




  //   let [vault_data, bump_a] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("valut_data"), signer1.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   let [new_mint, bump_m] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("mint"), signer1.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   let new_vault = splToken.getAssociatedTokenAddressSync(
  //     new_mint,
  //     vault_data,
  //     true
  //   );


  //   let signer_vault = await splToken.createAssociatedTokenAccount(
  //     program.provider.connection,
  //     signer2,
  //     new_mint,
  //     signer2.publicKey
  //   )


  //   console.log("signer_vault", signer_vault.toString());



  //   const tx = await program.methods.grab().accounts({
  //     signer : signer2.publicKey,
  //     valutData : vault_data,
  //     mint : new_mint,
  //     newValut : new_vault,
  //     signerVault : signer_vault,
  //     tokenProgram : splToken.TOKEN_PROGRAM_ID,
  //   }).signers([signer2]).rpc();

  //   console.log("Your transaction signature", tx);
  // });
});


// export async function airdrop(
//   connection: any,
//   address : any,
//   amount = 500_000_000_000
// ) {
//   await connection.confirmTransaction(
//     await connection.requestAirdrop(address, amount),
//     'confirmed'
//   )
// }