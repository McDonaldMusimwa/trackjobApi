import { createFileRoute } from '@tanstack/react-router'
import styles from "../styles/how-it-works.module.css"
import PublicLayout from '../combonents/ui/PublicLayout'
export const Route = createFileRoute('/how-it-works')({
  component: RouteComponent,
})

function RouteComponent() {
   return <PublicLayout>
 <div className={styles.howitworkscontainer}>
      <header className={styles.howitworksheader}>
        <h1>How TrekJob Works</h1>
        <p>Your complete assistant for applying, tracking, and growing your career.</p>
      </header>

      <section className={styles.howitworkssection}>
        <h2>1. Create Your Account</h2>
        <p>
          Start by signing up for your <strong>TrekJob</strong> account. Once you’re in,
          you’ll have a personal dashboard where you can manage your job search — all in one place.
        </p>
      </section>

      <section className={styles.howitworkssection}>
        <h2>2. Discover & Apply for Jobs</h2>
        <p>
          Browse through job listings or add jobs you’ve found elsewhere. Click{" "}
          <strong>“Add to Tracker”</strong> to save details like job title, company name, and application date.
        </p>
      </section>

      <section className={styles.howitworkssection}>
        <h2>3. Track Your Progress</h2>
        <p>
          Keep everything organized in your <strong>Job Tracker Dashboard</strong>. See total jobs applied,
          track statuses, and visualize your progress over time.
        </p>
      </section>

      <section className={styles.howitworkssection}>
        <h2>4. Upload & Store Your CV</h2>
        <p>
          Upload your CVs and manage multiple versions easily. TrekJob stores them securely,
          so you can access and attach the right version anytime.
        </p>
      </section>

      <section className={styles.howitworkssection}>
        <h2>5. Get AI-Powered CV Recommendations</h2>
        <p>
          TrekJob’s AI Assistant reviews your CV and provides instant feedback on keywords,
          formatting, and impact — helping you stand out from the crowd.
        </p>
      </section>

      <section className={styles.howitworkssection}>
        <h2>6. Prepare with AI for Interviews</h2>
        <p>
          Practice with the <strong>AI Interview Coach</strong> that generates personalized
          interview questions, helps refine your bio, and offers phrasing tips for confidence.
        </p>
      </section>

      <section className={styles.howitworkssection}>
        <h2>7. Write Better Cover Letters</h2>
        <p>
          Generate tailored, job-specific cover letters in seconds. TrekJob’s AI crafts
          personalized drafts that highlight your strengths and fit the role.
        </p>
      </section>

      <section className={styles.howitworkssection}>
        <h2>8. Stay Motivated & In Control</h2>
        <p>
          Track every metric, insight, and suggestion to stay consistent and confident
          throughout your job hunt. TrekJob is your personal career companion.
        </p>
      </section>

      <div className={styles.howitworkscta}>
        <h3>Ready to take control of your job search?</h3>
        <button className="cta-button">Get Started with TrekJob</button>
      </div>
    </div>


  </PublicLayout>
}
