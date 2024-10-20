'use client'

import { Provider } from 'react-redux'
import { persistor, store } from '@/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from '@/components/ui/toaster'

export default function ClientProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster />
      </PersistGate>
    </Provider>
  )
}
