import { createFileRoute } from '@tanstack/react-router'
import PrivateLayout from '../../combonents/ui/PrivateLayout'
export const Route = createFileRoute('/app/notes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PrivateLayout>Hello "/app/notes"!</PrivateLayout>
}
