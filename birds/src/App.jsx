import { useState } from 'react';
import BirdMap from './components/BirdMap';
import SightingForm from './components/SightingForm';
import SightingsLog from './components/SightingsLog';

export default function App() {
  const [sightings, setSightings] = useState([]);
  const [pendingCoords, setPendingCoords] = useState(null);

  const handleSubmit = (sighting) => {
    setSightings(prev => [...prev, sighting]);
    setPendingCoords(null);
  };

  const handleDelete = (id) => {
    setSightings(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f1eb', fontFamily: "'Source Serif 4', serif" }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1a2c1b 0%, #2c3e2d 60%, #3d5c3f 100%)',
        padding: '0 40px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: '1px solid #0d1a0e', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 28 }}>🦜</span>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#e8f0e4', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Field Notes
            </h1>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 11, color: '#6a9c6e', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Bird Sighting Journal
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, fontFamily: "'Source Serif 4', serif", fontSize: 13, color: '#9ab89c' }}>
          <span>🐦 {sightings.length} sighting{sightings.length !== 1 ? 's' : ''}</span>
          <span>🗺️ {new Set(sightings.map(s => `${s.coordinates[0].toFixed(1)},${s.coordinates[1].toFixed(1)}`)).size} location{sightings.length !== 1 ? 's' : ''}</span>
        </div>
      </header>

      {/* Map */}
      <div style={{ width: '100%', height: '60vh', position: 'relative', borderBottom: '2px solid #d5cfc4' }}>
        <BirdMap
          sightings={sightings}
          pendingCoords={pendingCoords}
          onMapClick={setPendingCoords}
          onSightingClick={() => {}}
        />
      </div>

      {/* Below-map layout */}
      <main style={{
        maxWidth: 1100, margin: '0 auto', padding: '36px 24px 60px',
        display: 'grid', gridTemplateColumns: '420px 1fr', gap: 28, alignItems: 'start',
      }}>
        <SightingForm
          pendingCoords={pendingCoords}
          onSubmit={handleSubmit}
          onClearPin={() => setPendingCoords(null)}
        />
        <SightingsLog sightings={sightings} onDelete={handleDelete} />
      </main>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus, textarea:focus { border-color: #3d6b3f !important; box-shadow: 0 0 0 3px rgba(61,107,63,0.1); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f0ede8; }
        ::-webkit-scrollbar-thumb { background: #c8c0b4; border-radius: 3px; }
      `}</style>
    </div>
  );
}