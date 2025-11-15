import { createFileRoute } from '@tanstack/react-router'
import {useUser,useClerk} from '@clerk/clerk-react'
import PrivateLayout from '../../combonents/ui/PrivateLayout'
import { useState, useMemo, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Note } from '../../types/types'
import { CATEGORIES } from '../../staticdata/features'
export const Route = createFileRoute('/app/notes')({
  component: RouteComponent,
})





function RouteComponent() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
/* Clerk */
  const { user } = useUser();
  console.log('Clerk User:', user);
  const { data: notes = [], isLoading } = useQuery<Note[], Error>({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/notes')
      if (!res.ok) throw new Error('Failed to load notes')
      const json = await res.json()
      return json.data ?? []
    },
  })

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<Note>) => {
      const res = await fetch('http://localhost:3000/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Create failed')
      return res.json()
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['notes'] as const })
      setShowForm(false)
      if (formRef.current) formRef.current.reset()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number | string; payload: Partial<Note> }) => {
      const res = await fetch(`http://localhost:3000/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Update failed')
      return res.json()
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['notes'] as const })
      setShowForm(false)
      setEditingNote(null)
      if (formRef.current) formRef.current.reset()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      const res = await fetch(`http://localhost:3000/notes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      return res.json()
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['notes'] as const })
    },
  })

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesCategory = filterCategory === 'all' || note.category === filterCategory
        const matchesSearch =
          searchQuery === '' ||
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [notes, filterCategory, searchQuery])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    const fd = new FormData(form)
    const payload = {
      title: fd.get('title') as string,
      content: fd.get('content') as string,
      category: fd.get('category') as Note['category'],
    }

    try {
      if (editingNote) {
        await updateMutation.mutateAsync({ id: editingNote.id, payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingNote(null)
    setShowForm(false)
    if (formRef.current) formRef.current.reset()
  }

  const handleDelete = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this note?')) return
    try {
      await deleteMutation.mutateAsync(id)
    } catch (err) {
      console.error(err)
    }
  }

  const getCategoryStyle = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.color ?? 'bg-gray-100 text-gray-800'
  }

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.label ?? category
  }

  return (
    <PrivateLayout>
      <div className="flex-1 min-h-screen bg-slate-50 p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-black">Job Hunt Journal</h1>
              <p className="text-sm text-gray-600 mt-1">Document your observations, insights, and progress</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {showForm ? 'Cancel' : '+ New Note'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white shadow rounded p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-black">{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                    <input
                      name="title"
                      required
                      defaultValue={editingNote?.title ?? ''}
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white"
                      placeholder="e.g., Interview with Tech Corp, LinkedIn networking tips..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                    <select
                      name="category"
                      required
                      defaultValue={editingNote?.category ?? 'other'}
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Content</label>
                    <textarea
                      name="content"
                      required
                      rows={8}
                      defaultValue={editingNote?.content ?? ''}
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white"
                      placeholder="Write your thoughts, observations, and reflections here..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={createMutation.status === 'pending' || updateMutation.status === 'pending'}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                    >
                      {editingNote ? 'Update Note' : 'Save Note'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white shadow rounded p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white"
                />
              </div>
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full md:w-48 border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-gray-500">Loading notes...</div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-white shadow rounded p-12 text-center">
              <p className="text-gray-600 mb-2">
                {searchQuery || filterCategory !== 'all' ? 'No notes match your filters' : 'No notes yet'}
              </p>
              <p className="text-sm text-gray-500">
                {searchQuery || filterCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start documenting your job hunt journey by creating your first note'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <div key={note.id} className="bg-white shadow rounded p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-black">{note.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryStyle(note.category)}`}>
                          {getCategoryLabel(note.category)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap">{note.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  )
}
