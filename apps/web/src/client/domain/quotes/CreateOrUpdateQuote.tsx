import {
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  ListItemText,
  Menu,
  Link,
  Tooltip,
} from '@mui/material'
import { useEffect, useState } from 'react'

import { KeyboardArrowUp, KeyboardArrowDown, DeleteOutline, Add, Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { produce } from 'immer'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IsoDateString, move } from '@easy-kmu/common'
import { apiClient } from '@/client/api/client'
import type { CreateOrUpdateQuote } from '@/common/models/quote'
import { useParams } from 'react-router-dom'

interface QuoteState {
  quote: CreateOrUpdateQuote
  display: {
    discount: {
      amount: number
      percent: number
    }
  }
  // setInvoiceNumber: (project: string) => void
  addDescriptionItem: () => void
  updateDescriptionItem: (index: number, item: { key: string; value: string }) => void
  removeDescriptionItem: (index: number) => void
  moveDescriptionItem: (fromIndex: number, toIndex: number) => void
  setTo: (value: string) => void
  addItem: () => void
  updateItem: (item: { pos: string; text: string; price: number }, index: number) => void
  removeItem: (index: number) => void
  moveItem: (fromIndex: number, toIndex: number) => void
  addTextblock: (value: string) => void
  removeTextblock: (index: number) => void
  updateTextblock: (value: string, index: number) => void
  moveTextblock: (fromIndex: number, toIndex: number) => void
  setDiscount: (type: 'amount' | 'percent', value: string) => void
  clearInvoice: () => void
}

const useInvoiceStore = create(
  persist<QuoteState>(
    (set) => ({
      quote: emptyQuote(),
      display: {
        discount: {
          amount: 0,
          percent: 0,
        },
      },

      setTo: (value: string) =>
        set(
          produce((state: QuoteState) => {
            state.quote.to = value
          }),
        ),

      addDescriptionItem: () =>
        set(
          produce((state: QuoteState) => {
            state.quote.description.push({ key: 'Neu', value: '' })
          }),
        ),
      updateDescriptionItem: (index: number, item: { key: string; value: string }) =>
        set(
          produce((state: QuoteState) => {
            state.quote.description[index] = item
          }),
        ),

      removeDescriptionItem: (index: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.description = state.quote.description.filter((_, i) => i !== index)
          }),
        ),
      moveDescriptionItem: (fromIndex: number, toIndex: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.description = move(state.quote.description, fromIndex, toIndex)
          }),
        ),

      addItem: () =>
        set(
          produce((state: QuoteState) => void state.quote.items.push({ pos: '', text: '', price: 0.0 })),
        ),
      updateItem: (item: { pos: string; text: string; price: number }, index: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.items[index] = item
            state.quote.total.subtotal = state.quote.items.reduce((acc, item) => acc + item.price, 0)
            state.quote.total.mwst = state.quote.total.subtotal * 0.081
            state.quote.total.total = state.quote.total.subtotal + state.quote.total.mwst
          }),
        ),
      removeItem: (index: number) =>
        set(produce((state: QuoteState) => void state.quote.items.splice(index, 1))),
      moveItem: (fromIndex: number, toIndex: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.items = move(state.quote.items, fromIndex, toIndex)
          }),
        ),
      addTextblock: (value: string) =>
        set(produce((state: QuoteState) => void state.quote.textBlocks.push(value))),
      updateTextblock: (value: string, index: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.textBlocks[index] = value
          }),
        ),
      removeTextblock: (index: number) =>
        set(produce((state: QuoteState) => void state.quote.textBlocks.splice(index, 1))),

      moveTextblock: (fromIndex: number, toIndex: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.textBlocks = move(state.quote.textBlocks, fromIndex, toIndex)
          }),
        ),
      setDiscount: (type: 'amount' | 'percent', value: string) =>
        set(
          produce((state: QuoteState) => {
            const numberValue = Number.parseFloat(value) || 0

            console.log('discount', type, value, numberValue, typeof value)

            const amount =
              type === 'amount' ? numberValue || 0 : (state.quote.total.subtotal * numberValue) / 100
            const percent = type === 'percent' ? numberValue : numberValue / state.quote.total.subtotal
            state.quote.total.discount = { type, value: numberValue }
            state.display.discount.amount = amount
            state.display.discount.percent = percent
            state.quote.total.mwst = (state.quote.total.subtotal - amount) * 0.081
            state.quote.total.total = state.quote.total.subtotal - amount + state.quote.total.mwst
          }),
        ),
      clearInvoice: () => set({ quote: emptyQuote() }),
    }),
    {
      name: 'quote-store',
      // storage: createJSONStorage(() => localStorage),
    },
  ),
)

