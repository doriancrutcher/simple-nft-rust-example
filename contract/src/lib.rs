/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use env::predecessor_account_id;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::BorshStorageKey;
use near_sdk::{env, near_bindgen, setup_alloc};

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Welcome {
    records: LookupMap<String, String>,
    token_id_count: LookupMap<String, u128>,
    user_key_id_vec: LookupMap<String, Vec<u128>>,
    id_key_drawing_val: LookupMap<u128, String>,
    id_key_drawing_name: LookupMap<u128, String>,
}

// Helper structure to for keys of the persistent collections
#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKey {
    UserIdVec,
    DrawingStorage,
    TokenIdCount,
    DrawingName,
}

impl Default for Welcome {
    fn default() -> Self {
        Self {
            records: LookupMap::new(b"a".to_vec()),
            token_id_count: LookupMap::new(StorageKey::TokenIdCount),
            user_key_id_vec: LookupMap::new(StorageKey::UserIdVec),
            id_key_drawing_val: LookupMap::new(StorageKey::DrawingStorage),
            id_key_drawing_name: LookupMap::new(StorageKey::DrawingName),
        }
    }
}

#[near_bindgen]
impl Welcome {
    pub fn set_greeting(&mut self, message: String) {
        let account_id = env::signer_account_id();

        // Use env::log to record logs permanently to the blockchain!
        env::log(format!("Saving greeting '{}' for account '{}'", message, account_id,).as_bytes());

        self.records.insert(&account_id, &message);
    }

    // `match` is similar to `switch` in other languages; here we use it to default to "Hello" if
    // self.records.get(&account_id) is not yet defined.
    // Learn more: https://doc.rust-lang.org/book/ch06-02-match.html#matching-with-optiont
    pub fn get_greeting(&self, account_id: String) -> String {
        match self.records.get(&account_id) {
            Some(greeting) => greeting,
            None => "Hello".to_string(),
        }
    }

    pub fn add_token(&mut self, user: String, drawing_data: String, drawing_name: String) {
        let token_key: String = String::from("All Keys");

        // update token Id Count

        let mut temp_count = 0;

        let id_result = self.token_id_count.get(&token_key);

        match id_result {
            Some(x) => temp_count = x,
            None => println!("no previous token found setting count to 1"),
        }

        temp_count = temp_count + 1;
        self.token_id_count.insert(&token_key, &temp_count);

        // update token ID by user

        let mut current_array: Vec<u128> = vec![];

        let array_result = self.user_key_id_vec.get(&user);

        match array_result {
            Some(array_result) => current_array = array_result,
            None => println!("adding first token to user array"),
        }
        current_array.push(temp_count);

        self.user_key_id_vec.insert(&user, &current_array);

        // store drawing info with corresponding token id

        self.id_key_drawing_val.insert(&temp_count, &drawing_data);

        self.id_key_drawing_name.insert(&temp_count, &drawing_name);
    }

    // retrieving token drawing data
    pub fn get_token(&self, token_id: u128) -> String {
        let result = self.id_key_drawing_val.get(&token_id);

        let output;

        match result {
            Some(x) => output = x,
            None => output = String::from("s: &str"),
        };
        output
    }

    // retrieving owners token array list
    pub fn get_user_token_array(&self, user: String) -> Vec<u128> {
        let signer_id = &user;
        println!("{:?}", &signer_id);
        let mut output = vec![];

        let result = self.user_key_id_vec.get(&signer_id);

        match result {
            Some(x) => output = x,
            None => println!("data not found "),
        }

        output
    }

    // retrieving total token count
    pub fn get_total_number_of_tokens(&self) -> u128 {
        let token_key: String = String::from("All Keys");

        let result = self.token_id_count.get(&token_key);

        let mut output = 0;

        match result {
            Some(x) => output = x,
            None => println!("no data to be found output set to 0"),
        }

        output
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn set_then_get_greeting() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Welcome::default();
        contract.set_greeting("howdy".to_string());
        assert_eq!(
            "howdy".to_string(),
            contract.get_greeting("bob_near".to_string())
        );
    }

    #[test]
    fn get_default_greeting() {
        let context = get_context(vec![], true);
        testing_env!(context);
        let contract = Welcome::default();
        // this test did not call set_greeting so should return the default "Hello" greeting
        assert_eq!(
            "Hello".to_string(),
            contract.get_greeting("francis.near".to_string())
        );
    }
}
