import { useRouter } from '@/client/router/useRouter'
import { Box, Button, Card, CardActions, CardContent, Grid, Link, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

import { useQuotesQuery } from '@/client/domain/quotes/useQuotesQuery'
import type { Quote, QuoteState } from '@/common/models/quote'
import { useProjectQuery } from '@/client/domain/projects/useProjectQuery'
import { format } from 'date-fns'
import { toChf } from '@/common/utils/toChf'
import { apiClient } from '@/client/api/client'

export function Quotes() {
  const { navigateToAddQuote } = useRouter()
  const { projectId } = useParams()
  const query = useQuotesQuery(projectId || '')
  const projectQuery = useProjectQuery(projectId || '')

  if (!projectId) return <h1>Project ID is missing</h1>
  if (query.isLoading) return <h1>Loading...</h1>
  if (projectQuery.isLoading) return <h1>Loading...</h1>
  if (query.error) return <h1>Error</h1>
  if (projectQuery.error) return <h1>Error</h1>

  const quotes = query.data || []
  const project = projectQuery.data

  function genratePdf(quote: Quote) {
    apiClient.generateQuotePdf({ params: { quoteId: quote.id } })
  }

  return (
    <Box>
      <h1>Quotes</h1>
      <Button onClick={() => navigateToAddQuote({ projectId })}>Add Quote</Button>

      <Grid container spacing={2}>
        {quotes.map((quote) => (
          <Grid key={quote.id} item xs={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h5">
                      {project?.projectNumber}-{quote.quoteNumber}
                    </Typography>
                    <Typography variant="body1">{format(quote.date, 'P')}</Typography>
                  </Box>

                  <Button sx={{ color: stateColor[quote.state] }} variant="text">
                    {stateLabel[quote.state]}
                  </Button>
                </Box>
                <Typography variant="body1">Positionen: {quote.items.length}</Typography>
                <Typography variant="body1">Betrag: {toChf(quote.total.total)}</Typography>
                <Link href={`/files/${quote.filePath}`}>{quote.filePath}</Link>
              </CardContent>
              <CardActions>
                <Button variant="outlined">Bearbeiten</Button>
                <Button variant="outlined">Status ändern</Button>
                <Button variant="outlined" onClick={() => genratePdf(quote)}>
                  PDF generieren
                </Button>
                <Button variant="outlined">Löschen</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

const stateColor: Record<QuoteState, string | undefined> = {
  draft: undefined,
  offerd: 'orange',
  accepted: 'green',
  rejected: 'red',
}

const stateLabel: Record<QuoteState, string> = {
  draft: 'Entwurf',
  offerd: 'Angeboten',
  accepted: 'Akzeptiert',
  rejected: 'Abgelehnt',
}