function emptyQuote(): CreateOrUpdateQuote {
  return {
    projectId: '',
    quoteNumber: 0,
    date: IsoDateString(new Date()),
    state: 'draft',
    description: [
      { key: 'Projekt', value: '' },
      { key: 'Objekt', value: '' },
      { key: 'Kontakt', value: '' },
    ],
    to: '',
    items: [],
    total: {
      subtotal: 0,
      mwst: 0,
      total: 0,
      discount: { type: 'percent', value: 0 },
      earlyPaymentDiscount: { type: 'percent', value: 0 },
    },
    textBlocks: [],
    notes: '',
  }
}

export function CreateOrUpdateQuoteView() {
  const {
    quote,
    display,
    // setInvoiceNumber,
    addDescriptionItem,
    updateDescriptionItem,
    removeDescriptionItem,
    moveDescriptionItem,
    setTo,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    addTextblock,
    updateTextblock,
    removeTextblock,
    moveTextblock,
    setDiscount,
    clearInvoice,
  } = useInvoiceStore((state) => state)

  const [createLink, setLink] = useState<string | undefined>(undefined)

  const { projectId } = useParams()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const createInvoice = async () => {
    setLink('creating')
    console.log('invoice', { ...quote, projectId })
    const response = await apiClient.createOrUpdateQuote({
      body: { ...quote, projectId },
    })
    if (response.status !== 200) {
      setLink(undefined)
      throw new Error('Failed to create invoice')
    }
    console.log('data', response.body)
    // setLink(response.body.url)
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Angebot erstellen</Typography>
        <Box sx={{ my: 2, display: 'flex', gap: 1 }}>
          <Button
            sx={{
              visibility: createLink ? 'visible' : 'hidden',
            }}
            variant="outlined"
            color="primary"
          >
            <Link href={createLink} target="_blank">
              Rechnung öffnen
            </Link>
          </Button>
          <LoadingButton
            onClick={createInvoice}
            loading={createLink === 'creating'}
            loadingIndicator="Wird erstellt..."
            variant="outlined"
          >
            Rechnung erstellen
          </LoadingButton>

          <Tooltip title="Formular löschen">
            <IconButton onClick={clearInvoice} color="primary">
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flex: 1 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Projekt
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                flex: 1,
                mt: 2,
              }}
            >
              <TextField
                label="Angebotsnummer"
                variant="outlined"
                // onChange={(ev) => setInvoiceNumber(ev.target.value)}
                value={quote.quoteNumber}
                disabled
              />

              {quote.description.map(({ key, value }, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Box key={index} sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      sx={{ width: '30%' }}
                      variant="outlined"
                      onChange={(ev) => updateDescriptionItem(index, { key: ev.target.value, value })}
                      value={key}
                    />

                    <TextField
                      sx={{ flexGrow: 1 }}
                      variant="outlined"
                      onChange={(ev) => updateDescriptionItem(index, { key, value: ev.target.value })}
                      value={value}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0 }}>
                    <Box>
                      <IconButton onClick={() => removeDescriptionItem(index)}>
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton onClick={() => moveDescriptionItem(index, index - 1)}>
                        <KeyboardArrowUp />
                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton onClick={() => moveDescriptionItem(index, index + 1)}>
                        <KeyboardArrowDown />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Box>
                <IconButton onClick={() => addDescriptionItem()}>
                  <Add />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Adresse
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <TextField
                label="Adresse"
                variant="outlined"
                onChange={(ev) => setTo(ev.target.value)}
                value={quote.to}
                multiline
                rows={6}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {quote.items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Card sx={{ flex: 1, my: 1 }} key={index}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Position {index + 1}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  width: '100%',
                }}
              >
                <TextField
                  sx={{ flex: 1 }}
                  label="Position "
                  variant="outlined"
                  onChange={(ev) =>
                    updateItem(
                      {
                        pos: ev.target.value,
                        text: item.text,
                        price: item.price,
                      },
                      index,
                    )
                  }
                  value={item.pos}
                />
                <TextField
                  label="Preis"
                  variant="outlined"
                  onChange={(ev) =>
                    updateItem(
                      {
                        pos: item.pos,
                        text: item.text,
                        price: Number.parseFloat(ev.target.value),
                      },
                      index,
                    )
                  }
                  value={item.price}
                />
              </Box>

              <TextField
                sx={{ flex: 1 }}
                label="Text "
                variant="outlined"
                onChange={(ev) =>
                  updateItem({ text: ev.target.value, pos: item.pos, price: item.price }, index)
                }
                multiline
                rows={10}
                value={item.text}
              />
            </Box>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton onClick={() => removeItem(index)}>
              <DeleteOutline />
            </IconButton>
            <IconButton onClick={() => moveItem(index, index - 1)}>
              <KeyboardArrowUp />
            </IconButton>
            <IconButton onClick={() => moveItem(index, index + 1)}>
              <KeyboardArrowDown />
            </IconButton>
          </CardActions>
        </Card>
      ))}

      <Card sx={{ flex: 1, my: 1 }}>
        <CardContent>
          {quote.items.length === 0 && (
            <>
              <Typography gutterBottom variant="h5" component="div">
                Positionen
              </Typography>

              <Typography gutterBottom variant="body1" component="div">
                Noch keine Positionen vorhanden. Füge eine Position hinzu.
              </Typography>
            </>
          )}
          <Button variant="outlined" onClick={() => addItem()} startIcon={<Add />}>
            Position hinzufügen
          </Button>
        </CardContent>
      </Card>

      {quote.textBlocks.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Card sx={{ flex: 1, my: 1 }} key={index}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Textbaustein {index + 1}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="Position "
                variant="outlined"
                onChange={(ev) => updateTextblock(ev.target.value, index)}
                multiline
                rows={10}
                value={item}
              />
            </Box>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => removeTextblock(index)}>
              <DeleteOutline />
            </IconButton>
            <IconButton onClick={() => moveTextblock(index, index - 1)}>
              <KeyboardArrowUp />
            </IconButton>
            <IconButton onClick={() => moveTextblock(index, index + 1)}>
              <KeyboardArrowDown />
            </IconButton>
          </CardActions>
        </Card>
      ))}

      <Card sx={{ flex: 1 }}>
        <CardContent>
          {quote.textBlocks.length === 0 && (
            <>
              <Typography gutterBottom variant="h5" component="div">
                Textbausteine
              </Typography>

              <Typography gutterBottom variant="body1" component="div">
                Noch keine Textbausteine vorhanden. Füge eine Textbaustein hinzu.
              </Typography>
            </>
          )}
          <Button variant="outlined" onClick={handleClick} startIcon={<Add />}>
            Textbaustein hinzufügen
          </Button>
          <Menu
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {preparedSnippets.map((snippet, index) => (
              <MenuItem
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                onClick={() => {
                  addTextblock(snippet.text)
                  handleClose()
                }}
              >
                <ListItemText primary={snippet.label} secondary={snippet.text.slice(0, 50)} />
              </MenuItem>
            ))}
          </Menu>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1 }}>
        <CardContent>
          <>
            <Typography gutterBottom variant="h5" component="div">
              Total
            </Typography>
          </>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Subtotal" variant="outlined" value={quote.total.subtotal} disabled />
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                type="number"
                label="Discount %"
                variant="outlined"
                onChange={(ev) => setDiscount('percent', ev.target.value)}
                value={display.discount.percent.toString()}
              />
              <TextField
                sx={{ flex: 1 }}
                type="number"
                label="Discount CHF"
                variant="outlined"
                onChange={(ev) => setDiscount('amount', ev.target.value)}
                value={display.discount.amount.toString()}
              />
            </Box>

            <TextField label="Mwst" variant="outlined" value={quote.total.mwst.toFixed(2)} disabled />
            <TextField label="Total" variant="outlined" value={quote.total.total.toFixed(2)} disabled />
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

