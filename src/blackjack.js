import { verifyDealerMove } from "./wasm-loader";

export function checkDealer(dealerHand) {
    return verifyDealerMove(dealerHand);
}
