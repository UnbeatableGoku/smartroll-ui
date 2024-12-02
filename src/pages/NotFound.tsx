import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { PAGE_DASHBOARD } from '@constants'

import { Button } from '@components/common/form'

export default function NotFound() {
  const navigate = useNavigate()

  const backToHome = () => {
    navigate(PAGE_DASHBOARD.path)
  }

  return (
    <>
      <Helmet>
        <title>Smart Roll | Not Found</title>
      </Helmet>

      <main className="mx-auto max-w-7xl bg-black px-3">
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <h1 className="text-8xl font-bold text-error">404</h1>
          <h2 className="mb-2 mt-2 text-3xl font-semibold text-white">
            Page Not Found
          </h2>
          <p className="mb-4 text-sm leading-7 text-zinc-400">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <Button
            label="Back to home"
            variant="outline"
            size="small"
            className="w-32"
            type="button"
            onClick={backToHome}
          />
        </div>
      </main>
    </>
  )
}
