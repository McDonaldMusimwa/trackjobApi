import { createFileRoute } from '@tanstack/react-router'
import PrivateLayout from '../../combonents/ui/PrivateLayout'
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-react'
import type { Application as AppType, JobStatus } from '../../types/types'

export const Route = createFileRoute('/app/addapplication')({
  component: RouteComponent,
})

function RouteComponent() {
  // read optional ?id= from query string to support edit
const id = new URLSearchParams(window.location.search).get('id')
  const [saving, setSaving] = useState(false)
  const [defaults, setDefaults] = useState<Partial<AppType>>({})
 async function fetchJob(id:string){
    const res = await fetch(`http://localhost:3000/applications/${id}`)
    if (!res.ok) throw new Error('Network error')
    const json = await res.json()
    return json.data
 }
  useEffect(()=>{
    if(!id) return
    fetchJob(id).then(data=>{
      setDefaults(data)
    }).catch(err=>{
      console.error('Error fetching application data', err)
    })
  },[id])

  const queryClient = useQueryClient()
  const { user } = useUser()

  const statuses: JobStatus[] = useMemo(() => ['APPLIED','INTERVIEWING','PENDING','OFFER','REJECTED','SAVED'], [])

  const handleSubmit = async (formData: FormData) => {
    if (!user?.id) {
      alert('You must be logged in to create an application')
      return
    }

    setSaving(true)
    try {
      // Ensure user exists in database first
      await fetch('http://localhost:3000/users/ensure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress,
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || null,
          avatar: user.imageUrl ?? null,
        }),
      })

      const payload: any = {
        userId: user.id, // Pass Clerk user ID
        job: {
          jobtitle: formData.get('jobtitle') as string,
          companyname: formData.get('companyname') as string,
          joblink: formData.get('joblink') as string,
          comments: formData.get('comments') as string,
          published: true,
          status: formData.get('status') as JobStatus,
          
        },
        status: formData.get('status') as JobStatus,
        appliedDate: formData.get('applieddate') as string,
        clerkUser: {
          email: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress,
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || null,
          avatar: user.imageUrl ?? null,
        }
      }

      const url = id 
        ? `http://localhost:3000/applications/${id}`
        : 'http://localhost:3000/applications'
      
      const method = id ? 'PUT' : 'POST'

      console.log('Submitting payload:', JSON.stringify(payload, null, 2))
      console.log("Payload job:", payload)
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Server error:', errorData)
        throw new Error(errorData.error || `${id ? 'Update' : 'Create'} failed`)
      }

      const result = await res.json()
      console.log('Success:', result)
      
      queryClient.invalidateQueries({ queryKey: ['applications'] as const })
      window.location.href = '/app/applications'
    } catch (err) {
      console.error('Submit error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      alert(`Failed to ${id ? 'update' : 'create'} application: ${errorMessage}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PrivateLayout>
      <div className="flex-1 min-h-screen bg-slate-50 p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-black">{id ? 'Edit Application' : 'Add Application'}</h1>
          </div>

    
            <form key={id || 'new'} action={handleSubmit} className="bg-white p-6 rounded shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm text-gray-600">Job Title</label>
                      <input name='jobtitle' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={(defaults as any).job?.jobtitle ?? ''} />
                    </div>

                <div>
                  <label htmlFor='jobstatus' className="block text-sm text-gray-600">Status</label>
                  <select name='status' id='jobstatus' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={defaults.status ?? 'APPLIED'}>
                    {statuses.map(s => <option className='text-black' key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor='appliedate' className="block text-sm text-gray-600">Applied Date</label>
                  <input name='applieddate' type="date" className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={defaults.appliedDate ? new Date(defaults.appliedDate).toISOString().slice(0, 10) : ''} />
                </div>
                <div>
                      <label className="block text-sm text-gray-600">Job Link</label>
                      <input name='joblink' type='url' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={(defaults as any).job?.joblink ?? ''} />
                    </div>
                {/* If no existing job selected, show fields to create new job */}
              
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600">Company Name</label>
                      <input name='companyname' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={(defaults as any).job?.companyname ?? ''} />
                    </div>
                
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600">Comments</label>
                      <textarea name='comments' className="mt-1 block w-full border-0 border-b-2 border-gray-300 rounded-none p-2 focus:border-blue-500 text-black bg-white" defaultValue={(defaults as any).job?.comments ?? ''} rows={5} cols={40} placeholder="Enter your comment here..." />
                    </div>
                  </>
                
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60">{id ? 'Update' : 'Create'}</button>
                <a href="/app/applications" className="px-4 py-2 border rounded">Cancel</a>
              </div>
            </form>
          
        </div>
      </div>
    </PrivateLayout>
  )
}
