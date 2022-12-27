import {useOutletContext} from '@remix-run/react'
import type {Database} from 'db_types'
import React from 'react'
import type {SupabaseOutletContext} from '~/root'

type Message = Database['public']['Tables']['messages']['Row']

export default function RealtimeMessages({
  serverMessages,
}: {
  serverMessages: Message[]
}) {
  const [messages, setMessages] = React.useState(serverMessages)
  const {supabase} = useOutletContext<SupabaseOutletContext>()

  React.useEffect(() => {
    setMessages(serverMessages)
  }, [serverMessages])


  React.useEffect(() => {
    const channel = supabase
      .channel('*')
      .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'message'},
        payload => {
          const newMessage = payload.new as Message
          if(!messages.find(m => m.id === newMessage.id){
            setMessages(messages => [...messages, newMessage])
          }
        },
      )
    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, messages, setMessages])

  return <pre>{JSON.stringify(messages, null, 2)}</pre>
}
