interface DisplayErrorProps {
  error: Error | undefined
  consoleError: (...data: unknown[]) => void
}

export function DisplayError({ error, consoleError }: DisplayErrorProps) {
  if (!error) return null

  consoleError('Error was displayed to a customer', error)
  return (
    <>
      <p>
        {error.name}: {error.message}
      </p>
      {error.stack && <p>{error.stack}</p>}
    </>
  )
}
