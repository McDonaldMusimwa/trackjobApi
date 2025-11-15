
import type{ElementType} from "react"

export type ROUTES = {
    link: string
    route: string
}
export type FeatureCard = {
  title: string
  text: string
  key: number
}


export type LOGGEDROUTES=|{
    link : string
    name :string
    icon:ElementType
    id:number
}


// --- Prisma-derived types ---
export type JobStatus =
  | 'APPLIED'
  | 'INTERVIEWING'
  | 'PENDING'
  | 'OFFER'
  | 'REJECTED'
  | 'SAVED'
  

export interface Profile {
  id: number
  bio?: string | null
  userId: number
}

export interface User {
  id: number
  email: string
  name?: string | null
  password?: string | null
  provider?: string | null
  providerId?: string | null
  avatar?: string | null
  emailVerified?: boolean
  createdAt: string
  updatedAt?: string | null

  profile?: Profile | null
  jobs?: Job[]
  applications?: Application[]
  interviews?: Interview[]
  notes?: Note[]
}

export interface Job {
  id: number
  createdAt: string
  updatedAt: string
  companyname: string
  status: JobStatus
  jobtitle: string
  joblink: string
  comments?: string | null
  published?: boolean

  authorId?: number | null
  author?: User | null
  applications?: Application[]
  interviews?: Interview[]
  notes?: Note[]
}

export interface Application {
  id: number
  userId: number
  jobId: number
  title:string
  company: string
  appliedDate: string
  status: JobStatus
  coverLetter?: string | null
  resume?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string

  user?: User
  job?: Job
}

export interface Interview {
  id: number
  userId: number
  jobId?: number | null
  interviewDate: string
  interviewType?: string | null
  interviewer?: string | null
  notes?: string | null
  feedback?: string | null
  status?: string | null
  createdAt: string
  updatedAt: string

  user?: User
  job?: Job | null
}

export interface Note {
  id: number
  userId: number
  jobId?: number | null
  title: string
  content: string
  createdAt: string
  updatedAt: string
  category: 'job-search' | 'interview-prep' | 'networking' | 'skills' | 'reflection' | 'other'
  user?: User
  job?: Job | null
}

