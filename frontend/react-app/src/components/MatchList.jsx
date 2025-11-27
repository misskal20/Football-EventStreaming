import React, { useState } from "react";

export default function MatchList({ matches, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const startEdit = m => {
    setEditingId(m.id);
    const [a, b] = m.score.split(":").map(x => Number(x.trim()));
    setScoreA(a); setScoreB(b);
  };

  const save = async id => {
    await onUpdate(id, { score: `${scoreA} : ${scoreB}` });
    setEditingId(null);
  };

  return (
    <div>
      {matches.map(m => (
        <div key={m.id}>
          {editingId === m.id ? (
            <div>
              <strong>{m.team1}</strong> vs <strong>{m.team2}</strong>
              <input type="number" value={scoreA} onChange={e => setScoreA(Number(e.target.value))}/>
              :
              <input type="number" value={scoreB} onChange={e => setScoreB(Number(e.target.value))}/>
              <button onClick={() => save(m.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <strong>{m.team1}</strong> vs <strong>{m.team2}</strong> — {m.score}
              <button onClick={() => startEdit(m)}>Edit</button>
              <button onClick={() => onDelete(m.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
