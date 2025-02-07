// /src/app/bets/page.tsx
"use client";
import { useState, FormEvent, useEffect } from "react";
import styles from "./page.module.sass";
import { useParimutuelBetting } from "../../hooks/useParimutuelBetting";
import { useSwap } from "../../hooks/useSwap";

export default function BetsPage() {
  // short-lowercase comments
  const {
    userBalance,
    deposit,
    withdrawBalance,
    placeBet,
    //getRaceDetails,
    races,
    refreshRaces,
  } = useParimutuelBetting();

  const { swapTokensForUsdc } = useSwap();

  const [depositAmount, setDepositAmount] = useState<string>("");
  const [betRaceId, setBetRaceId] = useState<string>("");
  const [racerId, setRacerId] = useState<string>("");
  const [betAmount, setBetAmount] = useState<string>("");

  const [fromToken, setFromToken] = useState<string>("");
  const [swapAmount, setSwapAmount] = useState<string>("");

  useEffect(() => {
    refreshRaces();
  }, [refreshRaces]);

  // handle deposit
  async function handleDeposit(e: FormEvent) {
    e.preventDefault();
    if (!depositAmount) return;
    await deposit(depositAmount);
    setDepositAmount("");
  }

  // handle withdraw
  async function handleWithdraw(e: FormEvent) {
    e.preventDefault();
    await withdrawBalance();
  }

  // handle bet
  async function handleBet(e: FormEvent) {
    e.preventDefault();
    if (!betRaceId || !racerId || !betAmount) return;
    await placeBet(Number(betRaceId), Number(racerId), betAmount);
  }

  // handle swap
  async function handleSwap(e: FormEvent) {
    e.preventDefault();
    if (!fromToken || !swapAmount) return;
    await swapTokensForUsdc(fromToken, swapAmount);
    setFromToken("");
    setSwapAmount("");
  }

  return (
    <div className={styles.betContainer}>
      <h2>bet area</h2>
      <p>your internal balance: {userBalance} usdc</p>

      <form onSubmit={handleDeposit} className={styles.formRow}>
        <label>deposit usdc</label>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <button className={styles.button} type="submit">
          deposit
        </button>
      </form>

      <form onSubmit={handleWithdraw} className={styles.formRow}>
        <button className={styles.button} type="submit">
          withdraw usdc balance
        </button>
      </form>

      <form onSubmit={handleBet} className={styles.formRow}>
        <label>race id</label>
        <input
          type="number"
          value={betRaceId}
          onChange={(e) => setBetRaceId(e.target.value)}
        />
        <label>racer id</label>
        <input
          type="number"
          value={racerId}
          onChange={(e) => setRacerId(e.target.value)}
        />
        <label>bet amount (usdc)</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
        <button className={styles.button} type="submit">
          place bet
        </button>
      </form>

      <h3>active races</h3>
      {races.map((r) => (
        <div key={r.raceId}>
          <p>race id: {r.raceId}</p>
          <p>status: {r.status}</p>
          <p>total pool: {r.totalPool}</p>
          <hr />
        </div>
      ))}

      <div className={styles.swapSection}>
        <h3>swap tokens for usdc</h3>
        <form onSubmit={handleSwap} className={styles.formRow}>
          <label>token address to swap from</label>
          <input
            type="text"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          />
          <label>amount of tokens to swap</label>
          <input
            type="number"
            value={swapAmount}
            onChange={(e) => setSwapAmount(e.target.value)}
          />
          <button className={styles.button} type="submit">
            swap
          </button>
        </form>
      </div>
    </div>
  );
}
