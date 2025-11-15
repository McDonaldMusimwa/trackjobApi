import { createFileRoute } from '@tanstack/react-router'
import PublicLayout from '../combonents/ui/PublicLayout'
import {
  Sparkles,
  Layers,
  FileText,
  MessageSquare,
  BarChart,
  Heart,
 
} from 'lucide-react'
import Feature from '../combonents/ui/Feature'
import studentimg from "../../public/student-min.jpg"
export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <PublicLayout>
        <div className="flex-1 min-h-screen bg-white from-slate-900 via-slate-800 to-slate-900">
        <div>
          <div>



            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between container mx-auto px-8 py-20 gap-10">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                  Stay Organized <br /> Track Your Job Hunt With Ease
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-lg">
                  Manage applications, interviews, notes, and offers — all in one beautiful dashboard.
                  Let your job search be structured, efficient, and stress-free.
                </p>
            
                <div className="flex items-center gap-4">
                  <a
                    href="/signup"
                    className="inline-flex items-center gap-2 bg-[#4f772d] hover:bg-[#3e5d22] text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
                  >
                    Get started
                    <Sparkles size={16} />
                  </a>
                  <a href="/about" className="text-sm text-gray-600 underline">
                    Learn more
                  </a>
                </div>
              </div>


              <div className="flex-1 flex justify-center">
                <div className="bg-gray-100 rounded-2xl p-6 shadow-xl border border-gray-200 w-full max-w-md">
                 
                 <img src={studentimg} alt="Student using TrekJob app" className="mt-4 rounded-lg shadow-md" />
                </div>
              </div>
            </section>


            {/* Features */}

 <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-extrabold text-center mb-10">What TrekJob gives you</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Feature
              Icon={Layers}
              title="Organized applications"
              desc="Centralize all job applications and track progress from applied to offer."
            />
            <Feature
              Icon={FileText}
              title="Resume management"
              desc="Store multiple CV versions and quickly attach the right one when applying."
            />
            <Feature
              Icon={BarChart}
              title="Insightful analytics"
              desc="Visualize success rates and focus your efforts where they matter most."
            />
            <Feature
              Icon={MessageSquare}
              title="Notes & collaboration"
              desc="Keep interview notes, follow-ups, and recruiter contacts in one place."
            />
            <Feature
              Icon={Sparkles}
              title="AI resume advice"
              desc="Get data-driven suggestions to improve structure, keywords, and clarity."
            />
            <Feature
              Icon={Heart}
              title="AI cover letter assistant"
              desc="Generate personalized, captivating cover letters tailored to each job."
            />
          </div>
        </section>


          {/* Call to Action */}
          <section className="bg-[#4f772d] text-white py-20 text-center rounded-lg">
            <h3 className="text-3xl font-bold mb-6">Ready to level up your job search?</h3>
            <p className="text-gray-300 mb-10 text-lg max-w-xl mx-auto">
              Start organizing like a pro and land your next role faster.
            </p>
            <button className="rounded-xl px-8 py-6 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-200">
              Start Free
            </button>
          </section>


          {/* Footer */}
       
        </div>
      </div>
    </div >

    </PublicLayout>
}
