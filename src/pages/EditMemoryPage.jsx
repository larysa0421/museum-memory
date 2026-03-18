import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMuseumById, upsertMemory, uploadPhoto, deletePhoto } from '../lib/supabase.js'

const PRESET_TAGS = ['历史', '艺术', '自然科学', '考古', '民俗', '现代艺术', '科技', '军事']

export default function EditMemoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [museum, setMuseum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [savedAt, setSavedAt] = useState(null)

  // 表单状态
  const [content, setContent] = useState('')
  const [links, setLinks] = useState([]) // [{ url, title }]
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newLinkTitle, setNewLinkTitle] = useState('')
  const [tags, setTags] = useState([])
  const [customTag, setCustomTag] = useState('')
  const [photos, setPhotos] = useState([])
  const [memoryId, setMemoryId] = useState(null)

  const autoSaveTimer = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    getMuseumById(id)
      .then(data => {
        setMuseum(data)
        setTags(data.tags || [])
        const mem = data.memories?.[0]
        if (mem) {
          setMemoryId(mem.id)
          setContent(mem.content || '')
          setLinks(mem.links || [])
          setPhotos(mem.photos || [])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  // 自动保存（输入停止2秒后）
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      handleSave(true)
    }, 2000)
  }, [content, links, tags])

  async function handleSave(isAuto = false) {
    if (!museum) return
    setSaving(true)
    try {
      const saved = await upsertMemory({
        ...(memoryId ? { id: memoryId } : {}),
        museum_id: parseInt(id),
        content,
        links,
      })
      if (!memoryId) setMemoryId(saved.id)
      setSavedAt(new Date())
    } catch (err) {
      console.error('保存失败:', err)
      if (!isAuto) alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  async function handleTagChange(tag) {
    const newTags = tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    setTags(newTags)
    // 标签更新到 museum 表
    try {
      const { updateMuseum } = await import('../lib/supabase.js')
      await updateMuseum(parseInt(id), { tags: newTags })
    } catch (err) {
      console.error('标签保存失败:', err)
    }
  }

  function addCustomTag() {
    const t = customTag.trim()
    if (!t || tags.includes(t)) return
    handleTagChange(t)
    setCustomTag('')
  }

  function addLink() {
    if (!newLinkUrl.trim()) return
    let url = newLinkUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    setLinks(prev => [...prev, { url, title: newLinkTitle.trim() || url }])
    setNewLinkUrl('')
    setNewLinkTitle('')
  }

  function removeLink(index) {
    setLinks(prev => prev.filter((_, i) => i !== index))
  }

  async function handlePhotoUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return

    // 先保存 memory 确保有 memory id
    if (!memoryId) {
      await handleSave()
    }

    setUploadingPhoto(true)
    try {
      for (const file of files) {
        const photo = await uploadPhoto(file, memoryId || 'temp')
        setPhotos(prev => [...prev, photo])
      }
    } catch (err) {
      alert('照片上传失败：' + err.message)
    } finally {
      setUploadingPhoto(false)
      e.target.value = ''
    }
  }

  async function handleDeletePhoto(photo) {
    if (!confirm('确认删除这张照片？')) return
    try {
      await deletePhoto(photo.id, photo.storage_path)
      setPhotos(prev => prev.filter(p => p.id !== photo.id))
    } catch (err) {
      alert('删除失败：' + err.message)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)', color: 'var(--color-warm-gray)', fontSize: '14px' }}>
        加载中…
      </div>
    )
  }

  return (
    <div className="paper-texture" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 100px' }}>

        {/* 标题行 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{
              fontFamily: 'Noto Serif SC, serif',
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--color-brown)',
              margin: '0 0 4px',
            }}>
              {museum?.name}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-warm-gray)', margin: 0 }}>
              {museum?.city} · 编辑记忆
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {savedAt && (
              <span style={{ fontSize: '12px', color: 'var(--color-warm-gray)' }}>
                已保存 {savedAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              className="btn-secondary"
              onClick={() => navigate(`/museum/${id}`)}
            >
              取消
            </button>
            <button
              className="btn-primary"
              onClick={() => handleSave()}
              disabled={saving}
            >
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </div>

        <hr className="divider" />

        {/* 主题标签 */}
        <section style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontFamily: 'Noto Sans SC, sans-serif',
            fontSize: '12px',
            color: 'var(--color-warm-gray)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            主题标签
          </label>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {PRESET_TAGS.map(tag => (
              <span
                key={tag}
                className={`tag-pill ${tags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagChange(tag)}
              >
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="input-field"
              style={{ maxWidth: '200px' }}
              placeholder="自定义标签…"
              value={customTag}
              onChange={e => setCustomTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomTag()}
            />
            <button className="btn-secondary" onClick={addCustomTag} style={{ flexShrink: 0 }}>
              添加
            </button>
          </div>

          {tags.filter(t => !PRESET_TAGS.includes(t)).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {tags.filter(t => !PRESET_TAGS.includes(t)).map(tag => (
                <span
                  key={tag}
                  className="tag-pill selected"
                  onClick={() => handleTagChange(tag)}
                  title="点击移除"
                >
                  {tag} ×
                </span>
              ))}
            </div>
          )}
        </section>

        {/* 照片上传 */}
        <section style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontFamily: 'Noto Sans SC, sans-serif',
            fontSize: '12px',
            color: 'var(--color-warm-gray)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            照片
          </label>

          {photos.length > 0 && (
            <div className="photo-grid" style={{ marginBottom: '16px' }}>
              {photos.map(photo => (
                <div key={photo.id} style={{ position: 'relative', group: true }}>
                  <img src={photo.url} alt="" style={{ cursor: 'default' }} />
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />
          <button
            className="btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V10M3 5L7 1L11 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 11H13V13H1V11Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {uploadingPhoto ? '上传中…' : '上传照片'}
          </button>
          <p style={{ fontSize: '12px', color: 'var(--color-warm-gray)', marginTop: '6px' }}>
            支持 JPG、PNG、HEIC，建议单张 &lt; 5MB
          </p>
        </section>

        {/* 文字感悟 */}
        <section style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontFamily: 'Noto Sans SC, sans-serif',
            fontSize: '12px',
            color: 'var(--color-warm-gray)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            感悟 / 日记
          </label>

          <textarea
            className="textarea-diary"
            placeholder="写下你在这里的感受、想法、故事……"
            value={content}
            onChange={e => {
              setContent(e.target.value)
              triggerAutoSave()
            }}
            rows={10}
          />
          <p style={{ fontSize: '12px', color: 'var(--color-warm-gray)', marginTop: '6px' }}>
            停止输入 2 秒后自动保存
          </p>
        </section>

        {/* 相关链接 */}
        <section>
          <label style={{
            display: 'block',
            fontFamily: 'Noto Sans SC, sans-serif',
            fontSize: '12px',
            color: 'var(--color-warm-gray)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            相关链接
          </label>

          {links.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {links.map((link, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: 'var(--color-parchment)',
                  borderRadius: '6px',
                }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'var(--color-warm-tan)' }}>
                    <path d="M5.5 2.5H2.5C1.95 2.5 1.5 2.95 1.5 3.5V11.5C1.5 12.05 1.95 12.5 2.5 12.5H10.5C11.05 12.5 11.5 12.05 11.5 11.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    <path d="M7.5 1.5H12.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12.5 1.5L6.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-brown)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {link.title}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-warm-gray)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {link.url}
                    </p>
                  </div>
                  <button
                    onClick={() => removeLink(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-warm-gray)', fontSize: '16px', padding: '0 4px', flexShrink: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              className="input-field"
              placeholder="链接标题（可选）"
              value={newLinkTitle}
              onChange={e => setNewLinkTitle(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="input-field"
                placeholder="https://…"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addLink()}
              />
              <button className="btn-secondary" onClick={addLink} style={{ flexShrink: 0 }}>
                添加
              </button>
            </div>
          </div>
        </section>

        {/* 底部保存按钮（移动端方便） */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 24px',
          background: 'rgba(250,247,242,0.95)',
          borderTop: '1px solid var(--color-parchment)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          backdropFilter: 'blur(8px)',
          zIndex: 50,
        }}>
          <button className="btn-secondary" onClick={() => navigate(`/museum/${id}`)}>取消</button>
          <button className="btn-primary" onClick={() => handleSave().then(() => navigate(`/museum/${id}`))} disabled={saving}>
            {saving ? '保存中…' : '保存并查看'}
          </button>
        </div>
      </div>
    </div>
  )
}
