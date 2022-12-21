import type {MetaFunction} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import type {LoaderArgs} from '@remix-run/node'
import type {SupabaseClient} from '@supabase/supabase-js'
import {createClient} from '@supabase/supabase-js'
import React from 'react'

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

export async function loader({}: LoaderArgs) {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  }
  return {env}
}

export default function App() {
  const {env} = useLoaderData<typeof loader>()
  const [supabase] = React.useState(() =>
    createClient<Database>(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!),
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
