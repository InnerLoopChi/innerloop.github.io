import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  Map, MapPin, Users, Clock, Building2, Heart, Loader2, X, Search, Zap,
} from 'lucide-react';

const GOOGLE_MAPS_KEY = 'AIzaSyCaYs2p0gKHawBPy38qDgJxzMco8VHTk6k';

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
  const googleMap = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHood, setSelectedHood] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapReady, setMapReady] = useState(false);

  // Load posts
  useEffect(() => {
    const q = query(collection(db, 'posts'), where('isInnerOnly', '==', false), orderBy('postTime', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  // Load Google Maps SDK
  useEffect(() => {
    if (window.google?.maps) { setMapReady(true); return; }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapReady(true);
    script.onerror = () => console.error('Google Maps failed to load');
    document.head.appendChild(script);
  }, []);

  const getPostsForHood = useCallback((hoodName) => {
    const hoodTag = hoodName.toLowerCase().replace(/\s+/g, '-');
    const words = hoodName.toLowerCase().split(' ');
    return posts.filter(p => {
      const tags = p.tags?.map(t => t.toLowerCase()) || [];
      const content = p.content?.toLowerCase() || '';
      return tags.some(t => t.includes(hoodTag) || words.some(w => w.length > 3 && t.includes(w)))
        || words.some(w => w.length > 4 && content.includes(w));
    });
  }, [posts]);

  // Init map
  useEffect(() => {
    if (!mapReady || !mapRef.current || googleMap.current) return;
    googleMap.current = new google.maps.Map(mapRef.current, {
      center: { lat: 41.8781, lng: -87.6798 },
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
        { featureType: 'water', stylers: [{ color: '#c9e8f7' }] },
      ],
    });
    infoWindowRef.current = new google.maps.InfoWindow();
  }, [mapReady]);

  // Update markers
  useEffect(() => {
    if (!googleMap.current || !window.google) return;

    // Clear old
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    NEIGHBORHOODS.forEach(hood => {
      const hoodPosts = getPostsForHood(hood.name);
      const count = hoodPosts.length;
      const taskCount = hoodPosts.filter(p => p.taskCapacity > 0).length;

      const size = Math.max(32, Math.min(52, 28 + count * 5));
      const marker = new google.maps.Marker({
        position: { lat: hood.lat, lng: hood.lng },
        map: googleMap.current,
        icon: {
          url: `data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 10}" viewBox="0 0 ${size} ${size + 10}">
              <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${hood.color}" stroke="white" stroke-width="3"/>
              <text x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle" fill="white" font-size="${count > 9 ? 11 : 14}" font-weight="bold" font-family="sans-serif">${count}</text>
              <polygon points="${size / 2 - 6},${size - 2} ${size / 2 + 6},${size - 2} ${size / 2},${size + 8}" fill="${hood.color}"/>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(size, size + 10),
          anchor: new google.maps.Point(size / 2, size + 10),
        },
        title: `${hood.name} (${count} posts, ${taskCount} tasks)`,
        cursor: 'pointer',
        optimized: false,
      });

      marker.addListener('click', () => {
        setSelectedHood(hood);
        googleMap.current.panTo({ lat: hood.lat, lng: hood.lng });
        googleMap.current.setZoom(14);
        infoWindowRef.current.setContent(
          `<div style="font-family:system-ui;padding:4px 0;">
            <strong style="font-size:14px;">${hood.name}</strong><br/>
            <span style="color:#666;font-size:12px;">${count} posts · ${taskCount} active tasks</span>
          </div>`
        );
        infoWindowRef.current.open(googleMap.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [mapReady, posts, getPostsForHood]);

  const selectedPosts = selectedHood ? getPostsForHood(selectedHood.name) : [];
  const filteredHoods = searchTerm ? NEIGHBORHOODS.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase())) : NEIGHBORHOODS;

  function clearSelection() {
    setSelectedHood(null);
    infoWindowRef.current?.close();
    googleMap.current?.panTo({ lat: 41.8781, lng: -87.6798 });
    googleMap.current?.setZoom(11);
  }

  return (
    <div className="min-h-screen bg-loop-gray">
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
        {/* Google Map */}
        <div className="relative" style={{ height: '55vh', minHeight: 350 }}>
          <div ref={mapRef} className="w-full h-full" />
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-loop-gray">
              <Loader2 size={28} className="animate-spin text-loop-purple" />
            </div>
          )}
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-loop-green/30" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search neighborhoods..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-loop-gray bg-white text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
          </div>

          {/* Selected */}
          {selectedHood && (
            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold flex items-center gap-2">
                <MapPin size={14} style={{ color: selectedHood.color }} />
                {selectedHood.name} ({selectedPosts.length})
              </h3>
              {selectedPosts.length === 0 ? (
                <p className="bg-white rounded-2xl border border-loop-gray/50 p-6 text-center text-sm text-loop-green/40">No posts for this neighborhood</p>
              ) : selectedPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-loop-gray/50 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${post.authorRole === 'Inner' ? 'bg-loop-purple/15' : 'bg-loop-red/15'}`}>
                      {post.authorRole === 'Inner' ? <Building2 size={12} className="text-loop-purple" /> : <Heart size={12} className="text-loop-red" />}
                    </div>
                    <span className="text-xs font-semibold flex-1">{post.authorName}</span>
                    {post.taskCapacity > 0 && (
                      <span className="text-[10px] text-loop-green/40 flex items-center gap-1"><Users size={9} /> {post.taskFilled || 0}/{post.taskCapacity}</span>
                    )}
                  </div>
                  <p className="text-sm text-loop-green/70">{post.content}</p>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">{post.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded-full text-[10px] bg-loop-blue/15">#{t}</span>)}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          {!selectedHood && (
            <div>
              <h3 className="font-display text-sm font-bold text-loop-green/60 mb-2">Neighborhoods</h3>
              <div className="grid grid-cols-2 gap-2">
                {filteredHoods.map(hood => {
                  const count = getPostsForHood(hood.name).length;
                  return (
                    <button key={hood.name} onClick={() => {
                      setSelectedHood(hood);
                      googleMap.current?.panTo({ lat: hood.lat, lng: hood.lng });
                      googleMap.current?.setZoom(14);
                    }} className="bg-white rounded-xl border border-loop-gray/50 p-3 text-left hover:shadow-sm transition-all flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: hood.color + '20' }}>
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
