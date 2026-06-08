import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos, error } = await supabase.from('todos').select()

  if (error) {
    return <div>Error fetching data: {error.message}</div>
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Supabase Connection Test</h1>
      <ul>
        {todos?.map((todo: any) => (
          <li key={todo.id}>{todo.name}</li>
        )) || <li>No todos found or table does not exist yet.</li>}
      </ul>
      <p style={{ marginTop: '2rem' }}>
        <strong>Note:</strong> We have migrated to Next.js. The original BloomCare HTML is still in <code>public/index.html</code>.
      </p>
    </main>
  )
}
