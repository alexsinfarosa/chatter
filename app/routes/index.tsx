import type {LoaderArgs} from '@remix-run/node'
import {json} from '@remix-run/node'
import {Form, useLoaderData} from '@remix-run/react'
import createServerSupabase from 'utils/supabase.server'
import Login from '~/components/login'
import type {ActionArgs} from '@remix-run/node'
import RealtimeMessages from '~/components/realtime.messages'

export async function action({request}: ActionArgs) {
  const response = new Response()
  const supabase = createServerSupabase({request, response})

  const {message} = Object.fromEntries(await request.formData())
  const {error} = await supabase
    .from('messages')
    .insert({content: String(message)})

  if (error) {
    return json(
      {error: error.message},
      {status: 500, headers: response.headers},
    )
  }
  return json(null, {headers: response.headers})
}

export async function loader({request}: LoaderArgs) {
  const response = new Response()
  const supabase = createServerSupabase({request, response})
  const {data} = await supabase.from('messages').select()
  return json({messages: data ?? []}, {headers: response.headers})
}

export default function Index() {
  const {messages} = useLoaderData<typeof loader>()

  return (
    <>
      <Login></Login>
      <RealtimeMessages serverMessages={messages} />
      <Form method="post">
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </Form>
    </>
  )
}
