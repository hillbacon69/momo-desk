/** Crypto session preset for Momo Desk.
 *  When session === Crypto, keep tape rows that have a dated catalyst in 14d
 *  (live watch-flows count). Does not invent quotes.
 */
import { annotateTape, type TapeRow } from "@/data/catalysts";
import { cryptoSessionFilter } from "@/data/catalyst-extra";

export const CRYPTO_SESSION_DAYS = 14;

export function applyCryptoSession<T extends TapeRow>(rows: T[], active: boolean): T[] {
  if (!active) return rows;
  return cryptoSessionFilter(rows, CRYPTO_SESSION_DAYS);
}

export function scoreCryptoTape<T extends TapeRow>(rows: T[]) {
  return annotateTape(rows);
}
