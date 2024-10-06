module 0x1::TokenManager {
    use 0x1::coin;
    use 0x1::account;
    
    // Event to log token transfer
    struct TokensDoubledEvent {
        to: address,
        amount: u64,
    }
    
    public fun double_tokens(account_address: address) {
        // Check if the account exists
        assert!(account::exists(account_address), 0);

        // Get the current balance
        let balance = coin::balance<0x1::aptos_coin::AptosCoin>(account_address);

        // Calculate the amount to double
        let amount_to_add = balance;

        // Transfer the tokens to the user's account
        coin::transfer(amount_to_add, account_address);
        
        // Log the event for doubling tokens
        emit TokensDoubledEvent {
            to: account_address,
            amount: amount_to_add,
        };
    }
}