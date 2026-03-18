import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getMuseumById } from '../lib/supabase.js'

export default function MuseumPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [museum, setMuseum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null) // 图片灯箱

  useEffect(() => {
    getMuseumById(id)
      .then(setMuseum)
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 56px)',
        color: 'var(--color-warm-gray)',
        fontFamily: 'Noto Sans SC, sans-serif',
        fontSize: '14px',
      }}>
        加载中…
      </div>
    )
  }

  if (!museum) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-warm-gray)', fontFamily: 'Noto Serif SC, serif', fontSize: '16px' }}>
          找不到这个博物馆
        </p>
        <Link to="/" style={{ color: 'var(--color-brown-light)', fontSize: '13px' }}>← 返回地图</Link>
      </div>
    )
  }

  const memory = museum.memories?.[0]
  const photos = memory?.photos || []
  const links = memory?.links || []

  return (
    <div className="paper-texture fade-in" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* 面包屑导航 */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/"
            style={{
              fontSize: '13px',
              color: 'var(--color-warm-gray)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            地图
          </Link>
          <span style={{ color: 'var(--color-parchment)', fontSize: '13px' }}>/</span>
          <span style={{ fontSize: '13px', color: 'var(--color-warm-gray)' }}>{museum.city}</span>
        </div>

        {/* 博物馆标题区 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{
                fontFamily: 'Noto Serif SC, serif',
                fontSize: '28px',
                fontWeight: '600',
                color: 'var(--color-brown)',
                margin: '0 0 8px',
                lineHeight: '1.3',
              }}>
                {museum.name}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-warm-gray)', margin: '0 0 12px' }}>
                {museum.city}
                {museum.visited_at && (
                  <span style={{ marginLeft: '12px' }}>
                    · {new Date(museum.visited_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
              </p>

              {/* 标签 */}
              {museum.tags && museum.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {museum.tags.map(tag => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <button
              className="btn-secondary"
              onClick={() => navigate(`/museum/${id}/edit`)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9.5 1.5L12.5 4.5L5 12H2V9L9.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              编辑记忆
            </button>
          </div>
        </div>

        <hr className="divider" />

        {/* 无记忆内容提示 */}
        {!memory && (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: 'var(--color-warm-gray)',
          }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }}>
              <path d="M20 8C13.4 8 8 13.4 8 20s5.4 12 12 12 12-5.4 12-12S26.6 8 20 8z" stroke="var(--color-warm-tan)" strokeWidth="1.5"/>
              <path d="M20 15v8M20 25v2" stroke="var(--color-warm-tan)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ fontFamily: 'Noto Serif SC, serif', fontSize: '16px', margin: '0 0 12px' }}>
              还没有记录这次参观的记忆
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate(`/museum/${id}/edit`)}
            >
              开始记录
            </button>
          </div>
        )}

        {/* 照片 */}
        {photos.length > 0 && (
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{
              fontFamily: 'Noto Serif SC, serif',
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--color-warm-gray)',
              margin: '0 0 16px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: '12px',
            }}>
              照片
            </h2>
            <div className="photo-grid">
              {photos.map(photo => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt=""
                  style={{ cursor: 'pointer' }}
                  onClick={() => setLightbox(photo.url)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 文字感悟 */}
        {memory?.content && (
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{
              fontFamily: 'Noto Sans SC, sans-serif',
              fontSize: '12px',
              fontWeight: '400',
              color: 'var(--color-warm-gray)',
              margin: '0 0 16px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              感悟
            </h2>
            <div
              className="font-diary"
              style={{
                fontSize: '15px',
                color: 'var(--color-brown-dark)',
                lineHeight: '1.9',
                whiteSpace: 'pre-wrap',
                padding: '24px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid var(--color-parchment)',
                borderLeft: '3px solid var(--color-warm-tan)',
              }}
            >
              {memory.content}
            </div>
          </section>
        )}

        {/* 相关链接 */}
        {links.length > 0 && (
          <section>
            <h2 style={{
              fontFamily: 'Noto Sans SC, sans-serif',
              fontSize: '12px',
              fontWeight: '400',
              color: 'var(--color-warm-gray)',
              margin: '0 0 16px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              相关链接
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="memory-link"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M5.5 2.5H2.5C1.95 2.5 1.5 2.95 1.5 3.5V11.5C1.5 12.05 1.95 12.5 2.5 12.5H10.5C11.05 12.5 11.5 12.05 11.5 11.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    <path d="M7.5 1.5H12.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12.5 1.5L6.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span>{link.title || link.url}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 灯箱 */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
            padding: '24px',
          }}
        >
          <img
            src={lightbox}
            alt=""
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '4px',
            }}
          />
        </div>
      )}
    </div>
  )
}
