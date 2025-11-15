import { createFileRoute } from '@tanstack/react-router'
import styles from "../styles/features.module.css"
import PuclicLayout from '../combonents/ui/PublicLayout'
import {features} from '../staticdata/features'
export const Route = createFileRoute('/features')({
  component: RouteComponent,
})

function RouteComponent() {
  return(<PuclicLayout> 
     <div className={styles.featurescontainer}>
      <header className={styles.featuresheader}>
        <h1>TrekJob Features</h1>
        <p>
          Everything you need to manage your job search, track your progress, and prepare with confidence.
        </p>
      </header>

      <div className={styles.featuresgrid}>

    {features.map((feature)=>{
        return(
            <div key={feature.key} className={styles.featurecard}>
<h2>{feature.title}</h2>
<p>{feature.text}</p>
                </div>
        )
    })}
   
      </div>

      <div className={styles.featurescta}>
        <h3>Turn your job search into a journey you can track and improve.</h3>
        <button className="cta-button">Start Using TrekJob</button>
      </div>
    </div>
    </PuclicLayout>)
}
