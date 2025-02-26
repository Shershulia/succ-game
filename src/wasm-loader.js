import init, { verify_dealer_move } from "../wasm/pkg/blackjack_wasm.js";

export async function initWasm() {
    await init();
}

export function verifyDealerMove(dealerHand) {
    return verify_dealer_move(dealerHand);
}
