const ACCURACY_COLOR = {
  confirmed: '#3d6b3f', probable: '#7a6b3f', possible: '#6b3f3f',
};

export default function SightingsLog({ sightings, onDelete }) {
  if (sightings.length === 0) {
    return (
      <div style={{
        background: '#fff', borderRadius: 16, border: '1.5px solid #e8e0d5',
        padding: '32px 24px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🦅</div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#2c3e2d', marginBottom: 6 }}>
          No sightings yet
        </p>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: '#9a9088' }}>
          Drop a pin on the map and log your first bird sighting
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e8e0d5', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8e0d5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#2c3e2d', margin: 0 }}>
          Field Log
        </h3>
        <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, color: '#9a9088', background: '#f0ede8', padding: '3px 10px', borderRadius: 12 }}>
          {sightings.length} {sightings.length === 1 ? 'sighting' : 'sightings'}
        </span>
      </div>

      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {[...sightings].reverse().map((s, i) => (
          <div
            key={s.id}
            style={{ padding: '14px 24px', borderBottom: i < sightings.length - 1 ? '1px solid #f0ede8' : 'none', display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#faf8f4')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: ACCURACY_COLOR[s.accuracy] ?? '#3d6b3f', marginTop: 5, flexShrink: 0 }} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: '#2c3e2d', fontWeight: 600, marginBottom: 2 }}>
                {s.commonName || s.species}
                {s.quantity > 1 && (
                  <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, color: '#9a9088', fontWeight: 400, marginLeft: 6 }}>×{s.quantity}</span>
                )}
              </div>
              {s.species && s.species !== s.commonName && (
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, color: '#9a9088', fontStyle: 'italic', marginBottom: 4 }}>{s.species}</div>
              )}
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, color: '#b0a898', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span>{s.date}</span>
                <span>{s.time}</span>
                {s.behavior && <span style={{ textTransform: 'capitalize' }}>{s.behavior}</span>}
              </div>
              {s.notes && (
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, color: '#7a7060', marginTop: 6, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {s.notes}
                </div>
              )}
            </div>

            <button
              onClick={() => onDelete(s.id)}
              title="Delete sighting"
              style={{ background: 'transparent', border: 'none', color: '#d5cfc4', cursor: 'pointer', fontSize: 18, padding: '2px 4px', borderRadius: 4, flexShrink: 0, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c45c2e')}
              onMouseLeave={e => (e.currentTarget.style.color = '#d5cfc4')}
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}