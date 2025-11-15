import { createFileRoute } from '@tanstack/react-router'
import PrivateLayout from '../../combonents/ui/PrivateLayout'
import { useQuery } from '@tanstack/react-query'
import type { Application } from '../../types/types'

export const Route = createFileRoute('/app/application')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')

  const { data: application, isLoading, error } = useQuery<Application | null, Error>({
    enabled: !!id,
    queryKey: ['application', id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/applications/${id}`)
      if (!res.ok) throw new Error('Failed to load application')
      const json = await res.json()
      return json.data ?? null
    },
  })

  return (
    <PrivateLayout>
      <div className="flex-1 min-h-screen bg-slate-50 p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-black">Application Details</h1>
            <div className="flex gap-3">
              <a href="/app/applications" className="px-4 py-2 border rounded hover:bg-gray-50">Back to List</a>
              {id && (
                <a href={`/app/addapplication?id=${encodeURIComponent(id)}`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit</a>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-600">Error loading application</div>
          ) : !application ? (
            <div className="text-gray-600">Application not found</div>
          ) : (
            <div className="bg-white shadow rounded p-6 space-y-6">
              {/* Job Information */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-black">Job Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Job Title</label>
                    <p className="mt-1 text-black">{application.job?.jobtitle ?? '—'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Company</label>
                    <p className="mt-1 text-black">{application.job?.companyname ?? '—'}</p>
                  </div>
                  {application.job?.joblink && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600">Job Link</label>
                      <a href={application.job.joblink} target="_blank" rel="noreferrer" className="mt-1 text-blue-600 hover:underline break-all">{application.job.joblink}</a>
                    </div>
                  )}
                  {application.job?.comments && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600">Job Comments</label>
                      <p className="mt-1 text-black whitespace-pre-wrap">{application.job.comments}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Application Information */}
              <section className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Application Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <p className="mt-1 text-black">{application.status ?? 'PENDING'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Applied Date</label>
                    <p className="mt-1 text-black">{application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : '—'}</p>
                  </div>
                  {application.resume && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Resume</label>
                      <p className="mt-1 text-black">{application.resume}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Created</label>
                    <p className="mt-1 text-black">{application.createdAt ? new Date(application.createdAt).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
              </section>

              {/* Cover Letter */}
              {application.coverLetter && (
                <section className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-black">Cover Letter</h2>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-black whitespace-pre-wrap">{application.coverLetter}</p>
                  </div>
                </section>
              )}

              {/* Notes */}
              {application.notes && (
                <section className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-black">Notes</h2>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-black whitespace-pre-wrap">{application.notes}</p>
                  </div>
                </section>
              )}

              {/* User Information */}
              {application.user && (
                <section className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-black">Submitted By</h2>
                  <div className="flex items-center gap-3">
                    {application.user.avatar && (
                      <img src={application.user.avatar} alt={application.user.name ?? ''} className="w-12 h-12 rounded-full" />
                    )}
                    <div>
                      <p className="font-medium text-black">{application.user.name ?? '—'}</p>
                      <p className="text-sm text-gray-600">{application.user.email ?? '—'}</p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  )
}
