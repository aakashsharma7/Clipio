'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Grid3X3, 
  List, 
  Filter,
  MoreVertical, 
  Heart, 
  Download, 
  Share2,
  User,
  Settings,
  LogOut,
  FolderOpen,
  Image,
  FileText,
  Video,
  Music,
  Archive,
  Star,
  Clock,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Trash2,
  Edit3,
  Check,
  X,
  Bell,
  Wand2,
  Upload as UploadIcon,
  MoveRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'document' | 'video' | 'music' | 'archive'>('all')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [sortKey, setSortKey] = useState<'name' | 'date' | 'size'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [showInspo, setShowInspo] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  type Asset = {
    id: number
    name: string
    type: 'image' | 'document' | 'video' | 'music' | 'archive'
    url: string
    tags: string[]
    collection: string
    created: string
    size: string
    favorite: boolean
    rating?: number
    notes?: string
    comments?: { id: string; author: string; text: string; created: string }[]
    editing?: boolean
    addingTag?: boolean
  }

  const [assets, setAssets] = useState<Asset[]>(() => {
    const savedAssets = localStorage.getItem('assets')
    if (savedAssets) {
      return JSON.parse(savedAssets)
    }
    return [
      {
        id: 1,
        name: 'Hero Banner Design',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
        tags: ['banner', 'hero', 'design'],
        collection: 'Marketing',
        created: '2024-01-15',
        size: '2.4 MB',
        favorite: true,
        rating: 5,
        notes: '',
        comments: []
      },
      {
        id: 2,
        name: 'Product Mockup',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
        tags: ['product', 'mockup', '3d'],
        collection: 'Product',
        created: '2024-01-14',
        size: '1.8 MB',
        favorite: false,
        rating: 4,
        notes: '',
        comments: []
      },
      {
        id: 3,
        name: 'Brand Guidelines',
        type: 'document',
        url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop',
        tags: ['brand', 'guidelines', 'pdf'],
        collection: 'Brand',
        created: '2024-01-13',
        size: '5.2 MB',
        favorite: true,
        rating: 5,
        notes: '',
        comments: []
      },
      {
        id: 4,
        name: 'Website Wireframe',
        type: 'document',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        tags: ['wireframe', 'website', 'ux'],
        collection: 'Design',
        created: '2024-01-12',
        size: '3.1 MB',
        favorite: false,
        rating: 3,
        notes: '',
        comments: []
      },
      {
        id: 5,
        name: 'Logo Variations',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
        tags: ['logo', 'brand', 'variations'],
        collection: 'Brand',
        created: '2024-01-11',
        size: '4.7 MB',
        favorite: true,
        rating: 4,
        notes: '',
        comments: []
      },
      {
        id: 6,
        name: 'Social Media Template',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=600&fit=crop',
        tags: ['social', 'template', 'instagram'],
        collection: 'Marketing',
        created: '2024-01-10',
        size: '2.1 MB',
        favorite: false,
        rating: 4,
        notes: '',
        comments: []
      }
    ]
  })

  const collections = [
    { id: 1, name: 'Marketing', color: '#3b82f6' },
    { id: 2, name: 'Product', color: '#10b981' },
    { id: 3, name: 'Brand', color: '#f59e0b' },
    { id: 4, name: 'Design', color: '#8b5cf6' }
  ]

  const user = {
    name: 'John Doe',
    email: 'john@example.com'
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />
      case 'document': return <FileText className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'music': return <Music className="w-4 h-4" />
      case 'archive': return <Archive className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const parseSizeToBytes = (size: string) => {
    const [num, unit] = size.split(' ')
    const n = parseFloat(num)
    switch ((unit || '').toUpperCase()) {
      case 'KB': return n * 1024
      case 'MB': return n * 1024 * 1024
      case 'GB': return n * 1024 * 1024 * 1024
      default: return n
    }
  }

  const sortAssets = (arr: typeof assets) => {
    const sorted = [...arr].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name)
      if (sortKey === 'size') return parseSizeToBytes(a.size) - parseSizeToBytes(b.size)
      return new Date(a.created).getTime() - new Date(b.created).getTime()
    })
    return sortDir === 'asc' ? sorted : sorted.reverse()
  }

  const filteredAssets = useMemo(() => {
    const filtered = assets.filter(a => {
      const matchesCollection = selectedCollection ? a.collection === selectedCollection : true
      const matchesSearch = searchQuery
        ? a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
      const matchesType = typeFilter === 'all' ? true : a.type === typeFilter
      const matchesFavorite = favoritesOnly ? a.favorite : true
      return matchesCollection && matchesSearch && matchesType && matchesFavorite
    })
    return sortAssets(filtered)
  }, [assets, selectedCollection, searchQuery, typeFilter, favoritesOnly, sortKey, sortDir])

  const totalCount = assets.length
  const favoritesCount = assets.filter(a => a.favorite).length
  const recentCount = assets.length
  const tagsCount = new Set(assets.flatMap(a => a.tags)).size

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedAssets = filteredAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const toggleFavorite = (id: number) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, favorite: !a.favorite } : a))
  }

  const downloadAsset = (url: string, name: string) => {
    try {
      const link = document.createElement('a')
      link.href = url
      link.download = name
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Download started')
      pushNotification(`Started download: ${name}`)
    } catch (e) {
      toast.error('Failed to start download')
    }
  }

  const shareAsset = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
      pushNotification('Copied share link to clipboard')
    } catch (e) {
      toast.error('Failed to copy link')
    }
  }

  const pushNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 10))
  }

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const selectAllOnPage = () => {
    const ids = pagedAssets.map(a => a.id)
    setSelectedIds(new Set(ids))
  }

  const clearSelection = () => setSelectedIds(new Set())

  const bulkFavorite = (fav: boolean) => {
    setAssets(prev => prev.map(a => selectedIds.has(a.id) ? { ...a, favorite: fav } : a))
    pushNotification(`${fav ? 'Favorited' : 'Unfavorited'} ${selectedIds.size} assets`)
    clearSelection()
  }

  const bulkDelete = () => {
    if (selectedIds.size === 0) return
    setAssets(prev => prev.filter(a => !selectedIds.has(a.id)))
    pushNotification(`Deleted ${selectedIds.size} assets`)
    clearSelection()
  }

  const exportSelectedJSON = () => {
    const data = assets.filter(a => selectedIds.has(a.id))
    if (data.length === 0) return toast.error('Select assets first')
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'clipio-assets.json'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Exported JSON')
    pushNotification('Exported selected assets (JSON)')
    clearSelection()
  }

  const handleUploadClick = () => fileInputRef.current?.click()
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const now = new Date().toISOString().slice(0,10)
    const readers: Promise<Asset>[] = Array.from(files).map((f, i) => new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve({
          id: Date.now() + i,
          name: f.name,
          type: 'image',
          url: String(reader.result),
          tags: [],
          collection: selectedCollection || 'Marketing',
          created: now,
          size: `${Math.max(0.1, f.size / (1024*1024)).toFixed(1)} MB`,
          favorite: false,
          rating: 0,
          notes: '',
          comments: []
        })
      }
      reader.readAsDataURL(f)
    }))

    Promise.all(readers).then(newOnes => {
      setAssets(prev => [...newOnes, ...prev])
      toast.success(`Uploaded ${newOnes.length} assets`)
      pushNotification(`Uploaded ${newOnes.length} assets`)
    })
  }

  const renameAsset = (id: number, newName: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, name: newName, editing: false } : a))
    pushNotification(`Renamed asset to ${newName}`)
  }

  const deleteAsset = (id: number) => {
    setAssets(prev => prev.filter(a => a.id !== id))
    pushNotification('Deleted asset')
  }

  const addTag = (id: number, tag: string) => {
    const t = tag.trim()
    if (!t) return
    setAssets(prev => prev.map(a => a.id === id ? { ...a, tags: Array.from(new Set([...a.tags, t.toLowerCase()])) } : a))
  }

  const removeTag = (id: number, tag: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, tags: a.tags.filter(x => x !== tag) } : a))
  }

  const setRating = (id: number, r: number) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, rating: r } : a))
  }

  const saveNotes = (id: number, notes: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, notes } : a))
  }

  const addComment = (id: number, text: string) => {
    const c = text.trim()
    if (!c) return
    setAssets(prev => prev.map(a => a.id === id ? { ...a, comments: [...(a.comments||[]), { id: String(Date.now()), author: user.name, text: c, created: new Date().toISOString() }] } : a))
  }

  const moveToCollection = (id: number, collection: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, collection } : a))
  }

  const autoTagAll = () => {
    setAssets(prev => prev.map(a => {
      const inferred: string[] = []
      const name = a.name.toLowerCase()
      if (name.includes('logo')) inferred.push('logo')
      if (name.includes('banner')) inferred.push('banner')
      if (name.includes('wireframe')) inferred.push('wireframe')
      if (name.includes('guideline')) inferred.push('guidelines')
      if (a.type === 'image') inferred.push('image')
      return { ...a, tags: Array.from(new Set([...a.tags, ...inferred])) }
    }))
    toast.success('Auto-tagged assets (mock AI)')
    pushNotification('AI auto-tagging completed')
  }

  const suggestedTags = useMemo(() => {
    const map = new Map<string, number>()
    assets.forEach(a => a.tags.forEach(t => map.set(t, (map.get(t)||0)+1)))
    return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([t])=>t)
  }, [assets])

  const resetPagination = () => setPage(1)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('clipio_assets')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setAssets(parsed)
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('clipio_assets', JSON.stringify(assets))
    } catch {}
  }, [assets])

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (img.dataset.fallbackApplied === 'true') return
    img.dataset.fallbackApplied = 'true'
    img.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&auto=format&q=80'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-charcoal-900/50 backdrop-blur-md border-r-2 border-charcoal-700/40 p-6 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <Logo size="md" animated={false} />
          <span className="text-xl font-bold text-charcoal-50">Clipio</span>
          </div>

        {/* Navigation */}
          <nav className="space-y-2">
            <div className="sidebar-item active">
              <FolderOpen className="w-5 h-5" />
            <span>Assets</span>
            <span className="ml-auto text-xs text-charcoal-400">{totalCount}</span>
            </div>
          <div className="sidebar-item" onClick={() => { setFavoritesOnly(v=>!v); resetPagination() }}>
              <Star className="w-5 h-5" />
              <span>Favorites</span>
            <span className="ml-auto text-xs text-charcoal-400">{favoritesCount}</span>
            </div>
            <div className="sidebar-item">
              <Clock className="w-5 h-5" />
              <span>Recent</span>
            <span className="ml-auto text-xs text-charcoal-400">{recentCount}</span>
            </div>
            <div className="sidebar-item">
            <Tag className="w-5 h-5" />
            <span>Tags</span>
            <span className="ml-auto text-xs text-charcoal-400">{tagsCount}</span>
            </div>
          </nav>

        <div className="mt-8 pt-8 border-t-2 border-charcoal-700/40">
          <h3 className="text-charcoal-300 text-sm font-medium mb-3">Collections</h3>
            <div className="space-y-1">
              {collections.map(collection => (
                <div
                  key={collection.id}
                className={`sidebar-item ${selectedCollection === collection.name ? 'active' : ''}`}
                onClick={() => { setSelectedCollection(selectedCollection === collection.name ? null : collection.name); resetPagination() }}
                >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: collection.color || '#3b82f6' }} />
                  <span>{collection.name}</span>
                <span className="ml-auto text-xs text-charcoal-400">{assets.filter(a => a.collection === collection.name).length}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t-2 border-charcoal-700/40">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-charcoal border-2 border-emerald-400/30">
              <User className="w-4 h-4 text-charcoal-50" />
            </div>
            <div>
              <p className="text-charcoal-100 text-sm font-medium">{user.name}</p>
              <p className="text-charcoal-400 text-xs">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-charcoal-400 hover:text-charcoal-100" onClick={()=>setShowNotifications(s=>!s)}>
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Sticky Toolbar */}
        <div className="sticky top-0 z-10 -mt-2 mb-6 backdrop-blur-md bg-charcoal-950/60 border-b border-charcoal-800/40">
          <div className="py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-charcoal-50 mb-1">
                <span className="gradient-text">{selectedCollection || 'All Assets'}</span>
              </h1>
              <p className="text-charcoal-400 text-sm">
                {filteredAssets.length} result{filteredAssets.length === 1 ? '' : 's'} • {totalCount} total
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-charcoal-900/50 border-2 border-charcoal-700/40 rounded-xl px-3 py-2">
                <ArrowUpDown className="w-4 h-4 text-charcoal-400" />
                <select value={sortKey} onChange={(e)=>{setSortKey(e.target.value as any);resetPagination()}} className="bg-transparent text-charcoal-300 focus:outline-none">
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="size">Size</option>
                </select>
                <select value={sortDir} onChange={(e)=>{setSortDir(e.target.value as any);resetPagination()}} className="bg-transparent text-charcoal-300 focus:outline-none">
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
              <Button variant="glass" size="sm" onClick={autoTagAll}><Wand2 className="w-4 h-4 mr-2" />Auto-tag</Button>
              <Button variant="gradient" onClick={handleUploadClick}><UploadIcon className="w-4 h-4 mr-2" />Upload</Button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e)=>handleFiles(e.target.files)} />
            </div>
          </div>
          {/* Filters Row */}
          <div className="pb-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 w-5 h-5" />
              <input type="text" placeholder="Search assets..." value={searchQuery} onChange={(e)=>{setSearchQuery(e.target.value);resetPagination()}} className="input-sophisticated pl-10 w-full" />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 bg-charcoal-900/50 border-2 border-charcoal-700/40 rounded-xl px-3 py-2">
                <Filter className="w-4 h-4 text-charcoal-400" />
                <select value={typeFilter} onChange={(e)=>{setTypeFilter(e.target.value as any);resetPagination()}} className="bg-transparent text-charcoal-300 focus:outline-none">
                  <option value="all">All types</option>
                  <option value="image">Images</option>
                  <option value="document">Documents</option>
                  <option value="video">Videos</option>
                  <option value="music">Audio</option>
                  <option value="archive">Archives</option>
                </select>
              </div>
              <Button variant={favoritesOnly ? 'gradient' : 'ghost'} size="sm" onClick={()=>{setFavoritesOnly(v=>!v);resetPagination()}}>
                <Heart className={`w-4 h-4 mr-2 ${favoritesOnly ? 'fill-current' : ''}`} />Favorites
              </Button>
              <Button variant="ghost" size="sm" onClick={()=>setViewMode(viewMode==='grid'?'list':'grid')}>
                {viewMode==='grid'?<List className="w-4 h-4" />:<Grid3X3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          {/* Active filter chips */}
          <div className="pb-4 flex flex-wrap gap-2">
            {selectedCollection && (
              <span className="px-3 py-1 rounded-full bg-charcoal-900/60 text-charcoal-200 text-xs border border-charcoal-700/40">Collection: {selectedCollection}</span>
            )}
            {favoritesOnly && (
              <span className="px-3 py-1 rounded-full bg-charcoal-900/60 text-charcoal-200 text-xs border border-charcoal-700/40">Favorites</span>
            )}
            {typeFilter !== 'all' && (
              <span className="px-3 py-1 rounded-full bg-charcoal-900/60 text-charcoal-200 text-xs border border-charcoal-700/40">Type: {typeFilter}</span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 rounded-full bg-charcoal-900/60 text-charcoal-200 text-xs border border-charcoal-700/40">Search: “{searchQuery}”</span>
            )}
          </div>
        </div>

        {/* Bulk actions row */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" onClick={selectAllOnPage}>Select Page</Button>
            <Button variant="glass" size="sm" onClick={clearSelection}>Clear</Button>
            <Button variant="glass" size="sm" onClick={()=>bulkFavorite(true)} disabled={selectedIds.size===0}><Heart className="w-4 h-4 mr-2" />Fav</Button>
            <Button variant="glass" size="sm" onClick={bulkDelete} disabled={selectedIds.size===0}><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
            <Button variant="glass" size="sm" onClick={exportSelectedJSON} disabled={selectedIds.size===0}>Export JSON</Button>
            <Button variant="glass" size="sm" onClick={()=>setShowInspo(s=>!s)}>Inspiration</Button>
          </div>
          <p className="text-charcoal-400 text-sm">Selected: {selectedIds.size}</p>
        </div>

        {/* Empty state */}
        {filteredAssets.length === 0 && (
          <div className="card-sophisticated p-10 text-center mb-8">
            <h3 className="text-charcoal-100 text-xl font-semibold mb-2">No assets found</h3>
            <p className="text-charcoal-400 mb-4">Try adjusting filters or upload new assets.</p>
            <div className="flex justify-center gap-2">
              <Button variant="glass" onClick={()=>{ setSearchQuery(''); setTypeFilter('all'); setFavoritesOnly(false); setSelectedCollection(null); resetPagination() }}>Clear Filters</Button>
              <Button variant="gradient" onClick={handleUploadClick}><UploadIcon className="w-4 h-4 mr-2" />Upload</Button>
            </div>
          </div>
        )}

        {/* Assets */}
        {viewMode === 'grid' ? (
          <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
            {pagedAssets.map((asset) => (
              <div key={asset.id} className="card-sophisticated hover-lift group">
                <div className="flex items-center justify-between px-3 pt-3">
                  <label className="flex items-center gap-2 text-charcoal-300 text-sm">
                    <input type="checkbox" checked={selectedIds.has(asset.id)} onChange={()=>toggleSelection(asset.id)} />
                    Select
                  </label>
                  <div className="flex items-center gap-1">
                    <select className="bg-charcoal-900/50 text-charcoal-300 text-xs rounded px-2 py-1 border border-charcoal-700/40" value={asset.collection} onChange={(e)=>moveToCollection(asset.id, e.target.value)}>
                      {collections.map(c=>(<option key={c.id} value={c.name}>{c.name}</option>))}
                    </select>
                    <Button variant="ghost" size="sm" onClick={()=>setAssets(prev=>prev.map(a=>a.id===asset.id?{...a, editing: !a.editing}:a))}><Edit3 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={()=>deleteAsset(asset.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                {/* Preview */}
                <div className="relative aspect-video bg-charcoal-800 rounded-t-xl overflow-hidden">
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" onError={handleImgError} />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3 bg-charcoal-900/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                    {getAssetIcon(asset.type)}
                    <span className="text-xs text-charcoal-300 capitalize">{asset.type}</span>
                </div>
                  <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-charcoal-900/80 hover:bg-charcoal-800/80" onClick={() => toggleFavorite(asset.id)}>
                      <Heart className={`w-4 h-4 ${asset.favorite ? 'text-rose-500 fill-current' : 'text-charcoal-300'}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-charcoal-900/80 hover:bg-charcoal-800/80" onClick={() => downloadAsset(asset.url, asset.name)}>
                      <Download className="w-4 h-4 text-charcoal-300" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-charcoal-900/80 hover:bg-charcoal-800/80" onClick={() => shareAsset(asset.url)}>
                      <Share2 className="w-4 h-4 text-charcoal-300" />
                    </Button>
              </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  {asset.editing ? (
                    <div className="flex items-center gap-2 mb-3">
                      <input defaultValue={asset.name} className="input-sophisticated flex-1" onKeyDown={(e)=>{ if(e.key==='Enter'){ renameAsset(asset.id, (e.target as HTMLInputElement).value) }}} />
                      <Button variant="ghost" size="sm" onClick={()=>setAssets(prev=>prev.map(a=>a.id===asset.id?{...a, editing:false}:a))}><X className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={()=>{
                        const input = (document.activeElement as HTMLInputElement)
                        renameAsset(asset.id, input && input.value ? input.value : asset.name)
                      }}><Check className="w-4 h-4" /></Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-charcoal-100 truncate">{asset.name}</h3>
                      <div className="flex items-center">
                        {[1,2,3,4,5].map(r => (
                          <button key={r} onClick={()=>setRating(asset.id, r)}>
                            <Star className={`w-4 h-4 ${((asset.rating||0) >= r) ? 'text-amber-400 fill-current' : 'text-charcoal-500'}`} />
                          </button>
                        ))}
                </div>
              </div>
                  )}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs text-charcoal-400 bg-charcoal-800 px-2 py-1 rounded">{asset.collection}</span>
                    <span className="text-xs text-charcoal-400">{asset.size}</span>
                </div>
                  {/* Tags management */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {asset.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-charcoal-300 bg-charcoal-800/50 px-2 py-1 rounded inline-flex items-center gap-1">
                        {tag}
                        <button onClick={()=>removeTag(asset.id, tag)} className="text-charcoal-500 hover:text-charcoal-300"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                </div>
                  <div className="flex items-center gap-2 mb-3">
                    <input placeholder="Add tag" className="input-sophisticated flex-1" onKeyDown={(e)=>{ if(e.key==='Enter'){ addTag(asset.id, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value='' } }} />
                    <Button variant="ghost" size="sm" onClick={()=>addTag(asset.id, 'inspiration')}><Tag className="w-4 h-4" /></Button>
              </div>
                  {/* Notes */}
                  <textarea placeholder="Notes / annotations" className="input-sophisticated w-full h-20" defaultValue={asset.notes} onBlur={(e)=>saveNotes(asset.id, e.target.value)} />
                  {/* Comments */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <input placeholder="Add comment" className="input-sophisticated flex-1" onKeyDown={(e)=>{ if(e.key==='Enter'){ addComment(asset.id, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value='' } }} />
                      <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
        </div>
                    {!!asset.comments && asset.comments.length>0 && (
                      <div className="mt-2 space-y-1 text-charcoal-300 text-sm max-h-24 overflow-auto">
                        {asset.comments.map(c => (
                          <div key={c.id} className="flex items-center justify-between bg-charcoal-900/40 border border-charcoal-700/40 rounded px-2 py-1">
                            <span className="truncate">{c.author}: {c.text}</span>
                            <span className="text-xs text-charcoal-500">{new Date(c.created).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                          )}
                        </div>
                      </div>
              </div>
              ))}
            </div>
          ) : (
          <div className="space-y-3">
            {pagedAssets.map(asset => (
              <div key={asset.id} className="card-sophisticated hover-lift p-4 flex items-center gap-4">
                <label className="flex items-center gap-2 text-charcoal-300 text-sm">
                  <input type="checkbox" checked={selectedIds.has(asset.id)} onChange={()=>toggleSelection(asset.id)} />
                </label>
                <div className="w-36 h-24 rounded-lg overflow-hidden bg-charcoal-800">
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" onError={handleImgError} />
                        </div>
                        <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-charcoal-100 truncate">{asset.name}</h3>
                      <div className="mt-1 text-sm text-charcoal-300 line-clamp-1">
                        {asset.collection} • {asset.size}
                          </div>
                        </div>
                    <div className="flex items-center gap-2">
                      <select className="bg-charcoal-900/50 text-charcoal-300 text-xs rounded px-2 py-1 border border-charcoal-700/40" value={asset.collection} onChange={(e)=>moveToCollection(asset.id, e.target.value)}>
                        {collections.map(c=>(<option key={c.id} value={c.name}>{c.name}</option>))}
                      </select>
                      <Button variant="ghost" size="sm" onClick={() => toggleFavorite(asset.id)}>
                        <Heart className={`w-4 h-4 ${asset.favorite ? 'text-rose-500 fill-current' : 'text-charcoal-300'}`} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => downloadAsset(asset.url, asset.name)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => shareAsset(asset.url)}>
                        <Share2 className="w-4 h-4" />
                          </Button>
                      <Button variant="ghost" size="sm" onClick={()=>deleteAsset(asset.id)}>
                        <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                  <div className="mt-2 flex items-center gap-2">
                    {[1,2,3,4,5].map(r => (
                      <button key={r} onClick={()=>setRating(asset.id, r)}>
                        <Star className={`w-4 h-4 ${((asset.rating||0) >= r) ? 'text-amber-400 fill-current' : 'text-charcoal-500'}`} />
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {asset.tags.slice(0, 5).map((tag, i) => (
                      <span key={i} className="text-xs text-charcoal-300 bg-charcoal-800/50 px-2 py-1 rounded inline-flex items-center gap-1">{tag}<button onClick={()=>removeTag(asset.id, tag)}><X className="w-3 h-3 text-charcoal-500" /></button></span>
                    ))}
                    <div className="flex items-center gap-2 ml-2">
                      <input placeholder="Add tag" className="input-sophisticated h-8" onKeyDown={(e)=>{ if(e.key==='Enter'){ addTag(asset.id, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value='' } }} />
                      <Button variant="ghost" size="sm"><Tag className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2 text-charcoal-300">
            <span>Rows per page</span>
            <select value={pageSize} onChange={(e)=>{ setPageSize(parseInt(e.target.value, 10)); setPage(1) }} className="bg-transparent text-charcoal-300 focus:outline-none border-2 border-charcoal-700/40 rounded-lg px-2 py-1">
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>
          <div className="flex items-center gap-4 text-charcoal-300">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        {/* Notifications panel */}
        {showNotifications && (
          <div className="fixed bottom-6 right-6 w-80 card-sophisticated p-4 max-h-96 overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-charcoal-100 font-semibold">Activity</h3>
              <Button variant="ghost" size="sm" onClick={()=>setShowNotifications(false)}><X className="w-4 h-4" /></Button>
            </div>
            <ul className="text-charcoal-300 text-sm space-y-2">
              {notifications.length===0 && <li>No activity yet</li>}
              {notifications.map((n,i)=>(<li key={i} className="bg-charcoal-900/40 border border-charcoal-700/40 rounded px-2 py-1">{n}</li>))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
