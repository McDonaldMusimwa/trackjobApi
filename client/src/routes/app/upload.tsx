import { createFileRoute } from '@tanstack/react-router'
import PrivateLayout from '../../combonents/ui/PrivateLayout'
import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/app/upload')({
  component: RouteComponent,
})

type UploadItem = {
  id: number | string
  filename: string
  url?: string
  size?: number
  uploadedAt?: string
}

function RouteComponent() {
  const queryClient = useQueryClient()

  // fetch lists
  const { data: resumes = [], isLoading: resumesLoading } = useQuery<UploadItem[], Error>({
    queryKey: ['uploads', 'resumes'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/uploads/resumes')
      if (!res.ok) throw new Error('Failed to load resumes')
      const json = await res.json()
      return json.data ?? []
    },
  })

  const { data: coverletters = [], isLoading: coverLoading } = useQuery<UploadItem[], Error>({
    queryKey: ['uploads', 'coverletters'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/uploads/coverletters')
      if (!res.ok) throw new Error('Failed to load cover letters')
      const json = await res.json()
      return json.data ?? []
    },
  })

  const { data: csvs = [], isLoading: csvLoading } = useQuery<UploadItem[], Error>({
    queryKey: ['uploads', 'csvs'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/uploads/csvs')
      if (!res.ok) throw new Error('Failed to load csvs')
      const json = await res.json()
      return json.data ?? []
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async ({ endpoint, formData }: { endpoint: string; formData: FormData }) => {
      const res = await fetch(endpoint, { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      return res.json()
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['uploads'] as const })
      queryClient.invalidateQueries({ queryKey: ['uploads', 'resumes'] as const })
      queryClient.invalidateQueries({ queryKey: ['uploads', 'coverletters'] as const })
      queryClient.invalidateQueries({ queryKey: ['uploads', 'csvs'] as const })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ endpoint }: { endpoint: string }) => {
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      return res.json()
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['uploads'] as const })
      queryClient.invalidateQueries({ queryKey: ['uploads', 'resumes'] as const })
      queryClient.invalidateQueries({ queryKey: ['uploads', 'coverletters'] as const })
      queryClient.invalidateQueries({ queryKey: ['uploads', 'csvs'] as const })
    },
  })

  // refs to file inputs
  const resumeRef = useRef<HTMLInputElement | null>(null)
  const coverRef = useRef<HTMLInputElement | null>(null)
  const csvRef = useRef<HTMLInputElement | null>(null)

  const handleUpload = async (type: 'resume' | 'cover' | 'csv') => {
    let input: HTMLInputElement | null = null
    let endpoint = ''
    if (type === 'resume') {
      input = resumeRef.current
      endpoint = 'http://localhost:3000/uploads/resumes'
    } else if (type === 'cover') {
      input = coverRef.current
      endpoint = 'http://localhost:3000/uploads/coverletters'
    } else {
      input = csvRef.current
      endpoint = 'http://localhost:3000/uploads/csvs'
    }
    if (!input || !input.files || input.files.length === 0) return alert('Please select a file to upload')
    const file = input.files[0]
    // basic validation
    if (type === 'csv' && file.name.split('.').pop()?.toLowerCase() !== 'csv') return alert('Please select a CSV file')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('filename', file.name)

    try {
      await uploadMutation.mutateAsync({ endpoint, formData: fd })
      if (input) input.value = ''
    } catch (err: any) {
      alert(err?.message ?? 'Upload error')
    }
  }

  const handleDelete = async (type: 'resume' | 'cover' | 'csv', id: number | string) => {
    let endpoint = ''
    if (type === 'resume') endpoint = `http://localhost:3000/uploads/resumes/${id}`
    if (type === 'cover') endpoint = `http://localhost:3000/uploads/coverletters/${id}`
    if (type === 'csv') endpoint = `http://localhost:3000/uploads/csvs/${id}`
    try {
      await deleteMutation.mutateAsync({ endpoint })
    } catch (err: any) {
      alert(err?.message ?? 'Delete error')
    }
  }

  return (
    <PrivateLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Uploads</h1>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Resumes</h2>
          <div className="flex gap-3 items-center mb-3">
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500" />
            <button onClick={() => handleUpload('resume')} className="px-4 py-2 bg-blue-600 text-white rounded">Upload Resume</button>
            {uploadMutation.status === 'pending' && <span className="text-sm text-gray-500">Uploading...</span>}
          </div>

          <div>
            {resumesLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : resumes.length === 0 ? (
              <div className="text-sm text-gray-600">No resumes uploaded yet.</div>
            ) : (
              <ul className="space-y-2">
                {resumes.map((r: UploadItem) => (
                  <li key={r.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                    <div>
                      <div className="font-medium">{r.filename}</div>
                      <div className="text-xs text-gray-500">{r.uploadedAt ?? ''} • {r.size ? `${Math.round(r.size/1024)} KB` : ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.url && <a className="text-blue-600" href={r.url} target="_blank" rel="noreferrer">Download</a>}
                      <button onClick={() => handleDelete('resume', r.id)} className="text-sm px-3 py-1 border rounded">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Cover Letters</h2>
          <div className="flex gap-3 items-center mb-3">
            <input ref={coverRef} type="file" accept=".pdf,.doc,.docx" className="border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500" />
            <button onClick={() => handleUpload('cover')} className="px-4 py-2 bg-blue-600 text-white rounded">Upload Cover Letter</button>
          </div>

          <div>
            {coverLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : coverletters.length === 0 ? (
              <div className="text-sm text-gray-600">No cover letters uploaded yet.</div>
            ) : (
              <ul className="space-y-2">
                {coverletters.map((r: UploadItem) => (
                  <li key={r.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                    <div>
                      <div className="font-medium">{r.filename}</div>
                      <div className="text-xs text-gray-500">{r.uploadedAt ?? ''} • {r.size ? `${Math.round(r.size/1024)} KB` : ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.url && <a className="text-blue-600" href={r.url} target="_blank" rel="noreferrer">Download</a>}
                      <button onClick={() => handleDelete('cover', r.id)} className="text-sm px-3 py-1 border rounded">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">CSV of Job Applications</h2>
          <div className="flex gap-3 items-center mb-3">
            <input ref={csvRef} type="file" accept=".csv" className="border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500" />
            <button onClick={() => handleUpload('csv')} className="px-4 py-2 bg-blue-600 text-white rounded">Upload CSV</button>
          </div>

          <div>
            {csvLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : csvs.length === 0 ? (
              <div className="text-sm text-gray-600">No CSV uploads yet.</div>
            ) : (
              <ul className="space-y-2">
                {csvs.map((r: UploadItem) => (
                  <li key={r.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                    <div>
                      <div className="font-medium">{r.filename}</div>
                      <div className="text-xs text-gray-500">{r.uploadedAt ?? ''} • {r.size ? `${Math.round(r.size/1024)} KB` : ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.url && <a className="text-blue-600" href={r.url} target="_blank" rel="noreferrer">Download</a>}
                      <button onClick={() => handleDelete('csv', r.id)} className="text-sm px-3 py-1 border rounded">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </PrivateLayout>
  )
}

export default RouteComponent

