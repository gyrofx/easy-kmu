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
  Menu,
  styled,
  type MenuProps,
  alpha,
} from '@mui/material'
import { useEffect, useState } from 'react'

import { Assistant, KeyboardArrowUp, DeleteOutline, Add, KeyboardArrowDown } from '@mui/icons-material'
import { apiClient } from '@/client/api/client'
import { useParams } from 'react-router-dom'
import { useProjectQuery } from '@/client/domain/projects/useProjectQuery'
import type { Contact } from '@/common/models/contact'
import { truthy } from '@/client/utils/array'
import type { ProjectObject } from '@/common/models/projectObject'
import { useRouter } from '@/client/router/useRouter'
import { useQuoteStore } from '@/client/domain/quotes/useQuoteStore'
import type { Project } from '@/common/models/project'
import { useQuoteQuery } from '@/client/domain/quotes/useQuoteQuery'
import type { Quote } from '@/common/models/quote'

export function UpdateQuoteView() {
  const { quoteId } = useParams()
  const quoteQuery = useQuoteQuery(quoteId || '')

  if (!quoteId) return <h1>Quote ID is missing</h1>
  if (quoteQuery.isLoading) return <h1>Loading...</h1>
  if (quoteQuery.error) return <h1>Error</h1>

  const quote = quoteQuery.data
  if (!quote) return <h1>Quote not found</h1>

  return <CreateOrUpdateQuoteView projectId={quote.projectId} quote={quote} />
}

export function CreateQuoteView() {
  const { projectId } = useParams()
  if (!projectId) return <h1>Project ID is missing</h1>

  return <CreateOrUpdateQuoteView projectId={projectId} />
}

