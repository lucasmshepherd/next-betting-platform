"use client";

import { useState, useCallback } from "react";
import { ethers, InterfaceAbi } from "ethers";

// import contract abi and address
import ParimutuelBetting from "../abis/ParimutuelBetting.json" assert { type: "json" }; // ✅ Correct import

const CONTRACT_ADDRESS = "0x025251F36a2FF9B0FF5EB51297aFE0Fa77ABee88";

// define race info type
type RaceInfo = {
  raceId: number;
  status: number;
  totalPool: string;
  numberOfRacers: number;
  winner: number;
};

// main hook
export function useParimutuelBetting() {
  const [userBalance, setUserBalance] = useState<string>("0");
  const [races, setRaces] = useState<RaceInfo[]>([]);
  const [houseTake, setHouseTake] = useState<number>(20);

  // get contract instance with signer
async function getContract() {
  if (!window?.ethereum) {
    throw new Error("No wallet found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ParimutuelBetting.abi as unknown as InterfaceAbi, // ✅ Use `.abi`
    signer
  );

  return contract;
}


  // ✅ Move refreshBalance ABOVE deposit & withdrawBalance
  const refreshBalance = useCallback(async () => {
    const contract = await getContract();

    if (!contract.runner) {
      throw new Error("contract runner (signer) is missing");
    }

    // ✅ Cast contract.runner to JsonRpcSigner
    const signer = contract.runner as ethers.JsonRpcSigner;
    const signerAddr = await signer.getAddress(); // ✅ Now getAddress() works

    const bal = await contract.userBalances(signerAddr);
    setUserBalance(ethers.formatUnits(bal, 6));
  }, []);

  // deposit usdc
  const deposit = useCallback(
    async (amtStr: string) => {
      const contract = await getContract(); // ✅ Await the contract
      const amt = ethers.parseUnits(amtStr, 6);
      const tx = await contract.deposit(amt);
      await tx.wait();
      await refreshBalance(); // ✅ Ensure refreshBalance is awaited
    },
    [refreshBalance]
  );

  // withdraw usdc balance
  const withdrawBalance = useCallback(async () => {
    const contract = await getContract();
    const tx = await contract.withdrawBalance();
    await tx.wait();
    await refreshBalance();
  }, [refreshBalance]);

  // place a bet
  const placeBet = useCallback(
    async (raceId: number, racerId: number, amtStr: string) => {
      const contract = await getContract();
      const amt = ethers.parseUnits(amtStr, 6);
      const tx = await contract.placeBet(raceId, racerId, amt);
      await tx.wait();
      await refreshBalance();
    },
    [refreshBalance]
  );

  // start a new race (admin only)
  const startNewRace = useCallback(async (racers: number) => {
    const contract = await getContract();
    const tx = await contract.startNewRace(racers);
    await tx.wait();
  }, []);

  // close a race (admin only)
  const closeRace = useCallback(async (raceId: number) => {
    const contract = await getContract();
    const tx = await contract.closeBetting(raceId);
    await tx.wait();
  }, []);

  // finish a race (admin only)
  const finishRace = useCallback(async (raceId: number, winner: number) => {
    const contract = await getContract();
    const tx = await contract.finishRace(raceId, winner);
    await tx.wait();
  }, []);

  // update house take % (admin only)
  const updateHouseTake = useCallback(async (pct: number) => {
    const contract = await getContract();
    const tx = await contract.updateHouseTakePercentage(pct);
    await tx.wait();
    setHouseTake(pct);
  }, []);

  // fetch race details
const refreshRaces = useCallback(async () => {
  const contract = await getContract();

  try {
    const nextId = await contract.nextRaceId();

    if (Number(nextId) === 0) {
      console.log("No races have been scheduled yet.");
      setRaces([]); // clear existing races if any
      return;
    }

    const arr: RaceInfo[] = [];
    for (let i = 1; i < Number(nextId); i++) {
      try {
        const [status, racers, winner, totalPool] =
          await contract.getRaceDetails(i);
        arr.push({
          raceId: i,
          status,
          numberOfRacers: racers,
          winner,
          totalPool: ethers.formatUnits(totalPool, 6),
        });
      } catch (raceErr) {
        console.error(`Error fetching race ${i}:`, raceErr);
      }
    }
    setRaces(arr);
  } catch (err) {
    console.error("Error calling nextRaceId():", err);
  }
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
