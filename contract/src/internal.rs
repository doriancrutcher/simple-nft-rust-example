use crate::*;
use near_sdk::{log, CryptoHash};

pub(crate) fn refund_deposit(
    initial_storage: u64,
    storage_used: u64,
    receiver_id: Option<AccountId>,
) {
    let refund = if storage_used > initial_storage {
        env::attached_deposit()
            .checked_sub(env::storage_byte_cost() * Balance::from(storage_used - initial_storage))
            .expect("Insufficient deposit to pay for storage")
    } else {
        env::attached_deposit()
            + env::storage_byte_cost() * Balance::from(initial_storage - storage_used)
    };

    if refund > 1 {
        Promise::new(receiver_id.unwrap_or_else(env::predecessor_account_id)).transfer(refund);
    }
}

pub(crate) fn assert_at_least_one_yocto() {
    assert!(
        env::attached_deposit() >= 1,
        "Requires attached deposit of at least 1 yoctoNEAR",
    )
}