export function CreateOrUpdateQuoteView({ projectId, quote }: { projectId: string; quote?: Quote }) {
  const projectQuery = useProjectQuery(projectId || '')
  const { setInitialQuote } = useQuoteStore((state) => state)

  useEffect(() => {
    if (quote) setInitialQuote(quote)
  }, [quote, setInitialQuote])

  if (projectQuery.isLoading) return <h1>Loading...</h1>
  if (projectQuery.error) return <h1>Error</h1>

  const project = projectQuery.data
  if (!project) return <h1>Project not found</h1>

  const creating = !quote
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Angebot erstellen</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, mb: 2 }}>
        <ProjectCard project={project} />
        <AddressCard project={project} />

        <PositionsCards />
        <AddPositionCard />

        <TextBlocksCards />
        <AddTextBlockCard />

        <TotalCard />

        <Actions project={project} creating={creating} />
      </Box>
    </Container>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const {
    quote,
    updateDescriptionItem,
    moveDescriptionItem,
    removeDescriptionItem,
    addDescriptionItem,
  } = useQuoteStore((state) => state)

  const possibleDescriptionValues: [string, string][] = [
    ['Projektname', project.name] as [string, string],
    project.customer
      ? (['Auftraggeber', toSingleLineContact(project.customer)] as [string, string])
      : undefined,
    project.builder
      ? (['Bauherr', toSingleLineContact(project.builder)] as [string, string])
      : undefined,
    project.constructionManagement
      ? (['Bauleiter', toSingleLineContact(project.constructionManagement)] as [string, string])
      : undefined,
    project.architect
      ? (['Architekt', toSingleLineContact(project.architect)] as [string, string])
      : undefined,
    project.object ? (['Objekt', toSingleLineObject(project.object)] as [string, string]) : undefined,
  ].filter(truthy)

  return (
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
          {quote.description.map(({ key, value }, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Box key={index} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
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
                  <AssistantButton
                    values={possibleDescriptionValues.map((v) => v.join(': '))}
                    onChange={(suggestionIndex) => {
                      const newValue = possibleDescriptionValues[suggestionIndex]?.[1] || ''
                      updateDescriptionItem(index, { key, value: newValue })
                    }}
                  />
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
                <Box>
                  <IconButton onClick={() => removeDescriptionItem(index)}>
                    <DeleteOutline />
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
  )
}

function AddressCard({ project }: { project: Project }) {
  const { quote, setTo } = useQuoteStore((state) => state)

  const possibleAddressValues: [string, string][] = [
    project.customer ? (['Auftraggeber', toAddress(project.customer)] as [string, string]) : undefined,
    project.builder ? (['Bauherr', toAddress(project.builder)] as [string, string]) : undefined,
    project.constructionManagement
      ? (['Bauleiter', toAddress(project.constructionManagement)] as [string, string])
      : undefined,
    project.architect ? (['Architekt', toAddress(project.architect)] as [string, string]) : undefined,
  ].filter(truthy)

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography gutterBottom variant="h5" component="div">
            Adresse
          </Typography>
          <AssistantButton
            values={possibleAddressValues.map((v) => v.join(': '))}
            onChange={(suggestionIndex) => {
              const value = possibleAddressValues[suggestionIndex]?.[1] || ''
              setTo(value)
            }}
          />
        </Box>

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
  )
}

function PositionsCards() {
  const { quote, updateItem, removeItem, moveItem } = useQuoteStore((state) => state)

  return quote.items.map((item, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
    <Card sx={{ flex: 1 }} key={index}>
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
  ))
}

function AddPositionCard() {
  const { addItem, quote } = useQuoteStore((state) => state)
  return (
    <Card sx={{ flex: 1 }}>
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
  )
}

function TextBlocksCards() {
  const { quote, updateTextblock, removeTextblock, moveTextblock } = useQuoteStore((state) => state)

  const textBlockSnippets = preparedSnippets.map((snippet) => snippet.label)

  return quote.textBlocks.map((item, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
    <Card sx={{ flex: 1, my: 1 }} key={index}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography gutterBottom variant="h5" component="div">
            Textbaustein {index + 1}
          </Typography>
          <AssistantButton
            values={textBlockSnippets}
            onChange={(snippetIndex) => {
              const value = preparedSnippets[snippetIndex]?.text || ''
              updateTextblock(value, index)
            }}
          />
        </Box>
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
  ))
}

function AddTextBlockCard() {
  const { addTextblock, quote } = useQuoteStore((state) => state)

  return (
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
        <Button variant="outlined" onClick={() => addTextblock('')} startIcon={<Add />}>
          Textbaustein hinzufügen
        </Button>
      </CardContent>
    </Card>
  )
}

function TotalCard() {
  const { quote, setDiscount } = useQuoteStore((state) => state)

  return (
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
              value={quote.total.discount.percent.toString()}
            />
            <TextField
              sx={{ flex: 1 }}
              type="number"
              label="Discount CHF"
              variant="outlined"
              onChange={(ev) => setDiscount('amount', ev.target.value)}
              value={quote.total.discount.amount.toString()}
            />
          </Box>

          <TextField label="Mwst" variant="outlined" value={quote.total.mwst.toFixed(2)} disabled />
          <TextField label="Total" variant="outlined" value={quote.total.total.toFixed(2)} disabled />
        </Box>
      </CardContent>
    </Card>
  )
}

function Actions({ project, creating }: { project: Project; creating: boolean }) {
  const { quote, clearInvoice } = useQuoteStore((state) => state)
  const { navigateToProjectQuotes } = useRouter()

  const createOrUpdateQuote = async () => {
    const response = await apiClient.createOrUpdateQuote({
      body: { ...quote, projectId: project.id },
    })
    if (response.status !== 200) {
      throw new Error('Failed to create invoice')
    }
    clearInvoice()
    navigateToProjectQuotes(project)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Button
        variant="outlined"
        onClick={() => {
          clearInvoice()
          navigateToProjectQuotes(project)
        }}
      >
        Abbrechen
      </Button>
      <Button variant="contained" onClick={createOrUpdateQuote}>
        {creating ? 'Angebot erstellen' : 'Angebot aktualisieren'}
      </Button>
    </Box>
  )
}

function toSingleLineContact(contact: Contact) {
  return `${contact.company}, ${contact.firstName} ${contact.lastName}, ${contact.persons[0]?.phone1}, ${contact.persons[0]?.email}`
}

function toAddress(contact: Contact) {
  return [
    contact.company,
    `${contact.firstName} ${contact.lastName}`,
    contact.address,
    `${contact.zipCode} ${contact.city}`,
  ]
    .map((v) => v.trim())
    .filter((v) => v)
    .join('\n')
}

function toSingleLineObject(object: ProjectObject) {
  return `${object.appartement}, ${object.floor}, ${object.address}, ${object.zipCode} ${object.city}`
}

const preparedSnippets = [
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

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}))

export default function AssistantButton({
  values,
  onChange,
}: { values: string[]; onChange: (index: number) => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Assistant />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {values.map((value, index) => (
          <MenuItem
            key={value}
            onClick={() => {
              onChange(index)
              handleClose()
            }}
            disableRipple
          >
            {value}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  )
}
