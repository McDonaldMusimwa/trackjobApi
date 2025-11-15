import type { FeatureCard } from "../types/types"
import type { ROUTES } from "../types/types"
import type { LOGGEDROUTES } from "../types/types"
import {Calendar1,CircleGaugeIcon,FilePlus,FileTextIcon,NotebookPen,Settings} from 'lucide-react'
export const features: Array<FeatureCard> = [
  {
    title: 'Job Application Tracker',
    text: ` Keep a clear record of every job you’ve applied for. TrekJob aggregates all your applications
            in one dashboard, showing totals and detailed stats at a glance.`,
    key: 1,
  },
  {
    title: `Status Tracking`,
    text: `Track each job’s status — from “Applied” to “Interview” to “Offer.” Stay on top of your progress
            and never lose track of where you stand.
          `,
    key: 2,
  },
{
   title:`CV Upload & Storage`,
   text:`Securely upload and manage multiple versions of your CV.
            Access them anytime when applying for different roles.`,
            key:3
},
{
    title: "AI-Powered CV Recommendations",
    text: "Get personalized AI feedback on your CV’s structure, tone, and keywords. Instantly learn how to improve your chances of standing out.",
    key: 4,
  },
  {
    title: "AI Interview Preparation",
    text: "Chat with TrekJob’s AI Interview Coach to generate realistic interview questions, practice answers, and refine your personal pitch or “30-second bio.”",
    key: 5,
  },
  {
    title: "AI Cover Letter Assistant",
    text: "Create tailored cover letters that highlight your skills and align perfectly with each job posting. Save time and improve quality instantly.",
    key: 6,
  },
  {
    title: "Insightful Analytics",
    text: "Visualize your job search progress with charts that show total applications, success rates, and areas for improvement over time.",
    key: 7,
  },
  {
    title: "Personal Career Dashboard",
    text: "Manage everything in one place — job entries, statuses, notes, documents, and AI insights — for a smoother, smarter job-hunting experience.",
    key: 8,
  },
  {
    title: "Embedded Job Boards",
    text: "Easily access Job boards to help you carve your Resume.",
    key: 9,
  },

  
]


export const routes: ROUTES[] = [
        { link: "/", route: "Home" },
        { link: "/features", route: "Features" },
        { link: "/how-it-works", route: "How it works" },
        //{ link: "/pricing", route: "Pricing" }
    ]

export const navlinks:Array<LOGGEDROUTES> =[

    {
        link:"/app",
        name:"Dashboard",
        icon:CircleGaugeIcon,
        id:1
    },
    {
        link:"/app/applications",
        name:"Applications",
        icon:FileTextIcon,
        id:2
    },
      {
        link:"/app/notes",
        name:"Notes",
        icon:NotebookPen,
        id:3
    },
      {
        link:"/app/interviews",
        name:"Interviews",
        icon:Calendar1,
        id:4
    },
   
    {
        link:"app/addapplication",
        name:"Add App",
        icon:FilePlus,
        id:6
    }
    ,{
        link:"app/jobleads",
        name:"Job Leads",
        icon:FilePlus,
        id:6
    },
     {
        link:"/app/settings",
        name:"Settings",
        icon:Settings,
        id:5
    },
]