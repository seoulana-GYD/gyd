use anchor_lang::prelude::*;
use anchor_spl::{ associated_token::AssociatedToken, token::{ Mint, Token, TokenAccount } };

declare_id!("7nLFD23KKdVb82fJDJEDgQ1N6ZBy1AsW5e5R9Vizc6VF");

#[program]
pub mod spl_example {
    use anchor_spl::token::{ mint_to, transfer, MintTo, MintToBumps, Transfer };

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, uri: String) -> Result<()> {
        msg!("Greetings from: init");

        let valut_data = &mut ctx.accounts.valut_data;
        valut_data.bump = ctx.bumps.valut_data;
        valut_data.creator = ctx.accounts.signer.key();
        valut_data.uri = uri;

        let bump = ctx.bumps.valut_data;
        let signer_key = ctx.accounts.signer.key();

        let signer_seeds: &[&[&[u8]]] = &[&[b"valut_data", signer_key.as_ref(), &[bump]]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.new_mint.to_account_info(),
                to: ctx.accounts.new_valut.to_account_info(),
                authority: ctx.accounts.valut_data.to_account_info(),
            },
            signer_seeds
        );

        mint_to(cpi_context, 1)?;

        Ok(())
    }

    pub fn grab(ctx: Context<Grab>) -> Result<()> {
        msg!("Greetings from: grab");
        let valut_data = &ctx.accounts.valut_data;

        let bump = valut_data.bump;
        let signer_key = valut_data.creator;

        let signer_seeds: &[&[&[u8]]] = &[&[b"valut_data", signer_key.as_ref(), &[bump]]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.new_valut.to_account_info(),
                to: ctx.accounts.signer_vault.to_account_info(),
                authority: ctx.accounts.valut_data.to_account_info(),
            },
            signer_seeds
        );

        transfer(cpi_context, 1)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = 8 + ValutData::INIT_SPACE, // Anchor discriminator (8 bytes) + 구조체 크기
        seeds = [b"valut_data", signer.key().as_ref()],
        bump
    )]
    pub valut_data: Account<'info, ValutData>,

    #[account(
        init,
        payer = signer,
        seeds = [b"mint", signer.key().as_ref()],
        bump,
        mint::decimals = 0,
        mint::authority = valut_data
    )]
    pub new_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = signer,
        associated_token::mint = new_mint,
        associated_token::authority = valut_data
    )]
    pub new_valut: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct Grab<'info> {
    pub signer: Signer<'info>,

    #[account(seeds = [b"valut_data", valut_data.creator.key().as_ref()], bump = valut_data.bump)]
    pub valut_data: Account<'info, ValutData>,

    #[account(
        seeds = [b"mint", valut_data.creator.as_ref()],
        bump,
        mint::decimals = 0,
        mint::authority = valut_data
    )]
    pub mint: Account<'info, Mint>,
    #[account(mut, associated_token::mint = mint, associated_token::authority = valut_data)]
    pub new_valut: Account<'info, TokenAccount>,

    #[account(mut, associated_token::mint = mint, associated_token::authority = signer)]
    pub signer_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[account]
pub struct ValutData {
    pub creator: Pubkey, // 32 bytes
    pub bump: u8, // 1 byte
    pub uri: String, // 4 bytes (length prefix) + 200 bytes (최대 길이)
}

impl ValutData {
    pub const INIT_SPACE: usize = 32 + 1 + 4 + 200; // 총 크기: 237 bytes
}
