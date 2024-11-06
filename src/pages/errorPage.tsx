import { useRouteError } from 'react-router-dom'

interface RouteError {
  status?: number
  statusText?: string
  message?: string
}

export default function ErrorPage() {
  const error = useRouteError()

  //type guard function
  const isRouteError = (error: unknown): error is RouteError => {
    return typeof error === 'object' && error !== null && 'statusText' in error
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {isRouteError(error)
            ? error.statusText || error.message
            : 'Unknown error'}
        </i>
      </p>
    </div>
  )
}
