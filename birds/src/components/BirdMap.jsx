import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAP_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;


const ACCURACY_COLOR = {
  confirmed: '#3d6b3f',
  probable: '#7a6b3f',
  possible: '#6b3f3f',
};

export default function BirdMap({ sightings, pendingCoords, onMapClick, onSightingClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const pendingMarker = useRef(null);
  const sightingMarkers = useRef(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isPinMode, setIsPinMode] = useState(false);
  const onSightingClickRef = useRef(onSightingClick);
  onSightingClickRef.current = onSightingClick;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAP_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-2.5, 54.0],
      zoom: 5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(
      new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false }),
      'top-right'
    );

    map.current.on('load', () => setMapLoaded(true));

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const handleMapClick = useCallback(
    (e) => { onMapClick([e.lngLat.lng, e.lngLat.lat]); },
    [onMapClick]
  );

  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    if (isPinMode) {
      map.current.getCanvas().style.cursor = 'crosshair';
      map.current.on('click', handleMapClick);
    } else {
      map.current.getCanvas().style.cursor = '';
      map.current.off('click', handleMapClick);
    }
    return () => { map.current?.off('click', handleMapClick); };
  }, [isPinMode, mapLoaded, handleMapClick]);

  // Pending pin marker
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    pendingMarker.current?.remove();
    pendingMarker.current = null;

    if (pendingCoords) {
      const el = document.createElement('div');
      el.innerHTML = `<div style="width:32px;height:32px;background:#c45c2e;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(196,92,46,0.5);animation:markerPulse 1.5s ease-in-out infinite"></div>`;
      pendingMarker.current = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(pendingCoords)
        .addTo(map.current);
      map.current.flyTo({ center: pendingCoords, zoom: Math.max(map.current.getZoom(), 12) });
      setIsPinMode(false);
    }
  }, [pendingCoords, mapLoaded]);

  // Sighting markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const existingIds = new Set(sightingMarkers.current.keys());

    sightings.forEach((s) => {
      if (!sightingMarkers.current.has(s.id)) {
        const color = ACCURACY_COLOR[s.accuracy] ?? '#3d6b3f';
        const el = document.createElement('div');
        el.style.cssText = 'display:flex;align-items:center;justify-content:center;cursor:pointer';
        el.innerHTML = `<div style="width:28px;height:28px;background:${color};border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);transition:transform 0.2s"></div>`;

        const popup = new mapboxgl.Popup({ offset: 25, className: 'bird-popup' }).setHTML(`
          <div style="font-family:'Source Serif 4',serif;padding:4px 0">
            <div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:600;color:#2c3e2d;margin-bottom:4px">${s.commonName || s.species}</div>
            ${s.species && s.species !== s.commonName ? `<div style="font-style:italic;font-size:12px;color:#666;margin-bottom:6px">${s.species}</div>` : ''}
            <div style="font-size:12px;color:#555;margin-bottom:3px">📅 ${s.date} · ${s.time}</div>
            <div style="font-size:12px;color:#555;margin-bottom:3px">🔢 ${s.quantity} bird${s.quantity !== 1 ? 's' : ''}</div>
            ${s.behavior ? `<div style="font-size:12px;color:#555;margin-bottom:3px;text-transform:capitalize">🐦 ${s.behavior}</div>` : ''}
            ${s.notes ? `<div style="font-size:12px;color:#555;margin-top:6px;border-top:1px solid #eee;padding-top:6px">${s.notes}</div>` : ''}
            <div style="margin-top:6px"><span style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;background:${color}20;color:${color};font-weight:600;text-transform:uppercase;letter-spacing:0.05em">${s.accuracy}</span></div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(s.coordinates)
          .setPopup(popup)
          .addTo(map.current);

        el.addEventListener('click', () => onSightingClickRef.current(s));
        sightingMarkers.current.set(s.id, marker);
      }
      existingIds.delete(s.id);
    });

    existingIds.forEach((id) => {
      sightingMarkers.current.get(id)?.remove();
      sightingMarkers.current.delete(id);
    });
  }, [sightings, mapLoaded]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      <button
        onClick={() => setIsPinMode((p) => !p)}
        style={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          padding: '10px 18px',
          background: isPinMode ? '#c45c2e' : 'rgba(255,255,255,0.95)',
          color: isPinMode ? '#fff' : '#2c3e2d',
          border: `2px solid ${isPinMode ? '#c45c2e' : '#d5cfc4'}`,
          borderRadius: 8,
          fontFamily: "'Source Serif 4', serif",
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>{isPinMode ? '✕' : '📍'}</span>
        {isPinMode ? 'Click map to drop pin' : 'Drop Pin'}
      </button>

      <style>{`
        @keyframes markerPulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(196,92,46,0.5); }
          50% { box-shadow: 0 4px 24px rgba(196,92,46,0.8); }
        }
        .mapboxgl-popup-content {
          border-radius: 12px !important;
          padding: 14px 16px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
          border: 1px solid #e8e0d5 !important;
        }
      `}</style>
    </div>
  );
}