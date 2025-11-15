import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/clerk-react'
import PublicLayout from '../combonents/ui/PublicLayout'

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PublicLayout>
    <div className='item-center justify-center flex mt-20 mb-20'>

<SignUp />
    </div>
    </PublicLayout>
}
