import { createFileRoute } from '@tanstack/react-router';
import { SignIn } from '@clerk/clerk-react';
import PublicLayout from '../combonents/ui/PublicLayout';
export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PublicLayout>
    <div className='item-center justify-center flex mt-20 mb-20'>

<SignIn />
    </div>
    </PublicLayout>
}
