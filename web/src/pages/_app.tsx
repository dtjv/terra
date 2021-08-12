import { useRef } from 'react'
import { Hydrate } from 'react-query/hydration'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { AppProps } from 'next/app'
import { Chakra } from '@/chakra'

const App = ({ Component, pageProps }: AppProps) => {
  const queryClientRef = useRef<QueryClient | null>(null)

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
export { getServerSideProps } from '@/chakra'
