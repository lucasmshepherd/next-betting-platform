// /src/hooks/useParimutuelBetting.ts
"use client";

import { useState, useCallback } from "react";
import { ethers } from "ethers";

// short-lowercase comments
// place your contract abi and address here
import ParimutuelBettingAbi from "../abis/ParimutuelBetting.json";

const CONTRACT_ADDRESS = "0xYourContractAddressHere";

type RaceInfo = {
  raceId: number;
  status: number;
  totalPool: string;
  numberOfRacers: number;
  winner: number;
};

export function useParimutuelBetting() {
  const [userBalance, setUserBalance] = useState<string>("0");
  const [races, setRaces] = useState<RaceInfo[]>([]);
  const [houseTake, setHouseTake] = useState<number>(20);

  // assume user has metamask
  // get signer
  function getContract() {
    if (!window?.ethereum) {
      throw new Error("no wallet found");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ParimutuelBettingAbi, signer);
  }

  // deposit
  const deposit = useCallback(async (amtStr: string) => {
    const contract = getContract();
    const amt = ethers.parseUnits(amtStr, 6); // usdc 6 decimals
    const tx = await contract.deposit(amt);
    await tx.wait();
    // you could refresh user balance
    await refreshBalance();
  }, []);

  // withdraw
  const withdrawBalance = useCallback(async () => {
    const contract = getContract();
    const tx = await contract.withdrawBalance();
    await tx.wait();
    await refreshBalance();
  }, []);

  // place bet
  const placeBet = useCallback(
    async (raceId: number, racerId: number, amtStr: string) => {
      const contract = getContract();
      const amt = ethers.parseUnits(amtStr, 6);
      const tx = await contract.placeBet(raceId, racerId, amt);
      await tx.wait();
      await refreshBalance();
    },
    []
  );

  // create new race
  const startNewRace = useCallback(async (racers: number) => {
    const contract = getContract();
    const tx = await contract.startNewRace(racers);
    await tx.wait();
  }, []);

  // close
  const closeRace = useCallback(async (raceId: number) => {
    const contract = getContract();
    const tx = await contract.closeBetting(raceId);
    await tx.wait();
  }, []);

  // finish
  const finishRace = useCallback(async (raceId: number, winner: number) => {
    const contract = getContract();
    const tx = await contract.finishRace(raceId, winner);
    await tx.wait();
  }, []);

  // house take
  const updateHouseTake = useCallback(async (pct: number) => {
    const contract = getContract();
    const tx = await contract.updateHouseTakePercentage(pct);
    await tx.wait();
    setHouseTake(pct);
  }, []);

  // refresh user balance
  const refreshBalance = useCallback(async () => {
    const contract = getContract();
    const signerAddr = await contract.signer.getAddress();
    const bal = await contract.userBalances(signerAddr);
    // convert from bigint to normal
    setUserBalance(ethers.formatUnits(bal, 6));
  }, []);

  // fetch races
  const refreshRaces = useCallback(async () => {
    // for example, fetch 1.. nextRaceId-1
    const contract = getContract();
    const nextId = await contract.nextRaceId();
    const arr: RaceInfo[] = [];

    for (let i = 1; i < Number(nextId); i++) {
      const [status, racers, winner, totalPool] = await contract.getRaceDetails(
        i
      );
      arr.push({
        raceId: i,
        status,
        numberOfRacers: racers,
        winner,
        totalPool: ethers.formatUnits(totalPool, 6),
      });
    }
    setRaces(arr);
  }, []);

  return {
    userBalance,
    races,
    houseTake,
    deposit,
    withdrawBalance,
    placeBet,
    startNewRace,
    closeRace,
    finishRace,
    updateHouseTake,
    refreshBalance,
    refreshRaces,
  };
}
