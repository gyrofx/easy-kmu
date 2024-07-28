import { apiClient } from '@/client/api/client'
import { AddContactDialog } from '@/client/domain/contacts/CreateOrUpdateContactDialog'
import { Add, Close, ContentCopy, Delete, Edit, Info } from '@mui/icons-material'
import { Box, Button, IconButton, Paper, TextField, Typography } from '@mui/material'
import {
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  MaterialReactTable,
  getMRT_RowSelectionHandler,
  useMaterialReactTable,
} from 'material-react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import './ContactGrid.css'
import { useSortingWithSearchParams } from '@/client/utils/dataGrid'
import { useDialogWithData } from '@/client/utils/useDialogWithData'
import { isLength } from '@easy-kmu/common'
import type { Contact } from '@/common/models/contact'
import { useContactsQuery } from '@/client/domain/contacts/useContactsQuery'

export function Contacts() {
  const query = useContactsQuery()
  // const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])

  const [showSidebar, setShowSidebar] = useState(false)
  const dialog = useDialogWithData<Contact | undefined>()

  const [selectedRows, setSelectedRows] = useState<Contact[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [globalFilterDebounced, setGlobalFilterDebounced] = useState<string>('')

  useDebounce(() => void setGlobalFilterDebounced(globalFilter), 700, [globalFilter])

  const clearSelectionCallbackRef = useRef<() => void>()

  function registerClearSelectionCallback(callback: () => void) {
    clearSelectionCallbackRef.current = callback
  }

  if (!query.data) return <div>Loading...</div>

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ my: 2 }}>
          Kontakte
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" onClick={() => dialog.open(undefined)}>
            <Add />
          </IconButton>
          <IconButton color="primary" onClick={() => setShowSidebar(!showSidebar)}>
            <Info />
          </IconButton>
        </Box>
      </Box>
      {dialog.isOpen && <AddContactDialog dialog={dialog} />}
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
                  dialog.open(selectedRows[0])
                }}
              >
                Bearbeiten
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
          <ContactGrid
            data={query.data}
            onRowSelectionChange={setSelectedRows}
            globalFilter={globalFilterDebounced}
            registerClearSelectionCallback={registerClearSelectionCallback}
          />
          {showSidebar && (
            <Paper sx={{ display: 'flex', flexDirection: 'row', my: 0, p: 2, width: '500px' }}>
              {selectedRows.length > 0 && (
                <Typography variant="h4">
                  {selectedRows[0]?.firstName} {selectedRows[0]?.lastName}
                </Typography>
              )}
              {selectedRows.length === 0 && (
                <Typography variant="h4">Kein Kontakt ausgewählt</Typography>
              )}
            </Paper>
          )}
        </Box>
      )}
    </Box>
  )
}

function ContactGrid({
  data,
  globalFilter,
  onRowSelectionChange,
  registerClearSelectionCallback,
}: {
  data: Contact[]
  globalFilter: string
  onRowSelectionChange: (selected: Contact[]) => void
  registerClearSelectionCallback: (callback: () => void) => void
}) {
  const [sorting, setSorting] = useSortingWithSearchParams()
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})

  const columns = useMemo<MRT_ColumnDef<Contact>[]>(
    () => [
      {
        accessorKey: 'company', //simple recommended way to define a column
        header: 'Firma',
        muiTableHeadCellProps: { style: { color: 'green' } }, //custom props
        enableHiding: false,
      },
      {
        accessorKey: 'firstName', //simple recommended way to define a column
        header: 'Vorname',
        muiTableHeadCellProps: { style: { color: 'green' } }, //custom props
        enableHiding: false,
      },
      {
        accessorKey: 'lastName', //simple recommended way to define a column
        header: 'Nachname',
        muiTableHeadCellProps: { style: { color: 'green' } }, //custom props
        enableHiding: false,
      },
      {
        accessorKey: 'address', //simple recommended way to define a column
        header: 'Adrersse',
        muiTableHeadCellProps: { style: { color: 'green' } }, //custom props
        enableHiding: false,
      },
      {
        accessorKey: 'zipCode', //simple recommended way to define a column
        header: 'PLZ',
        muiTableHeadCellProps: { style: { color: 'green' } }, //custom props
        enableHiding: false,
      },
      {
        accessorKey: 'city', //simple recommended way to define a column
        header: 'Ort',
        muiTableHeadCellProps: { style: { color: 'green' } }, //custom props
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
      columnPinning: { left: ['company', 'firstName', 'lastName'], right: [] },
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
