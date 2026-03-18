import { useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { createMuseum } from '../lib/supabase.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng)
    },
  })
  return null
}

export default function AddMuseumPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [visitedAt, setVisitedAt] = useState('')
  const [position, setPosition] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleMapClick = useCallback((latlng) => {
    setPosition(latlng)
  }, [])

  async function handleSubmit() {
    if (!name.trim()) { setError('请填写博物馆名称'); return }
    if (!city.trim()) { setError('请填写城市名称'); return }
    if (!position) { setError('请在地图上点击选择位置'); return }

    setSaving(true)
    setError('')
    try {
      const museum = await createMuseum({
        name: name.trim(),
        city: city.trim(),
        latitude: position.lat,
        longitude: position.lng,
        visited_at: visitedAt || null,
        tags: [],
      })
      navigate(`/museum/${museum.id}/edit`)
    } catch (err) {
      setError('创建失败：' + err.message)
      setSaving(false)
    }
  }

  return (
    <div className="paper-texture" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 60px' }}>

        <h1 style={{
          fontFamily: 'Noto Serif SC, serif',
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--color-brown)',
          margin: '0 0 8px',
        }}>
          添加博物馆
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-warm-gray)', margin: '0 0 32px' }}>
          在地图上点击选择博物馆位置，然后填写基本信息
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

          {/* 左侧表单 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-warm-gray)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                博物馆名称 *
              </label>
              <input
                className="input-field"
                placeholder="如：台北故宫博物院"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-warm-gray)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                城市 *
              </label>
              <input
                className="input-field"
                placeholder="如：台北"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-warm-gray)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                参观日期
              </label>
              <input
                className="input-field"
                type="date"
                value={visitedAt}
                onChange={e => setVisitedAt(e.target.value)}
              />
            </div>

            <div style={{
              padding: '12px 14px',
              background: position ? 'rgba(74,55,40,0.06)' : 'var(--color-parchment)',
              borderRadius: '6px',
              border: `1px solid ${position ? 'var(--color-warm-tan)' : 'transparent'}`,
              fontSize: '13px',
              color: position ? 'var(--color-brown)' : 'var(--color-warm-gray)',
            }}>
              {position ? (
                <span>
                  ✓ 已选择位置<br />
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--color-warm-gray)' }}>
                    {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                  </span>
                </span>
              ) : (
                '← 在右侧地图上点击选择博物馆位置'
              )}
            </div>

            {error && (
              <p style={{ color: '#c0392b', fontSize: '13px', margin: 0 }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
              <button className="btn-secondary" onClick={() => navigate('/')}>取消</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? '创建中…' : '创建，开始记录'}
              </button>
            </div>
          </div>

          {/* 右侧地图 */}
          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-parchment)', height: '400px' }}>
            <MapContainer center={[35, 105]} zoom={4} style={{ width: '100%', height: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onPick={handleMapClick} />
              {position && <Marker position={position} />}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
