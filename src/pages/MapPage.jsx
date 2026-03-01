import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  Map, MapPin, Users, Clock, Building2, Heart, Loader2, X, Search,
} from 'lucide-react';

const NEIGHBORHOODS = [
  { name: 'Pilsen', lat: 41.8525, lng: -87.6614, color: '#8B6897' },
  { name: 'Logan Square', lat: 41.9234, lng: -87.7082, color: '#E74C3C' },
  { name: 'Humboldt Park', lat: 41.9020, lng: -87.7224, color: '#3498DB' },
  { name: 'Garfield Park', lat: 41.8806, lng: -87.7197, color: '#27AE60' },
  { name: 'Back of the Yards', lat: 41.8100, lng: -87.6567, color: '#F39C12' },
  { name: 'Little Village', lat: 41.8437, lng: -87.7133, color: '#E74C3C' },
  { name: 'Bronzeville', lat: 41.8230, lng: -87.6172, color: '#9B59B6' },
  { name: 'Austin', lat: 41.8969, lng: -87.7650, color: '#1ABC9C' },
  { name: 'Englewood', lat: 41.7800, lng: -87.6460, color: '#E67E22' },
  { name: 'Lawndale', lat: 41.8600, lng: -87.7190, color: '#2ECC71' },
  { name: 'Bridgeport', lat: 41.8369, lng: -87.6505, color: '#3498DB' },
  { name: 'Hyde Park', lat: 41.7943, lng: -87.5907, color: '#8B6897' },
  { name: 'Wicker Park', lat: 41.9088, lng: -87.6796, color: '#E74C3C' },
  { name: 'Uptown', lat: 41.9654, lng: -87.6535, color: '#1ABC9C' },
  { name: 'Rogers Park', lat: 42.0087, lng: -87.6706, color: '#F39C12' },
  { name: 'Albany Park', lat: 41.9681, lng: -87.7241, color: '#9B59B6' },
];

