use wasm_bindgen::prelude::*;
use sp1::Prover;

#[wasm_bindgen]
pub fn verify_dealer_move(dealer_hand: Vec<u8>) -> bool {
    let dealer_score: u8 = dealer_hand.iter().sum();
    let prover = Prover::new();
    prover.prove(dealer_score >= 17)
}