const preparedSnippets = [
  {
    label: 'Leer',
    text: '',
  },
  {
    label: 'Vorsicht',
    text: '**Bemerkungen:**\n\nTrotz grösster Vorsicht beim bohren der Montagelöcher, kann es zu kleinen Mauerausbrüchen kommen. Diese müssten bauseitig ausgebessert werden. Das obere durchlaufende Verstärkungsrohr ist mit einer Bauhöhe von 20 mm eingeplant. Bei einer grossen Gewichtsbelastung des Tablars, kann es trotzdem zu einer sichtbaren Durchbiegung kommen. Bei den verschliffenen Schweissstellen, können je nach Lichteinfall, leichte Unebenheiten in der Oberfläche wahrgenommen werden.',
  },
  {
    label: 'Bauseitige Leistungen',
    text: '**Bauseitige Leistungen:**\n\n* Baustatik und Bauphysik\n* Koordination Bauherrschaft\n* Spitz- und Maurerarbeiten\n\nFreiräumen der Arbeitszonen\n\nSchlussreinigung nach Montage\n\nAnpassung Bodenbeläge\n\nGipser- und Malerarbeiten',
  },
  {
    label: 'Lieferfrist',
    text: '**Lieferfrist::**\n\nNach Absprache (ca. 5-6 Arbeitswochen ab Plangenehmigung)\n\n<span style="color:red">**Unsere Weihnachtsferien sind in der KW 52 + KW 01.**<span />',
  },
  {
    label: 'Vorbehalt Preisaufschläge',
    text: '**Vorbehalt Preisaufschläge / Verfügbarkeit:**\n\nAngebot freibleibend gültig. Verfügbarkeiten und Preise können sich jederzeit ändern. Aufgrund der aktuellen Marktsituation, muss mit Preisaufschlägen und längeren Lieferfristen gerechnet werden.',
  },
]
