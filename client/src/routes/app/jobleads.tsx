import { createFileRoute } from '@tanstack/react-router';
import PrivateLayout from "../../combonents/ui/PrivateLayout";

export const Route = createFileRoute('/app/jobleads')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PrivateLayout>Hello "/app/jobleads"!</PrivateLayout>
}
