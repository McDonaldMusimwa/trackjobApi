import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/addapplication')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/addapplication"!</div>
}
