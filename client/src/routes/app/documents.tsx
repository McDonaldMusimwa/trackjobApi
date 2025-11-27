import { createFileRoute } from '@tanstack/react-router'
import PrivateLayout from '../../combonents/ui/PrivateLayout'
import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-react'
import { Upload, FileText, Trash2, Download } from 'lucide-react'

export const Route = createFileRoute('/app/documents')({
  component: RouteComponent,
})

type Document = {
  id: number
  name: string
  type: 'resume' | 'coverLetter'
  url: string
  uploadedAt: string
  size: number
}

function RouteComponent() {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter'>('resume')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadUrlData, setUploadUrlData] = useState<{ uploadUrl: string; fileKey: string } | null>(null)
  const [isRequestingUrl, setIsRequestingUrl] = useState(false)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const coverLetterInputRef = useRef<HTMLInputElement>(null)

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['documents', user?.id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/documents/${user?.id}`)
      if (!res.ok) throw new Error('Failed to fetch documents')
      const json = await res.json()
      return json.data ?? []
    },
    enabled: !!user?.id,
  })

  // Upload mutation - using presigned URL flow
  const uploadMutation = useMutation({
    mutationFn: async ({ file, type, urlData }: { file: File; type: 'resume' | 'coverLetter'; urlData: { uploadUrl: string; fileKey: string } }) => {
      const { uploadUrl, fileKey } = urlData

      // Step 2: Upload file directly to S3 using presigned URL
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file to S3')
      }

      // Step 3: Confirm upload with backend to save metadata
      const confirmRes = await fetch('http://localhost:3000/documents/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          fileName: file.name,
          fileKey,
          fileSize: file.size,
          documentType: type,
        }),
      })

      if (!confirmRes.ok) {
        const error = await confirmRes.json()
        throw new Error(error.error || 'Failed to confirm upload')
      }

      return confirmRes.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      if (resumeInputRef.current) resumeInputRef.current.value = ''
      if (coverLetterInputRef.current) coverLetterInputRef.current.value = ''
      setSelectedFile(null)
      setUploadUrlData(null)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const res = await fetch(`http://localhost:3000/documents/${documentId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Delete failed')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  const handleFileSelect = () => {
    // Clear any previously selected file and URL data
    setSelectedFile(null)
    setUploadUrlData(null)
    const input = activeTab === 'resume' ? resumeInputRef.current : coverLetterInputRef.current
    input?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setSelectedFile(null)
      setUploadUrlData(null)
      return
    }

    // Store selected file immediately to show in UI
    setSelectedFile(file)

    // Request presigned URL in background while user reviews selection
    setIsRequestingUrl(true)
    try {
      const uploadUrlRes = await fetch('http://localhost:3000/documents/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          documentType: activeTab,
        }),
      })

      if (!uploadUrlRes.ok) {
        const error = await uploadUrlRes.json()
        throw new Error(error.error || 'Failed to get upload URL')
      }

      const responseData = await uploadUrlRes.json()
      setUploadUrlData({
        uploadUrl: responseData.data.uploadUrl,
        fileKey: responseData.data.fileKey,
      })
    } catch (error) {
      console.error('Error getting upload URL:', error)
      alert('Failed to prepare upload. Please try again.')
      setSelectedFile(null)
      if (resumeInputRef.current) resumeInputRef.current.value = ''
      if (coverLetterInputRef.current) coverLetterInputRef.current.value = ''
    } finally {
      setIsRequestingUrl(false)
    }
  }

  const handleUpload = () => {
    if (!selectedFile || !uploadUrlData) return

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!validTypes.includes(selectedFile.type)) {
      alert(`Invalid file type. Please upload a PDF or Word document.`)
      setSelectedFile(null)
      setUploadUrlData(null)
      if (resumeInputRef.current) resumeInputRef.current.value = ''
      if (coverLetterInputRef.current) coverLetterInputRef.current.value = ''
      return
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      setSelectedFile(null)
      setUploadUrlData(null)
      if (resumeInputRef.current) resumeInputRef.current.value = ''
      if (coverLetterInputRef.current) coverLetterInputRef.current.value = ''
      return
    }

    // Trigger upload with pre-fetched URL
    uploadMutation.mutate({ file: selectedFile, type: activeTab, urlData: uploadUrlData })
  }

  const filteredDocuments = documents.filter(doc => doc.type === activeTab)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <PrivateLayout>
      <div className="flex-1 min-h-screen bg-slate-50 p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black">Documents</h1>
            <p className="text-gray-600 mt-1">Manage your resumes and cover letters</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => {
                    setActiveTab('resume')
                    setSelectedFile(null)
                    setUploadUrlData(null)
                  }}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'resume'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="inline-block w-5 h-5 mr-2" />
                  Resumes ({documents.filter(d => d.type === 'resume').length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('coverLetter')
                    setSelectedFile(null)
                    setUploadUrlData(null)
                  }}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'coverLetter'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="inline-block w-5 h-5 mr-2" />
                  Cover Letters ({documents.filter(d => d.type === 'coverLetter').length})
                </button>
              </nav>
            </div>

            {/* Upload Section */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    Upload {activeTab === 'resume' ? 'Resume' : 'Cover Letter'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
                <button
                  onClick={selectedFile ? handleUpload : handleFileSelect}
                  disabled={uploadMutation.status === 'pending' || (selectedFile && (isRequestingUrl || !uploadUrlData))}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {uploadMutation.status === 'pending' ? 'Uploading...' : selectedFile ? (isRequestingUrl ? 'Preparing...' : 'Upload') : 'Select File'}
                </button>
              </div>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={coverLetterInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Documents List */}
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading documents...</div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTab === 'resume' ? 'resumes' : 'cover letters'} yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Upload your first {activeTab === 'resume' ? 'resume' : 'cover letter'} to get started
                  </p>
                  <button
                    onClick={handleFileSelect}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select File
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <FileText className="w-10 h-10 text-blue-500 flex-shrink-0" />
                        <div className="ml-4 flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {doc.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(`http://localhost:3000/documents/download/${doc.id}`)
                              if (!res.ok) throw new Error('Failed to get download URL')
                              const { downloadUrl } = await res.json()
                              window.open(downloadUrl, '_blank')
                            } catch (error) {
                              alert('Failed to download document')
                            }
                          }}
                          className="inline-flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this document?')) {
                              deleteMutation.mutate(doc.id)
                            }
                          }}
                          disabled={deleteMutation.status === 'pending'}
                          className="inline-flex items-center px-3 py-2 text-sm text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  )
}
 