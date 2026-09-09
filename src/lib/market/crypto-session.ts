/** Crypto session preset for Momo Desk.
 *  When session === Crypto, keep tape rows that have a dated catalyst in 14d
 *  (live watch-flows count). Does not invent quotes.
 */
import { cryptoSessionFilter, annotateTape, type TapeRow } from "@/data/catalysts";

export const CRYPTO_SESSION_DAYS = 14;

export function applyCryptoSession<T extends TapeRow>(rows: T[], active: boolean): T[] {
  if (!active) return rows;
  return cryptoSessionFilter(rows, CRYPTO_SESSION_DAYS);
}

export function scoreCryptoTape<T extends TapeRow>(rows: T[]) {
  return annotateTape(rows);
}
