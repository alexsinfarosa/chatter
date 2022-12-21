import {useLoaderData} from '@remix-run/react'
import supabase from 'utils/supabase.server'
import type {LoaderArgs} from '@remix-run/node'
import Login from '~/components/login.tsx/login'

// eslint-disable-next-line no-empty-pattern
export async function loader({}: LoaderArgs) {
  const {data} = await supabase.from('messages').select()
  return {messages: data ?? []}
}

export default function Index() {
  const {messages} = useLoaderData<typeof loader>()

  return (
    <>
      <Login></Login>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </>
  )
}
