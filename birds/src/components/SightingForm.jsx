import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BEHAVIORS = ['perching', 'foraging', 'flying', 'singing', 'nesting', 'bathing', 'other'];
const WEATHER = ['sunny', 'partly-cloudy', 'overcast', 'rainy', 'foggy', 'windy'];
const ACCURACY = ['confirmed', 'probable', 'possible'];
const WEATHER_EMOJI = {
  sunny: '☀️', 'partly-cloudy': '⛅', overcast: '☁️', rainy: '🌧️', foggy: '🌫️', windy: '💨',
};
const ACCURACY_COLOR = {
  confirmed: '#3d6b3f', probable: '#7a6b3f', possible: '#6b3f3f',
};

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: '#faf8f4', border: '1.5px solid #d5cfc4', borderRadius: 8,
  fontFamily: "'Source Serif 4', serif", fontSize: 14, color: '#2c3e2d',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block', fontFamily: "'Source Serif 4', serif",
  fontSize: 12, fontWeight: 600, color: '#7a7060',
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
};

export default function SightingForm({ pendingCoords, onSubmit, onClearPin }) {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().slice(0, 5);

  const [form, setForm] = useState({
    species: '', commonName: '', notes: '',
    behavior: 'perching', quantity: 1,
    date: today, time: now,
    weather: 'sunny', accuracy: 'confirmed',
  });
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = !!pendingCoords && (!!form.species || !!form.commonName);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ id: uuidv4(), ...form, coordinates: pendingCoords });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ species: '', commonName: '', notes: '', behavior: 'perching', quantity: 1, date: today, time: now, weather: 'sunny', accuracy: 'confirmed' });
    }, 1800);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e8e0d5', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #2c3e2d 0%, #3d5c3f 100%)' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#e8f0e4', margin: 0, fontWeight: 600 }}>
          Record a Sighting
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: '#9ab89c', margin: '4px 0 0' }}>
          {pendingCoords
            ? `📍 ${pendingCoords[1].toFixed(4)}°N, ${pendingCoords[0].toFixed(4)}°E`
            : 'Drop a pin on the map to begin'}
        </p>
      </div>

      <div style={{ padding: 24 }}>
        {/* Names */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Common Name *</label>
            <input style={inputStyle} placeholder="e.g. Robin" value={form.commonName}
              onChange={(e) => setForm(f => ({ ...f, commonName: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Scientific Name</label>
            <input style={{ ...inputStyle, fontStyle: 'italic' }} placeholder="e.g. Erithacus rubecula" value={form.species}
              onChange={(e) => setForm(f => ({ ...f, species: e.target.value }))} />
          </div>
        </div>

        {/* Count + Accuracy */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Count</label>
            <input type="number" min={1} max={9999} style={inputStyle} value={form.quantity}
              onChange={(e) => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))} />
          </div>
          <div>
            <label style={labelStyle}>Confidence</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {ACCURACY.map(acc => (
                <button key={acc} onClick={() => setForm(f => ({ ...f, accuracy: acc }))} style={{
                  flex: 1, padding: '10px 4px',
                  border: `1.5px solid ${form.accuracy === acc ? ACCURACY_COLOR[acc] : '#d5cfc4'}`,
                  borderRadius: 8,
                  background: form.accuracy === acc ? ACCURACY_COLOR[acc] : '#faf8f4',
                  color: form.accuracy === acc ? '#fff' : '#7a7060',
                  fontFamily: "'Source Serif 4', serif", fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
                }}>{acc}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Behaviour */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Behaviour</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BEHAVIORS.map(b => (
              <button key={b} onClick={() => setForm(f => ({ ...f, behavior: b }))} style={{
                padding: '7px 14px',
                border: `1.5px solid ${form.behavior === b ? '#3d6b3f' : '#d5cfc4'}`,
                borderRadius: 20,
                background: form.behavior === b ? '#3d6b3f' : '#faf8f4',
                color: form.behavior === b ? '#fff' : '#7a7060',
                fontFamily: "'Source Serif 4', serif", fontSize: 13,
                cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
              }}>{b}</button>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Weather</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {WEATHER.map(w => (
              <button key={w} title={w.replace('-', ' ')} onClick={() => setForm(f => ({ ...f, weather: w }))} style={{
                flex: 1, padding: '10px 4px',
                border: `1.5px solid ${form.weather === w ? '#3d6b3f' : '#d5cfc4'}`,
                borderRadius: 8,
                background: form.weather === w ? '#f0f5f0' : '#faf8f4',
                cursor: 'pointer', fontSize: 18, transition: 'all 0.15s',
              }}>{WEATHER_EMOJI[w]}</button>
            ))}
          </div>
        </div>

        {/* Date + Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" style={inputStyle} value={form.date}
              onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Time</label>
            <input type="time" style={inputStyle} value={form.time}
              onChange={(e) => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Field Notes</label>
          <textarea rows={3} placeholder="Describe plumage, call, habitat, behaviour..."
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} value={form.notes}
            onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={!canSubmit} style={{
          width: '100%', padding: 14,
          background: submitted ? '#3d6b3f' : canSubmit ? 'linear-gradient(135deg, #c45c2e 0%, #d4703f 100%)' : '#d5cfc4',
          color: canSubmit ? '#fff' : '#a09888',
          border: 'none', borderRadius: 10,
          fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600,
          cursor: canSubmit ? 'pointer' : 'not-allowed', letterSpacing: '0.02em',
          transition: 'all 0.2s',
          boxShadow: canSubmit ? '0 4px 16px rgba(196,92,46,0.3)' : 'none',
        }}>
          {submitted ? '✓ Sighting Logged!' : '🔭 Log Bird Sighting'}
        </button>

        {pendingCoords && (
          <button onClick={onClearPin} style={{
            width: '100%', marginTop: 10, padding: 10,
            background: 'transparent', color: '#9a9088',
            border: '1.5px solid #e8e0d5', borderRadius: 10,
            fontFamily: "'Source Serif 4', serif", fontSize: 13, cursor: 'pointer',
          }}>
            Clear Pin
          </button>
        )}
      </div>
    </div>
  );
}