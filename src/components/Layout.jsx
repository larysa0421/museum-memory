import { Outlet, Link, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* 顶部导航 */}
      <header style={{
        borderBottom: '1px solid var(--color-parchment)',
        background: 'var(--color-cream)',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link to="/" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21V10L12 3L21 10V21" stroke="#4A3728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21V15H15V21" stroke="#4A3728" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10H21" stroke="#C4A882" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <span style={{
            fontFamily: 'Noto Serif SC, Georgia, serif',
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--color-brown)',
            letterSpacing: '0.05em',
          }}>
            Museum Memory
          </span>
        </Link>

        <button
          className="btn-primary"
          onClick={() => navigate('/add')}
          style={{ fontSize: '13px', padding: '6px 16px' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          添加博物馆
        </button>
      </header>

      {/* 主内容 */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
