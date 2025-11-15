import { createFileRoute } from '@tanstack/react-router'
import PrivateLayout from '../../combonents/ui/PrivateLayout'
export const Route = createFileRoute('/app/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PrivateLayout>Hello "/app/settings"!</PrivateLayout>
}
