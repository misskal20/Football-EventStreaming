import React, { useState, useEffect, useMemo } from "react";
import MatchList from "./components/MatchList";
import AdminPanel from "./components/AdminPanel";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
const ROLE = import.meta.env.VITE_ROLE || "user";
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [live, setLive] = useState(false);

  const selected = useMemo(() => matches.find(m => m.id === selectedId) || null, [selectedId, matches]);
  const eventsUrl = `${SERVER_URL}/events`;

  // SSE
  useEffect(() => {
    fetch(`${SERVER_URL}/matches`).then(r => r.json()).then(setMatches).catch(() => {});
    const es = new EventSource(eventsUrl);
    es.onopen = () => setLive(true);
    es.onmessage = e => {
      try { setMatches(JSON.parse(e.data)); } catch {}
    };
    es.onerror = () => setLive(false);
    return () => { setLive(false); es.close(); };
  }, [eventsUrl]);

  const addMatch = async (team1, team2) => {
    const res = await fetch(`${SERVER_URL}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": ADMIN_TOKEN },
      body: JSON.stringify({ team1, team2 }),
    });
    if (!res.ok) throw new Error(`Create failed (${res.status})`);
  };

  const updateMatch = async (id, patch) => {
    const res = await fetch(`${SERVER_URL}/matches/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-token": ADMIN_TOKEN },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`Update failed (${res.status})`);
  };

  const deleteMatch = async id => {
    const res = await fetch(`${SERVER_URL}/matches/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": ADMIN_TOKEN },
    });
    if (!res.ok && res.status !== 204) throw new Error(`Delete failed (${res.status})`);
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="container">
      <header>
        <h1>Football Live Scores</h1>
        {live && <span className="live-badge">LIVE</span>}
        
        <span> Role: {ROLE}</span>
      </header>

      {ROLE === "admin" ? (
        <div className="grid">
          <section>
            <h2>Matches</h2>
            <MatchList matches={matches} onUpdate={updateMatch} onDelete={deleteMatch} />
          </section>
          <aside>
            <h2>Admin Panel</h2>
            <AdminPanel onCreate={addMatch} />
          </aside>
        </div>
      ) : (
        <div>
          <h2>Matches</h2>
          <div>
            {matches.map(m => (
              <div key={m.id} onClick={() => setSelectedId(m.id)}>
                <strong>{m.team1}</strong> vs <strong>{m.team2}</strong> — {m.score}
              </div>
            ))}
            {matches.length === 0 && <div>No matches yet</div>}
          </div>
        </div>
      )}
    </div>
  );
}
