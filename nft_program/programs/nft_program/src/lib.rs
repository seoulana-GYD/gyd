use anchor_lang::prelude::*;

declare_id!("3V8PxsbSh8b39HTAxpWc3GdpoVSG1AsP9z7jXYLgsQhL");

#[program]
pub mod nft_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
