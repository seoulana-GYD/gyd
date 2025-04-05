use anchor_lang::prelude::*;

declare_id!("wexS9A7Z6dHVPyKqPYAkyXJ5sGYqDSfe5nwP2gEbBWG");

#[program]
pub mod solana_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
