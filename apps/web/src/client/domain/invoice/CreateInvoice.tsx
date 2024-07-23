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
import { useState } from 'react'

import { KeyboardArrowUp, KeyboardArrowDown, DeleteOutline, Add, Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import '@mdxeditor/editor/style.css'
import { produce } from 'immer'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Snippet, CreateInvoice } from '@/common/invoice/CreateInvoice'
import { move } from '@easy-kmu/common'
import { apiClient } from '@/client/api/client'

interface InvoiceState {
  invoice: CreateInvoice
  setInvoiceNumber: (project: string) => void
  addProjectItem: () => void
  updateProjectItem: (index: number, item: [string, string]) => void
  removeProjectItem: (index: number) => void
  moveProjectItem: (fromIndex: number, toIndex: number) => void
  setCompany: (value: string) => void
  setName: (value: string) => void
  setAddress: (value: string) => void
  setZip: (value: string) => void
  setCity: (value: string) => void
  addItem: () => void
  updateItem: (item: { pos: string; text: string; price: number }, index: number) => void
  removeItem: (index: number) => void
  moveItem: (fromIndex: number, toIndex: number) => void
  addSnippet: (snippet: Snippet) => void
  removeSnippet: (index: number) => void
  updateSnippet: (snippet: Snippet, index: number) => void
  moveSnippet: (fromIndex: number, toIndex: number) => void
  clearInvoice: () => void
}

const useInvoiceStore = create(
  persist<InvoiceState>(
    (set) => ({
      invoice: emptyInvoice(),
      setInvoiceNumber: (invoiceNumber: string) =>
        set((state) => ({ invoice: { ...state.invoice, invoiceNumber } })),
      addProjectItem: () =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.project.push(['Neu', ''])
          }),
        ),
      updateProjectItem: (index: number, item: [string, string]) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.project[index] = item
          }),
        ),

      removeProjectItem: (index: number) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.project = state.invoice.project.filter((_, i) => i !== index)
          }),
        ),
      moveProjectItem: (fromIndex: number, toIndex: number) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.project = move(state.invoice.project, fromIndex, toIndex)
          }),
        ),
      setCompany: (value: string) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.to.company = value
          }),
        ),
      setName: (value: string) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.to.name = value
          }),
        ),
      setAddress: (value: string) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.to.address = value
          }),
        ),
      setZip: (value: string) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.to.zip = value
          }),
        ),
      setCity: (value: string) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.to.city = value
          }),
        ),

      addItem: () =>
        set(
          produce(
            (state: InvoiceState) => void state.invoice.items.push({ pos: '', text: '', price: 0.0 }),
          ),
        ),
      updateItem: (item: { pos: string; text: string; price: number }, index: number) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.items[index] = item
          }),
        ),
      removeItem: (index: number) =>
        set(produce((state: InvoiceState) => void state.invoice.items.splice(index, 1))),
      moveItem: (fromIndex: number, toIndex: number) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.items = move(state.invoice.items, fromIndex, toIndex)
          }),
        ),
      addSnippet: (snippet: Snippet) =>
        set(produce((state: InvoiceState) => void state.invoice.snippets.push(snippet))),
      updateSnippet: (snippet: Snippet, index: number) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.snippets[index] = snippet
          }),
        ),
      removeSnippet: (index: number) =>
        set(produce((state: InvoiceState) => void state.invoice.snippets.splice(index, 1))),

      moveSnippet: (fromIndex: number, toIndex: number) =>
        set(
          produce((state: InvoiceState) => {
            state.invoice.snippets = move(state.invoice.snippets, fromIndex, toIndex)
          }),
        ),
      clearInvoice: () => set({ invoice: emptyInvoice() }),
    }),
    {
      name: 'invoice-store',
      // storage: createJSONStorage(() => localStorage),
    },
  ),
)

