'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Sparkles, Tag, Link, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { formatFileSize, getFileTypeFromUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AssetUploadProps {
  onClose: () => void
  onUpload: (asset: any) => void
}

interface UploadFile {
  file: File
  preview: string
  id: string
}

export default function AssetUpload({ onClose, onUpload }: AssetUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [urls, setUrls] = useState<string[]>([''])
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiTags, setAiTags] = useState<string[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }))
    setUploadFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: true
  })

  const removeFile = (id: string) => {
    setUploadFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const addUrl = () => {
    setUrls(prev => [...prev, ''])
  }

  const updateUrl = (index: number, value: string) => {
    setUrls(prev => prev.map((url, i) => i === index ? value : url))
  }

  const removeUrl = (index: number) => {
    setUrls(prev => prev.filter((_, i) => i !== index))
  }

  const generateAITags = async () => {
    setIsProcessing(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockTags = ['design', 'inspiration', 'creative', 'modern', 'minimal', 'ui', 'ux']
    const randomTags = mockTags.sort(() => 0.5 - Math.random()).slice(0, 4)
    setAiTags(randomTags)
    setIsProcessing(false)
    toast.success('AI tags generated!')
  }

  const handleUpload = async () => {
    setIsProcessing(true)
    
    try {
      // Process files
      for (const uploadFile of uploadFiles) {
        const asset = {
          title: uploadFile.file.name,
          description: '',
          url: uploadFile.preview,
          file_type: getFileTypeFromUrl(uploadFile.file.name),
          file_size: uploadFile.file.size,
          tags: aiTags,
          ai_tags: aiTags
        }
        await onUpload(asset)
      }

      // Process URLs
      for (const url of urls.filter(u => u.trim())) {
        const asset = {
          title: url.split('/').pop() || 'Web Asset',
          description: '',
          url: url.trim(),
          file_type: getFileTypeFromUrl(url),
          file_size: 0,
          tags: aiTags,
          ai_tags: aiTags
        }
        await onUpload(asset)
      }

      toast.success('Assets uploaded successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to upload assets')
      console.error('Upload error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Upload Assets</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Drag & Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
              isDragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <p className="text-white text-lg mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-white/60">or click to browse</p>
            <p className="text-white/40 text-sm mt-2">
              Supports images, videos, PDFs, and more
            </p>
          </div>

          {/* URL Input */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Link className="w-5 h-5" />
              Add URLs
            </h3>
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  className="flex-1 bg-white/5 border-white/20 text-white placeholder-white/40"
                />
                {urls.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUrl(index)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addUrl}
              className="text-white border-white/20 hover:bg-white/10"
            >
              Add Another URL
            </Button>
          </div>

          {/* AI Tags */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Tags
              </h3>
              <Button
                variant="gradient"
                size="sm"
                onClick={generateAITags}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generate Tags
              </Button>
            </div>
            
            {aiTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {aiTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {(uploadFiles.length > 0 || urls.some(u => u.trim())) && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadFiles.map((uploadFile) => (
                  <Card key={uploadFile.id} className="glass-effect border-white/10">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-lg flex items-center justify-center">
                        {uploadFile.file.type.startsWith('image/') ? (
                          <img
                            src={uploadFile.preview}
                            alt={uploadFile.file.name}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <FileText className="w-8 h-8 text-white/40" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-white text-sm font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <p className="text-white/60 text-xs">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        className="absolute top-2 right-2 w-6 h-6 p-0 bg-black/50 hover:bg-black/70"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                
                {urls.filter(u => u.trim()).map((url, index) => (
                  <Card key={`url-${index}`} className="glass-effect border-white/10">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-lg flex items-center justify-center">
                        <Link className="w-8 h-8 text-white/40" />
                      </div>
                      <div className="p-3">
                        <p className="text-white text-sm font-medium truncate">
                          {url.split('/').pop() || 'Web Asset'}
                        </p>
                        <p className="text-white/60 text-xs">
                          {getFileTypeFromUrl(url)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleUpload}
              disabled={isProcessing || (uploadFiles.length === 0 && !urls.some(u => u.trim()))}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Assets
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
