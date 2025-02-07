// /src/app/admin/page.tsx
"use client";
import { useState, FormEvent } from "react";
import { useParimutuelBetting } from "../../hooks/useParimutuelBetting";
import styles from "./page.module.sass";

export default function AdminPage() {
  // short-lowercase comments
  const { startNewRace, closeRace, finishRace, updateHouseTake, houseTake } =
    useParimutuelBetting();
  const [racers, setRacers] = useState<string>("2");
  const [closeId, setCloseId] = useState<string>("");
  const [finishId, setFinishId] = useState<string>("");
  const [finishWinner, setFinishWinner] = useState<string>("");
  const [newHouseTake, setNewHouseTake] = useState<string>("");

  // handle create race
  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!racers) return;
    await startNewRace(Number(racers));
  }

  // handle close race
  async function handleClose(e: FormEvent) {
    e.preventDefault();
    if (!closeId) return;
    await closeRace(Number(closeId));
  }

  // handle finish race
  async function handleFinish(e: FormEvent) {
    e.preventDefault();
    if (!finishId || !finishWinner) return;
    await finishRace(Number(finishId), Number(finishWinner));
  }

  // handle update house take
  async function handleHouseTake(e: FormEvent) {
    e.preventDefault();
    if (!newHouseTake) return;
    await updateHouseTake(Number(newHouseTake));
  }

  return (
    <div className={styles.adminContainer}>
      <h2>admin area</h2>
      <p>current house take: {houseTake}%</p>

      <div className={styles.actions}>
        <form onSubmit={handleCreate} className={styles.formGroup}>
          <label>number of racers</label>
          <input
            type="number"
            value={racers}
            onChange={(e) => setRacers(e.target.value)}
          />
          <button className={styles.button} type="submit">
            create race
          </button>
        </form>

        <form onSubmit={handleClose} className={styles.formGroup}>
          <label>close race id</label>
          <input
            type="number"
            value={closeId}
            onChange={(e) => setCloseId(e.target.value)}
          />
          <button className={styles.button} type="submit">
            close
          </button>
        </form>
      </div>

      <div className={styles.actions}>
        <form onSubmit={handleFinish} className={styles.formGroup}>
          <label>finish race id</label>
          <input
            type="number"
            value={finishId}
            onChange={(e) => setFinishId(e.target.value)}
          />
          <label>winner id</label>
          <input
            type="number"
            value={finishWinner}
            onChange={(e) => setFinishWinner(e.target.value)}
          />
          <button className={styles.button} type="submit">
            finish
          </button>
        </form>

        <form onSubmit={handleHouseTake} className={styles.formGroup}>
          <label>update house take %</label>
          <input
            type="number"
            value={newHouseTake}
            onChange={(e) => setNewHouseTake(e.target.value)}
          />
          <button className={styles.button} type="submit">
            update
          </button>
        </form>
      </div>
    </div>
  );
}
