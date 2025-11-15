import { createFileRoute } from '@tanstack/react-router'
import PrivateLayout from '../../combonents/ui/PrivateLayout'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Cards from '../../combonents/ui/dashboard/Cards'
import { LineChartSVG, BarChartSVG } from '../../combonents/ui/dashboard/Charts'
export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

type JobStatus = 'APPLIED' | 'INTERVIEWING' | 'PENDING' | 'OFFER' | 'REJECTED' | 'SAVED'

// Using shared chart components from combonents/ui/dashboard/Charts

function RouteComponent(){
  const fetcher = async (url: string): Promise<any[]> => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Network error')
    const json = await res.json()
    return json.data ?? []
  }

  const { data: applications = [], isLoading: appsLoading, error: appsError } = useQuery<any[], Error>({ queryKey: ['applications'], queryFn: () => fetcher('http://localhost:3000/applications') })
  const { data: interviews = [], isLoading: intLoading, error: intError } = useQuery<any[], Error>({ queryKey: ['interviews'], queryFn: () => fetcher('http://localhost:3000/interviews') })
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useQuery<any[], Error>({ queryKey: ['jobs'], queryFn: () => fetcher('http://localhost:3000/jobs') })

  const loading = appsLoading || intLoading || jobsLoading
  const error = appsError || intError || jobsError

  const jobsByStatus = useMemo(()=>{
    const map: Record<string, number> = { APPLIED:0, INTERVIEWING:0, PENDING:0, OFFER:0, REJECTED:0, SAVED:0 }
    for(const j of jobs as any[]){
      const s = (j.status ?? 'PENDING') as JobStatus
      map[s] = (map[s] || 0) + 1
    }
    return map
  }, [jobs])

  const appSeries = useMemo(()=>{
    const applicationsArr = applications as any[]
    const days = 14
    const arr = Array.from({length: days}).map((_,i)=>{
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i))
      const key = date.toISOString().slice(0,10)
      return { key, count: 0 }
    })
    const mapIndex = Object.fromEntries(arr.map((a,i)=>[a.key,i]))
    for(const a of applicationsArr){
      const d = (a.appliedDate || a.createdAt || a.appliedAt) ? new Date(a.appliedDate || a.createdAt || a.appliedAt) : null
      if(!d) continue
      const key = d.toISOString().slice(0,10)
      if(key in mapIndex) arr[mapIndex[key]].count++
    }
    return arr.map(a=>({ x: a.key.slice(5), y: a.count }))
  }, [applications])

  const barData = useMemo(()=>{
    return Object.entries(jobsByStatus).map(([k,v])=>({ label:k, value:v }))
  }, [jobsByStatus])

  return (
    <PrivateLayout>
      <div className="flex-1 min-h-screen bg-slate-50 p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-500 animate-pulse">Loading metrics...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">Error loading metrics</div>
          ) : (
            <>
              {
                (() => {
                  const applicationsCount = (applications as any[]).length
                  const interviewsCount = (interviews as any[]).length
                  const offersCount = jobsByStatus['OFFER'] ?? 0
                  const savedCount = jobsByStatus['SAVED'] ?? 0
                  const rejectedCount = jobsByStatus['REJECTED'] ?? 0
                  const offerRate = applicationsCount > 0 ? Math.round((offersCount / applicationsCount) * 100) : 0
                  const interviewsPerApplication = applicationsCount > 0 ? Number((interviewsCount / applicationsCount).toFixed(2)) : 0
                  return (
                    <Cards
                      applicationsCount={applicationsCount}
                      interviewsCount={interviewsCount}
                      jobsByStatus={jobsByStatus}
                      offersCount={offersCount}
                      savedCount={savedCount}
                      rejectedCount={rejectedCount}
                      offerRate={offerRate}
                      interviewsPerApplication={interviewsPerApplication}
                    />
                  )
                })()
              }
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChartSVG series={appSeries} color="#4f772d" />
                <div>
                  <BarChartSVG data={barData} color="#4f772d" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PrivateLayout>
  )
}
