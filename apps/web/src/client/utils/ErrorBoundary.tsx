import { Alert, AlertTitle, Button } from '@mui/material'
import { Component, type ErrorInfo } from 'react'
import { t } from '@/client/i18n/t'
import type { ErrorWithDetails } from '@/client/utils/errors'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

type ErrorBoundaryProps = {
  name?: string
  children?: React.ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null, errorInfo: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })
    if (error?.name === 'ChunkLoadError') {
      window.location.reload()
    }
  }

  render() {
    return this.state.hasError ? (
      <ErrorDisplay
        title={t().errors.unexpectedError}
        error={this.state.error}
        errorInfo={this.state.errorInfo}
      />
    ) : (
      <>{this.props.children}</>
    )
  }
}

interface ErrorDisplayProps {
  title: string
  error: Error | null
  errorInfo: ErrorInfo | null
}

function ErrorDisplay(props: ErrorDisplayProps) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={() => window.location.reload()}>
          {t().errors.reloadPage}
        </Button>
      }
    >
      <AlertTitle>{props.title}</AlertTitle>

      <pre>{errorMessage(props.error)}</pre>
      {props.error?.stack && <pre>{props.error.stack}</pre>}
      {props.errorInfo?.componentStack && (
        <pre>
          {t().errors.componentStack}
          {props.errorInfo?.componentStack}
        </pre>
      )}
    </Alert>
  )
}

function errorMessage(error: Error | ErrorWithDetails | null) {
  const details = error && 'details' in error ? error?.details : undefined
  return error
    ? `${t().errors.errorName}: ${error.name}\n${JSON.stringify(details, null, 2)}\n${
        t().errors.errorMessage
      }: ${error.message}`
    : t().errors.unknownError
}
