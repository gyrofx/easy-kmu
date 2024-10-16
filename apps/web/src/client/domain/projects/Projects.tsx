import { Add, Close, ContentCopy, Delete, Edit, Info } from '@mui/icons-material'
import { Box, Button, IconButton, LinearProgress, Paper, TextField, Typography } from '@mui/material'
import {
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  MaterialReactTable,
  getMRT_RowSelectionHandler,
  useMaterialReactTable,
} from 'material-react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
// import './ContactGrid.css'
import { useSortingWithSearchParams } from '@/client/utils/dataGrid'
import { isLength } from '@easy-kmu/common'
import type { Project } from '@/common/models/project'
import { useProjectsQuery } from '@/client/domain/projects/useProjectsQuery'
import type { Contact } from '@/common/models/contact'
import { useRouter } from '@/client/router/useRouter'
import { PageContainer, PageContainerToolbar } from '@toolpad/core'

function ProjectsToolbar() {
  const { navigateToAddProjects } = useRouter()

  return (
    <PageContainerToolbar>
      <IconButton color="primary" onClick={navigateToAddProjects}>
        <Add />
      </IconButton>
    </PageContainerToolbar>
  )
}

export function Projects() {
  return (
    <PageContainer slots={{ toolbar: ProjectsToolbar }}>
      <ProjectsInner />
    </PageContainer>
  )
}

function ProjectsInner() {
  const query = useProjectsQuery()
  // const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const { navigateToProject } = useRouter()

  // const dialog = useDialogWithData<Contact | undefined>()

  const [selectedRows, setSelectedRows] = useState<Project[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [globalFilterDebounced, setGlobalFilterDebounced] = useState<string>('')

  useDebounce(() => void setGlobalFilterDebounced(globalFilter), 700, [globalFilter])

  const clearSelectionCallbackRef = useRef<() => void>()

  function registerClearSelectionCallback(callback: () => void) {
    clearSelectionCallbackRef.current = callback
  }

  if (!query.data) return <LinearProgress />

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* <Typography variant="h3" sx={{ my: 2 }}>
          Projekte
        </Typography> */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" onClick={navigateToAddProjects}>
            <Add />
          </IconButton>
          <IconButton color="primary" onClick={() => setShowSidebar(!showSidebar)}>
            <Info />
          </IconButton>
        </Box> */}
      </Box>
      {/* {dialog.isOpen && <AddContactDialog dialog={dialog} />} */}
      <Paper sx={{ display: 'flex', flexDirection: 'row', height: '70px', my: 2, p: 2 }}>
        {isLength(selectedRows, 1) && (
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Box sx={{ mr: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Close />}
                onClick={clearSelectionCallbackRef.current}
              >
                Selektion aufheben
              </Button>
            </Box>

            <Box>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => {
                  console.log('edit', selectedRows[0])
                  if (selectedRows[0]) navigateToProject(selectedRows[0])
                }}
              >
                Öffnen
              </Button>
            </Box>

            <Box>
              <Button variant="outlined" startIcon={<ContentCopy />}>
                Duplzieren
              </Button>
            </Box>

            <Box>
              <Button variant="outlined" startIcon={<Delete />} color="error">
                Löschen
              </Button>
            </Box>
          </Box>
        )}
        {selectedRows.length === 0 && (
          <>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              sx={{ width: '500px', mb: 2 }}
              onChange={(ev) => setGlobalFilter(ev.target.value)}
            />
          </>
        )}
      </Paper>
      {query.data && (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', gap: 2, width: 1 }}>
          <ProjectGrid
            data={query.data}
            onRowSelectionChange={setSelectedRows}
            globalFilter={globalFilterDebounced}
            registerClearSelectionCallback={registerClearSelectionCallback}
          />
        </Box>
      )}
    </Box>
  )
}

function ProjectGrid({
  data,
  globalFilter,
  onRowSelectionChange,
  registerClearSelectionCallback,
}: {
  data: Project[]
  globalFilter: string
  onRowSelectionChange: (selected: Project[]) => void
  registerClearSelectionCallback: (callback: () => void) => void
}) {
  const [sorting, setSorting] = useSortingWithSearchParams()
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})

  const columns = useMemo<MRT_ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: 'projectNumber',
        header: 'Projekt Nr.',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
      },
      {
        accessorKey: 'description',
        header: 'Beschreibung',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
      },
      {
        accessorFn: objectAsString,
        header: 'Objekt',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
      },
      {
        accessorFn: customerAsString,
        header: 'Auftraggeber',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
      },
    ],
    [],
  )

  registerClearSelectionCallback(() => setRowSelection({}))

  const table = useMaterialReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: true, //enable some features
    muiTableBodyRowProps: ({ row, staticRowIndex, table }) => ({
      onClick: (event) => getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event), //import this helper function from material-react-table
      sx: { cursor: 'pointer' },
    }),
    enableMultiRowSelection: false,
    enableColumnOrdering: false, //enable a feature for all columns
    enableGlobalFilter: true, //turn off a feature
    globalFilterFn: 'contains',

    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableTopToolbar: false,

    enableRowVirtualization: true,

    muiTableContainerProps: {
      // TODO: find a better way to set the height
      sx: { height: 'calc(100vh - 375px)' },
    },

    onSortingChange: setSorting,

    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      density: 'compact',
      rowSelection,
      globalFilter,
      // columnPinning: { left: ['projectNumber', 'name'], right: [] },
    },

    layoutMode: 'grid',
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    onRowSelectionChange(table.getSelectedRowModel().rows.map((row) => row.original))
  }, [rowSelection, onRowSelectionChange, table])

  return (
    <Box sx={{ width: 1 }}>
      <MaterialReactTable table={table} />
    </Box>
  )
}

function objectAsString(data: Project) {
  if (!data.object) return ''
  return `${data.object?.address}, ${data.object?.zipCode} ${data.object?.city}`
}

function customerAsString(data: Project) {
  if (!data.customer) return ''
  return contactAsString(data.customer)
}

function contactAsString(contact: Contact) {
  if (contact.company)
    return `${contact.company}, ${contact.address}, ${contact.zipCode} ${contact.city}`
  return `${contact.firstName} ${contact.lastName}, ${contact.address}, ${contact.zipCode} ${contact.city}`
}
