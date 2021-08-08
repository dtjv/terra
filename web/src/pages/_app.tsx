import * as React from 'react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { Chakra } from '@/Chakra'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const queryClientRef = React.useRef<QueryClient | null>(null)

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient()
  }

  return (
    <Chakra>
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </Chakra>
  )
}

export default App
export { getServerSideProps } from '@/Chakra'