export default function MapPage() {
  const { profile } = useAuth();
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHood, setSelectedHood] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'posts'), snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => !p.isInnerOnly));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  // Load Leaflet
  useEffect(() => {
    if (window.L) { setMapReady(true); return; }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload = () => setMapReady(true);
    document.head.appendChild(js);
  }, []);

  // Init map
  useEffect(() => {
    if (!mapReady || !mapRef.current || leafletMap.current) return;
    const L = window.L;
    leafletMap.current = L.map(mapRef.current, {
      center: [41.8781, -87.6798],
      zoom: 11,
      zoomControl: true,
    });
    // CartoDB Voyager — clean, modern, free
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(leafletMap.current);

    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } };
  }, [mapReady]);

  const getPostsForHood = useCallback((hoodName) => {
    const tag = hoodName.toLowerCase().replace(/\s+/g, '-');
    const words = hoodName.toLowerCase().split(' ');
    return posts.filter(p => {
      const tags = p.tags?.map(t => t.toLowerCase()) || [];
      const content = p.content?.toLowerCase() || '';
      return tags.some(t => t.includes(tag) || words.some(w => w.length > 3 && t.includes(w)))
        || words.some(w => w.length > 4 && content.includes(w));
    });
  }, [posts]);

  // Markers
  useEffect(() => {
    if (!mapReady || !leafletMap.current || !window.L) return;
    const L = window.L;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    NEIGHBORHOODS.forEach(hood => {
      const count = getPostsForHood(hood.name).length;
      const tasks = getPostsForHood(hood.name).filter(p => p.taskCapacity > 0).length;
      const size = Math.max(30, Math.min(50, 26 + count * 4));

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${count > 0 ? hood.color : '#ccc'};
          display:flex;align-items:center;justify-content:center;
          color:white;font-weight:700;font-size:${count > 9 ? 10 : 13}px;
          font-family:system-ui;
          box-shadow:0 3px 12px ${hood.color}60;
          border:3px solid white;cursor:pointer;
          transition:transform .2s;
        " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">${count}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([hood.lat, hood.lng], { icon })
        .addTo(leafletMap.current)
        .bindTooltip(`<strong>${hood.name}</strong><br/>${count} posts · ${tasks} tasks`, {
          direction: 'top', offset: [0, -size / 2 - 4],
          className: 'leaflet-tooltip-custom',
        })
        .on('click', () => {
          setSelectedHood(hood);
          leafletMap.current.flyTo([hood.lat, hood.lng], 14, { duration: 0.6 });
        });

      markersRef.current.push(marker);
    });
  }, [mapReady, posts, getPostsForHood]);

  const selectedPosts = selectedHood ? getPostsForHood(selectedHood.name) : [];
  const filteredHoods = searchTerm ? NEIGHBORHOODS.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase())) : NEIGHBORHOODS;

  function clearSelection() {
    setSelectedHood(null);
    leafletMap.current?.flyTo([41.8781, -87.6798], 11, { duration: 0.4 });
  }

  return (
    <div className="min-h-screen bg-loop-gray">
      {/* Tooltip CSS */}
      <style>{`
        .leaflet-tooltip-custom { font-family: system-ui; font-size: 12px; padding: 6px 10px; border-radius: 8px; border: none; box-shadow: 0 2px 8px rgba(0,0,0,.15); }
        .leaflet-control-attribution { font-size: 9px !important; }
      `}</style>

      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-display text-lg font-extrabold flex items-center gap-2">
            <Map size={18} className="text-loop-red" /> Neighborhood Map
          </h1>
          {selectedHood && (
            <button onClick={clearSelection} className="text-xs text-loop-purple font-semibold flex items-center gap-1"><X size={12} /> Reset</button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative" style={{ height: '55vh', minHeight: 350 }}>
          <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-loop-gray z-10">
              <Loader2 size={28} className="animate-spin text-loop-purple" />
            </div>
          )}
        </div>

        <div className="px-4 py-4 space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-loop-green/30" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search neighborhoods..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-loop-gray bg-white text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
          </div>

          {selectedHood && (
            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold flex items-center gap-2">
                <MapPin size={14} style={{ color: selectedHood.color }} />
                {selectedHood.name} ({selectedPosts.length})
              </h3>
              {selectedPosts.length === 0 ? (
                <p className="bg-white rounded-2xl border border-loop-gray/50 p-6 text-center text-sm text-loop-green/40">No posts for this neighborhood yet</p>
              ) : selectedPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-loop-gray/50 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${post.authorRole === 'Inner' ? 'bg-loop-purple/15' : 'bg-loop-red/15'}`}>
                      {post.authorRole === 'Inner' ? <Building2 size={12} className="text-loop-purple" /> : <Heart size={12} className="text-loop-red" />}
                    </div>
                    <span className="text-xs font-semibold flex-1">{post.authorName}</span>
                    {post.taskCapacity > 0 && <span className="text-[10px] text-loop-green/40"><Users size={9} className="inline" /> {post.taskFilled || 0}/{post.taskCapacity}</span>}
                  </div>
                  <p className="text-sm text-loop-green/70">{post.content}</p>
                  {post.tags?.length > 0 && <div className="flex flex-wrap gap-1">{post.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded-full text-[10px] bg-loop-blue/15">#{t}</span>)}</div>}
                </div>
              ))}
            </div>
          )}

          {!selectedHood && (
            <div>
              <h3 className="font-display text-sm font-bold text-loop-green/60 mb-2">Neighborhoods</h3>
              <div className="grid grid-cols-2 gap-2">
                {filteredHoods.map(hood => {
                  const count = getPostsForHood(hood.name).length;
                  return (
                    <button key={hood.name} onClick={() => {
                      setSelectedHood(hood);
                      leafletMap.current?.flyTo([hood.lat, hood.lng], 14, { duration: 0.6 });
                    }} className="bg-white rounded-xl border border-loop-gray/50 p-3 text-left hover:shadow-sm transition-all flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: hood.color + '20' }}>
                        <MapPin size={13} style={{ color: hood.color }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{hood.name}</p>
                        <p className="text-[10px] text-loop-green/40">{count} post{count !== 1 ? 's' : ''}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
