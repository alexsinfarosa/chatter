import {json} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import {createBrowserClient} from '@supabase/auth-helpers-remix'
import React from 'react'
import createServerSupabase from 'utils/supabase.server'

import type {SupabaseClient} from '@supabase/supabase-js'
import type {LoaderArgs, MetaFunction} from '@remix-run/node'
import type {Database} from 'db_types'

type TypedSupabaseClient = SupabaseClient<Database>
export type SupabaseOutletContext = {
  supabase: TypedSupabaseClient
}
export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export async function loader({request}: LoaderArgs) {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  }

  const response = new Response()
  const supabase = createServerSupabase({request, response})

  const {
    data: {session},
  } = await supabase.auth.getSession()

  return json({env, session}, {headers: response.headers})
}

export default function App() {
  const {env, session} = useLoaderData<typeof loader>()

  const [supabase] = React.useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!),
  )

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={{supabase}} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
