// edited by assistant to be relative
import { createFileRoute } from '@tanstack/react-router'
import PrivateLayout from '../../combonents/ui/PrivateLayout'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Application } from '../../types/types'
export const Route = createFileRoute('/app/applications')({
  component: RouteComponent,
})


function RouteComponent() {
  const fetcher = async (url: string): Promise<Application[]> => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Network error')
    const json = await res.json()
    return json.data ?? []
  }

  const { data: applications = [], isLoading, error } = useQuery<Application[], Error>({
    queryKey: ['applications'],
    queryFn: () => fetcher('http://localhost:3000/applications/user/7'),
  })

  const sorted = useMemo(() => {
    return [...applications].sort((a, b) => {
      const da = a.appliedDate ? new Date(a.appliedDate).getTime() : 0
      const db = b.appliedDate ? new Date(b.appliedDate).getTime() : 0
      return db - da
    })
  }, [applications])
console.log('applications route render', sorted)
  return (
    <PrivateLayout>
      <div className="flex-1 min-h-screen bg-slate-50 p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Applications</h1>
            <div>
              <a href="/app/addapplication" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Add Application</a>
            </div>
          </div>

          {isLoading ? (
            <div className="text-gray-500">Loading applications...</div>
          ) : error ? (
            <div className="text-red-600">Error loading applications</div>
          ) : applications.length === 0 ? (
            <div className="text-gray-600">No applications found. Click "Add Application" to create one.</div>
          ) : (
            <div className="bg-white shadow rounded overflow-hidden">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3 w-48">Company</th>
                    <th className="text-left p-3 w-40">Status</th>
                    <th className="text-left p-3 w-44">Applied</th>
                    <th className="text-right p-3 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((app) => (
                    <tr key={app.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{app.title ?? '—'}</td>
                      <td className="p-3">{app.company ?? '—'}</td>
                      <td className="p-3">{app.status ?? 'PENDING'}</td>
                      <td className="p-3">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : '—'}</td>
                      <td className="p-3 text-right">
                        <a href={`/app/addapplication?id=${encodeURIComponent(app.id)}`} className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Edit</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  )
}
