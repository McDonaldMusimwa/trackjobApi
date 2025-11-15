import { createFileRoute } from '@tanstack/react-router'
import PrivateLayout from '../../combonents/ui/PrivateLayout'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-react'
import type { Application as AppType, JobStatus } from '../../types/types'

export const Route = createFileRoute('/app/addapplication')({
  component: RouteComponent,
})

function RouteComponent() {
  // read optional ?id= from query string to support edit
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')

  const queryClient = useQueryClient()
  const { user } = useUser()
  const formRef = useRef<HTMLFormElement | null>(null)
  const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Network error')
    return res.json()
  }

  // fetch jobs for job select
  const { data: jobsData = [], isLoading: jobsLoading } = useQuery<any[], Error>({
    queryKey: ['jobs'],
    queryFn: () => fetcher('http://localhost:3000/jobs').then((j) => j.data ?? []),
  })

  const { data: appData, isLoading: appLoading } = useQuery<AppType | null, Error>({
    enabled: !!id,
    queryKey: ['application', id],
    queryFn: () => fetcher(`http://localhost:3000/applications/${id}`).then((r) => r.data ?? null),
  })

  // uncontrolled form defaults derived from appData when editing
  const defaults = {
    jobId: appData?.jobId ?? '',
    status: (appData?.status as JobStatus) ?? 'APPLIED',
    appliedDate: appData?.appliedDate ? new Date(appData.appliedDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    resume: appData?.resume ?? '',
    coverLetter: appData?.coverLetter ?? '',
    notes: appData?.notes ?? '',
    companyname: appData?.job?.companyname ?? '',
    jobtitle: appData?.job?.jobtitle ?? '',
    joblink: appData?.job?.joblink ?? '',
    comments: appData?.job?.comments ?? '',
  }

  const [showJobFields, setShowJobFields] = useState<boolean>(!appData?.jobId)
  useEffect(() => {
    setShowJobFields(!appData?.jobId)
  }, [appData])

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('http://localhost:3000/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Create failed')
      return res.json()
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['applications'] as const })
      window.location.href = '/app/applications'
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`http://localhost:3000/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Update failed')
      return res.json()
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['applications'] as const })
      window.location.href = '/app/applications'
    },
  })

  const saving = (createMutation as any).status === 'loading' || (updateMutation as any).status === 'loading'

  const jobs = jobsData ?? []

  const statuses: JobStatus[] = useMemo(() => ['APPLIED','INTERVIEWING','PENDING','OFFER','REJECTED','SAVED'], [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const f = formRef.current
    if (!f) return
    const fd = new FormData(f)

    const jobIdVal = fd.get('job')
    const statusVal = fd.get('status') as string | null
    const appliedDateVal = fd.get('applieddate') as string | null
    const coverLetterVal = fd.get('coverletter') as string | null
    const resumeVal = fd.get('resume') as string | null
    const notesVal = fd.get('notes') as string | null

    let payload: any
    if (jobIdVal && String(jobIdVal).trim() !== '') {
      payload = {
        jobId: Number(jobIdVal),
        status: statusVal ?? 'APPLIED',
        appliedDate: appliedDateVal ?? undefined,
        coverLetter: coverLetterVal ?? null,
        resume: resumeVal ?? null,
        notes: notesVal ?? null,
      }
    } else {
      // nested job
      payload = {
        job: {
          companyname: fd.get('companyname') ?? '',
          jobtitle: fd.get('jobtitle') ?? '',
          joblink: fd.get('joblink') ?? '',
          comments: fd.get('comments') ?? null,
          published: fd.get('published') ? true : false,
        },
        status: statusVal ?? 'APPLIED',
        appliedDate: appliedDateVal ?? undefined,
        coverLetter: coverLetterVal ?? null,
        resume: resumeVal ?? null,
        notes: notesVal ?? null,
      }
    }

    if (user) {
      payload.clerkUser = {
        provider: 'clerk',
        providerId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? undefined,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || undefined,
        avatar: user.imageUrl ?? undefined,
      }
    }

    try {
      if (id) {
        await updateMutation.mutateAsync(payload)
      } else {
        await createMutation.mutateAsync(payload)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <PrivateLayout>
      <div className="flex-1 min-h-screen bg-slate-50 p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-black">{id ? 'Edit Application' : 'Add Application'}</h1>
          </div>

          {(jobsLoading || appLoading) ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <form key={id || 'new'} ref={formRef} onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600" htmlFor='job'>Job (select existing or leave empty to create new)</label>
                  <select name='job' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={String(defaults.jobId ?? '')} onChange={(e)=>setShowJobFields(e.target.value === '')}>
                    <option value="" className='text-black'>Create new job...</option>
                    {jobs.map((j:any)=> (
                      <option className='text-black' key={j.id} value={j.id}>{j.jobtitle} — {j.companyname}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor='jobstatus' className="block text-sm text-gray-600">Status</label>
                  <select name='status' id='jobstatus' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={String(defaults.status ?? 'APPLIED')}>
                    {statuses.map(s => <option className='text-black' key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor='appliedate' className="block text-sm text-gray-600">Applied Date</label>
                  <input name='applieddate' type="date" className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={String(defaults.appliedDate ?? '')} />
                </div>

                <div>
                  <label htmlFor='resume' className="block text-sm text-gray-600">Resume (link or key)</label>
                  <input name='resume' id='resume' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={String(defaults.resume ?? '')} />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor='coverletter' className="block text-sm text-gray-600">Cover Letter</label>
                  <textarea name='coverletter' id='coverletter' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" rows={4} defaultValue={String(defaults.coverLetter ?? '')} />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor='notes' className="block text-sm text-gray-600">Notes</label>
                  <textarea name='notes' id='notes' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" rows={4} defaultValue={String(defaults.notes ?? '')} />
                </div>
                {/* If no existing job selected, show fields to create new job */}
                {showJobFields && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600">Company Name</label>
                      <input name='companyname' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={String(defaults.companyname ?? '')} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Job Title</label>
                      <input name='jobtitle' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={String(defaults.jobtitle ?? '')} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Job Link</label>
                      <input name='joblink' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={String(defaults.joblink ?? '')} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600">Comments</label>
                      <input name='comments' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={String(defaults.comments ?? '')} />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60">{id ? 'Update' : 'Create'}</button>
                <a href="/app/applications" className="px-4 py-2 border rounded">Cancel</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </PrivateLayout>
  )
}
