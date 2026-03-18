import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { getMuseums } from '../lib/supabase.js'

// 修复 Leaflet 默认图标问题
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// 自定义暖棕色标记
function createMuseumIcon() {
  return L.divIcon({
    html: `<div style="
      width: 14px;
      height: 14px;
      background: #4A3728;
      border: 2.5px solid #C4A882;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(74,55,40,0.35);
      transition: transform 0.15s ease;
    "></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })
}

// 城市聚合显示
function groupByCity(museums) {
  return museums.reduce((acc, m) => {
    if (!acc[m.city]) acc[m.city] = []
    acc[m.city].push(m)
    return acc
  }, {})
}

export default function HomePage() {
  const [museums, setMuseums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getMuseums()
      .then(setMuseums)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const cityGroups = groupByCity(museums)
  const cities = Object.keys(cityGroups)

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)' }}>
      {/* 左侧城市列表 */}
      <aside style={{
        width: '260px',
        borderRight: '1px solid var(--color-parchment)',
        background: 'var(--color-cream)',
        overflowY: 'auto',
        flexShrink: 0,
      }}>
        <div style={{ padding: '20px 16px 12px' }}>
          <p style={{
            fontFamily: 'Noto Serif SC, serif',
            fontSize: '13px',
            color: 'var(--color-warm-gray)',
            margin: 0,
            letterSpacing: '0.05em',
          }}>
            已记录 {museums.length} 个博物馆
          </p>
        </div>

        {loading && (
          <div style={{ padding: '20px 16px', color: 'var(--color-warm-gray)', fontSize: '13px' }}>
            加载中…
          </div>
        )}

        {error && (
          <div style={{ padding: '16px', color: '#c0392b', fontSize: '13px', background: '#fdf0f0', margin: '8px', borderRadius: '6px' }}>
            ⚠️ {error}
          </div>
        )}

        {cities.length === 0 && !loading && !error && (
          <div style={{ padding: '20px 16px' }}>
            <p style={{ color: 'var(--color-warm-gray)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
              还没有记录。<br />点击右上角「添加博物馆」开始你的第一条记忆。
            </p>
          </div>
        )}

        {cities.map(city => (
          <div key={city}>
            <button
              onClick={() => setSelectedCity(selectedCity === city ? null : city)}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: selectedCity === city ? 'var(--color-parchment)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-parchment)',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'Noto Sans SC, sans-serif',
                fontSize: '14px',
                color: 'var(--color-brown)',
                fontWeight: '500',
                transition: 'background 0.15s',
              }}
            >
              <span>{city}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-warm-gray)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {cityGroups[city].length} 个
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{
                  transform: selectedCity === city ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
            </button>

            {selectedCity === city && cityGroups[city].map(museum => (
              <button
                key={museum.id}
                onClick={() => navigate(`/museum/${museum.id}`)}
                style={{
                  width: '100%',
                  padding: '9px 16px 9px 28px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--color-parchment)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'Noto Sans SC, sans-serif',
                  fontSize: '13px',
                  color: 'var(--color-brown-light)',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-parchment)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ color: 'var(--color-warm-tan)', fontSize: '16px' }}>·</span>
                {museum.name}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* 右侧地图 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[35, 105]}
          zoom={4}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {museums.map(museum => (
            <Marker
              key={museum.id}
              position={[museum.latitude, museum.longitude]}
              icon={createMuseumIcon()}
            >
              <Popup>
                <div style={{ minWidth: '160px', padding: '4px 2px' }}>
                  <p style={{
                    fontFamily: 'Noto Serif SC, serif',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-brown)',
                    margin: '0 0 4px',
                  }}>
                    {museum.name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--color-warm-gray)',
                    margin: '0 0 10px',
                  }}>
                    {museum.city}
                  </p>
                  {museum.tags && museum.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                      {museum.tags.map(tag => (
                        <span key={tag} className="tag-pill" style={{ fontSize: '11px', padding: '2px 8px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '6px 12px' }}
                    onClick={() => navigate(`/museum/${museum.id}`)}
                  >
                    查看记忆
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* 地图提示 */}
        {museums.length === 0 && !loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(250,247,242,0.92)',
            border: '1px solid var(--color-warm-tan)',
            borderRadius: '12px',
            padding: '24px 32px',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}>
            <p style={{
              fontFamily: 'Noto Serif SC, serif',
              fontSize: '18px',
              color: 'var(--color-brown)',
              margin: '0 0 8px',
            }}>
              记录你的第一个博物馆
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-warm-gray)', margin: 0 }}>
              点击右上角「添加博物馆」开始吧
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
