import { redirect } from 'next/navigation'

// Root / → /ar by default (RTL primary per constitution)
export default function RootPage() {
  redirect('/ar')
}
