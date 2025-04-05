use anchor_lang::prelude::*;

declare_id!("FbX6SrRSVZSFvY6oPcknRiCBDwPwuA8YgHXB22WW5YT6");

#[program]
pub mod program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
