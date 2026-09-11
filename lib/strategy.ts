/**
 * ICT + SMC confluence model.
 *
 * Rather than running ICT and SMC as two separate strategies, this treats
 * them as one shared vocabulary (structure, liquidity, order blocks, FVGs,
 * premium/discount) and requires confluence across the steps below before
 * a signal counts as valid. This is intentionally strict: a partial match
 * (e.g. a liquidity sweep with no confirmed structure shift) does NOT fire.
 *
 * This module expects pre-computed candle/structure data — wire it to your
 * MT4/MT5 price feed (via the connector in mt5Connector.ts) upstream.
 */

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface StructurePoint {
  time: number;
  price: number;
  type: "swing_high" | "swing_low";
}

export interface ConfluenceResult {
  valid: boolean;
  bias: "bullish" | "bearish" | null;
  criteriaMatched: string[];
  entryZone: { low: number; high: number } | null;
}

interface DetectionInput {
  htfBias: "bullish" | "bearish"; // higher-timeframe structure direction
  recentSweep: StructurePoint | null; // liquidity sweep on the lower timeframe
  structureShift: "bos" | "choch" | null; // confirmed after the sweep
  orderBlock: { low: number; high: number } | null; // OB formed during the shift
  fairValueGap: { low: number; high: number } | null; // FVG formed during the shift
  currentPrice: number;
  rangeHigh: number; // for premium/discount calc
  rangeLow: number;
}

export function detectConfluence(input: DetectionInput): ConfluenceResult {
  const criteria: string[] = [];

  if (!input.recentSweep || !input.structureShift) {
    return { valid: false, bias: null, criteriaMatched: [], entryZone: null };
  }
  criteria.push("liquidity_sweep");
  criteria.push(input.structureShift === "choch" ? "choch" : "bos");

  const bias: "bullish" | "bearish" =
    input.recentSweep.type === "swing_low" ? "bullish" : "bearish";

  if (bias !== input.htfBias) {
    // Countertrend confluence is deliberately excluded — professional ICT/SMC
    // application trades with higher-timeframe bias, not against it.
    return { valid: false, bias: null, criteriaMatched: criteria, entryZone: null };
  }
  criteria.push("htf_bias_aligned");

  const zone = input.orderBlock ?? input.fairValueGap;
  if (!zone) {
    return { valid: false, bias: null, criteriaMatched: criteria, entryZone: null };
  }
  criteria.push(input.orderBlock ? "order_block" : "fair_value_gap");

  const equilibrium = (input.rangeHigh + input.rangeLow) / 2;
  const inDiscount = input.currentPrice < equilibrium;
  const inPremium = input.currentPrice > equilibrium;

  if (bias === "bullish" && !inDiscount) {
    return { valid: false, bias, criteriaMatched: criteria, entryZone: null };
  }
  if (bias === "bearish" && !inPremium) {
    return { valid: false, bias, criteriaMatched: criteria, entryZone: null };
  }
  criteria.push(bias === "bullish" ? "discount_zone" : "premium_zone");

  return { valid: true, bias, criteriaMatched: criteria, entryZone: zone };
}