function emptyInvoice(): CreateInvoice {
  return {
    invoiceNumber: '',
    project: [
      ['Projekt', ''],
      ['Objekt', ''],
      ['Kontakt', ''],
    ],
    to: {
      company: '',
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
    },
    items: [] as { pos: string; text: string; price: number }[],
    snippets: [],
  }
}

export function CreateInvoiceForm() {
  const {
    invoice,
    setInvoiceNumber,
    addProjectItem,
    updateProjectItem,
    removeProjectItem,
    moveProjectItem,
    setCompany,
    setName,
    setAddress,
    setZip,
    setCity,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    addSnippet,
    updateSnippet,
    removeSnippet,
    moveSnippet,
    clearInvoice,
  } = useInvoiceStore((state) => state)

  const [createLink, setLink] = useState<string | undefined>(undefined)

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
    console.log('invoice', invoice)
    const response = await apiClient.createInvoicePdf({
      body: invoice,
    })
    if (response.status !== 200) {
      setLink(undefined)
      throw new Error('Failed to create invoice')
    }
    console.log('data', response.body)
    setLink(response.body.url)
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Rechnung erstellen</Typography>
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
                label="Rechnungsnummer"
                variant="outlined"
                onChange={(ev) => setInvoiceNumber(ev.target.value)}
                value={invoice.invoiceNumber}
              />

              {invoice.project.map(([key, value], index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Box key={index} sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      sx={{ width: '30%' }}
                      variant="outlined"
                      onChange={(ev) => updateProjectItem(index, [ev.target.value, value])}
                      value={key}
                    />

                    <TextField
                      sx={{ flexGrow: 1 }}
                      variant="outlined"
                      onChange={(ev) => updateProjectItem(index, [key, ev.target.value])}
                      value={value}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0 }}>
                    <Box>
                      <IconButton onClick={() => removeProjectItem(index)}>
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton onClick={() => moveProjectItem(index, index - 1)}>
                        <KeyboardArrowUp />
                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton onClick={() => moveProjectItem(index, index + 1)}>
                        <KeyboardArrowDown />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Box>
                <IconButton onClick={() => addProjectItem()}>
                  <Add />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Rechnungsadresse
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <TextField
                label="Firma"
                variant="outlined"
                onChange={(ev) => setCompany(ev.target.value)}
                value={invoice.to.company}
              />

              <TextField
                label="Name"
                variant="outlined"
                onChange={(ev) => setName(ev.target.value)}
                value={invoice.to.name}
              />
              <TextField
                label="Adresse"
                variant="outlined"
                onChange={(ev) => setAddress(ev.target.value)}
                value={invoice.to.address}
              />

              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <TextField
                  label="PLZ"
                  variant="outlined"
                  onChange={(ev) => setZip(ev.target.value)}
                  value={invoice.to.zip}
                />

                <TextField
                  label="Ort"
                  variant="outlined"
                  onChange={(ev) => setCity(ev.target.value)}
                  value={invoice.to.city}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {invoice.items.map((item, index) => (
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
          {invoice.items.length === 0 && (
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

      {invoice.snippets.map((item, index) => (
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
                onChange={(ev) => updateSnippet({ ...item, text: ev.target.value }, index)}
                multiline
                rows={10}
                value={item.text}
              />
            </Box>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => removeSnippet(index)}>
              <DeleteOutline />
            </IconButton>
            <IconButton onClick={() => moveSnippet(index, index - 1)}>
              <KeyboardArrowUp />
            </IconButton>
            <IconButton onClick={() => moveSnippet(index, index + 1)}>
              <KeyboardArrowDown />
            </IconButton>
          </CardActions>
        </Card>
      ))}

      <Card sx={{ flex: 1 }}>
        <CardContent>
          {invoice.snippets.length === 0 && (
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
                  addSnippet(snippet)
                  handleClose()
                }}
              >
                <ListItemText primary={snippet.label} secondary={snippet.text.slice(0, 50)} />
              </MenuItem>
            ))}
          </Menu>
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
