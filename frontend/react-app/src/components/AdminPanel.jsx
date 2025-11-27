import React, { useState } from "react";

export default function AdminPanel({ onCreate }) {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (!team1 || !team2) { setError("Both team names required"); return; }
    try {
      setLoading(true);
      await onCreate(team1, team2);
      setTeam1(""); setTeam2(""); setDone(true);
    } catch (err) {
      setError(err.message || "Failed");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit}>
      <input value={team1} onChange={e => setTeam1(e.target.value)} placeholder="Team 1" disabled={loading}/>
      <input value={team2} onChange={e => setTeam2(e.target.value)} placeholder="Team 2" disabled={loading}/>
      <button type="submit" disabled={loading}>{loading ? "Adding…" : "Add Match"}</button>
      {error && <p>{error}</p>}
      {done && !error && <p>Match added.</p>}
    </form>
  );
}
