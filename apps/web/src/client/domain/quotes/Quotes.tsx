import { useRouter } from '@/client/router/useRouter'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useParams } from 'react-router-dom'

import { useQuotesQuery } from '@/client/domain/quotes/useQuotesQuery'
import {
  quoteDraftStates,
  quoteStates,
  zodQuoteState,
  type Quote,
  type QuoteState,
} from '@/common/models/quote'
import { useProjectQuery } from '@/client/domain/projects/useProjectQuery'
import { format } from 'date-fns'
import { toChf } from '@/common/utils/toChf'
import { apiClient } from '@/client/api/client'
import { Add, ContentCopy, Delete, Edit, FilePresent, PictureAsPdf } from '@mui/icons-material'
import { QueryClient, useQueryClient } from 'react-query'
import { IsoDateString, zodParse } from '@easy-kmu/common'
import { sortBy } from 'lodash'
import { lighten } from '@mui/material/styles'
import { useState } from 'react'
import { confirm } from '@/client/dialog/confirm'

export function Quotes() {
  const { navigateToAddQuote, navigateToEditQuote } = useRouter()
  const { projectId } = useParams()
  const query = useQuotesQuery(projectId || '')
  const queryClient = useQueryClient()
  const projectQuery = useProjectQuery(projectId || '')

  const [generatingPdf, setGeneratingPdf] = useState<Quote | undefined>(undefined)

  const theme = useTheme()

  if (!projectId) return <h1>Project ID is missing</h1>
  if (query.isLoading) return <h1>Loading...</h1>
  if (projectQuery.isLoading) return <h1>Loading...</h1>
  if (query.error) return <h1>Error</h1>
  if (projectQuery.error) return <h1>Error</h1>

  const quotes = sortBy(query.data || [], 'quoteNumber')
  const project = projectQuery.data

  async function genratePdf(quote: Quote) {
    setGeneratingPdf(quote)
    await apiClient.generateQuotePdf({ params: { quoteId: quote.id } })
    setGeneratingPdf(undefined)
  }

  async function deleteQuote(quote: Quote) {
    await apiClient.deleteQuote({ params: { quoteId: quote.id } })
    queryClient.invalidateQueries('quotes')
  }

  async function duplicateQuote(quote: Quote) {
    await apiClient.createOrUpdateQuote({
      body: {
        ...quote,
        quoteNumber: 0,
        filePath: undefined,
        state: 'draft',
        date: IsoDateString(new Date()),
        id: undefined,
      },
    })
    queryClient.invalidateQueries('quotes')
  }

  async function editQuote(quote: Quote) {
    navigateToEditQuote({ quoteId: quote.id })
  }

  function cardColorByState(state: QuoteState) {
    if (state === 'offerd') return theme.palette.warning.light
    if (state === 'accepted') return theme.palette.success.light
    if (state === 'rejected') return theme.palette.error.light
    return theme.palette.grey[200]
  }

  return (
    <Box>
      {/* <Typography variant="h4">Angebote</Typography> */}

      <Box sx={{ display: 'flex', justifyContent: 'end', my: 2 }}>
        <IconButton onClick={() => navigateToAddQuote({ projectId })}>
          <Add />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {quotes.map((quote) => (
          <Grid key={quote.id} item xs={4}>
            <Card sx={{ backgroundColor: lighten(cardColorByState(quote.state), 0.9) }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h5">
                      {project?.projectNumber}-{quote.quoteNumber}
                    </Typography>
                    <Typography variant="body1">{format(quote.date, 'P')}</Typography>
                    <Typography variant="body1">Positionen: {quote.items.length}</Typography>
                    <Typography variant="body1">Betrag: {toChf(quote.total.total)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControl fullWidth>
                      <Select
                        value={quote.state}
                        onChange={(ev) => changeQuoteState(ev.target.value, quote, queryClient)}
                      >
                        {quoteStates.map((state) => (
                          <MenuItem key={state} value={state} disabled={isDisabled(quote.state, state)}>
                            {stateLabel[state]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {generatingPdf === quote ? (
                      <Box sx={{ my: 1 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <IconButton
                        size="large"
                        href={`/files/${quote.filePath}`}
                        sx={{ visibility: quote.filePath ? 'visible' : 'hidden' }}
                      >
                        <FilePresent style={{ fontSize: 60 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Tooltip title="Angebot bearbeiten">
                  <IconButton onClick={() => editQuote(quote)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="PDF generieren">
                  <IconButton disabled={!canGeneratePdf(quote)} onClick={() => genratePdf(quote)}>
                    <PictureAsPdf />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Angebot duplizieren">
                  <IconButton onClick={() => duplicateQuote(quote)}>
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Angebot löschen">
                  <IconButton disabled={!canDelete(quote)} onClick={() => deleteQuote(quote)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

async function changeQuoteState(value: string, quote: Quote, queryClient: QueryClient) {
  const state = zodParse(zodQuoteState, value)
  const confirmRequired = quoteDraftStates.includes(quote.state) && !quoteDraftStates.includes(state)
  if (!confirmRequired || (await confirm({ description: 'This action is permanent!' })) === 'ok') {
    await apiClient.updateQuoteState({
      params: { quoteId: quote.id },
      body: { state },
    })
    queryClient.invalidateQueries('quotes')
  }
}

function isDisabled(currentState: QuoteState, state: QuoteState): boolean {
  if (currentState === 'draft') return false
  if (currentState === 'readyToOffer') return false
  if (currentState === 'offerd' || currentState === 'rejected' || currentState === 'accepted') {
    if (state === 'draft' || state === 'readyToOffer') return true
    return false
  }
  if (currentState === 'rejected') return false
  if (currentState === 'accepted') return false
  return false
}

function canDelete(quote: Quote) {
  return quote.state === 'draft' || quote.state === 'readyToOffer'
}

function canGeneratePdf(quote: Quote) {
  return quote.state === 'draft'
}

const stateLabel: Record<QuoteState, string> = {
  draft: 'Entwurf',
  readyToOffer: 'Bereit zum Angebot',
  offerd: 'Angeboten',
  accepted: 'Akzeptiert',
  rejected: 'Abgelehnt',
}
