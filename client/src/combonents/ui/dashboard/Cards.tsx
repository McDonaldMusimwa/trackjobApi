type JobsByStatus = Record<string, number>

export default function DashboardCard({
  applicationsCount,
  interviewsCount,
  jobsByStatus,
  offersCount,
  savedCount,
  offerRate,
  interviewsPerApplication,
  rejectedCount,
}: {
  applicationsCount: number,
  interviewsCount: number,
  jobsByStatus: JobsByStatus,
  offersCount?: number,
  savedCount?: number,
  offerRate?: number,
  interviewsPerApplication?: number,
  rejectedCount?: number,
}){
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm text-gray-500">Jobs Applied</h4>
          <p className="text-3xl font-bold">{applicationsCount}</p>
          <div className="text-xs text-gray-500 mt-2">Offer rate: {typeof offerRate === 'number' ? `${offerRate}%` : '—'}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm text-gray-500">Interviews</h4>
          <p className="text-3xl font-bold">{interviewsCount}</p>
          <div className="text-xs text-gray-500 mt-2">Per application: {typeof interviewsPerApplication === 'number' ? interviewsPerApplication : '—'}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm text-gray-500">Offers</h4>
          <p className="text-3xl font-bold">{offersCount ?? (jobsByStatus['OFFER'] ?? 0)}</p>
          <div className="text-xs text-gray-500 mt-2">Rejected: {typeof rejectedCount === 'number' ? rejectedCount : (jobsByStatus['REJECTED'] ?? 0)}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-sm text-gray-500">Saved</h4>
          <p className="text-3xl font-bold">{savedCount ?? (jobsByStatus['SAVED'] ?? 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
        {['APPLIED','INTERVIEWING','PENDING','OFFER','REJECTED','SAVED'].map((k)=> (
          <div key={k} className="bg-white p-3 rounded-md shadow-sm text-center">
            <div className="text-xs text-gray-500">{k}</div>
            <div className="text-xl font-semibold">{jobsByStatus[k] ?? 0}</div>
          </div>
        ))}
      </div>
    </>
  )
}
