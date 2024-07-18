import { useQuery } from 'react-query'
import { apiClient } from '@/client/api/client'
import { Box, Button, IconButton, Typography } from '@mui/material'
import 'react-data-grid/lib/styles.css'

import DataGrid, {
  SelectCellFormatter,
  SelectColumn,
  textEditor,
  useRowSelection,
  type Column,
  type SortColumn,
} from 'react-data-grid'
import { Add, Close, ContentCopy, Delete, Edit, Info } from '@mui/icons-material'
import { useMemo, useState } from 'react'
import type { KeysOfType } from '@easy-kmu/common'
import type { Contact } from '@/common/contact/contact'
import { useDialog } from '@/client/utils/useDialog'
import { AddContactDialog } from '@/client/contacts/AddContactDialog'

const columns = [
  // { key: 'id', name: 'ID' },
  SelectColumn,
  { key: 'comapny', name: 'Firma', frozen: true },
  { key: 'firstName', name: 'firstName', frozen: true },
  { key: 'lastName', name: 'lastName', frozen: true },
  { key: 'salutation', name: 'salutation' },
  { key: 'address', name: 'address' },
  { key: 'zipCode', name: 'zipCode' },
  { key: 'city', name: 'city' },
]

function rowKeyGetter(row: any) {
  return row.id
}

type Comparator = (a: Contact, b: Contact) => number
type Colums = KeysOfType<Contact, any>

function getComparator(sortColumn: Colums): Comparator {
  switch (sortColumn) {
    case 'salutation':
    case 'firstName':
    case 'lastName':
    case 'city':
    case 'country':
    case 'company':
    case 'address':
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn])
      }
    case 'id':
      return (a, b) => {
        return a[sortColumn] - b[sortColumn]
      }
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`)
  }
}

export function Contacts() {
  const query = useQuery({ queryKey: ['contacts'], queryFn: apiClient.listContacts })
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])

  const [selectedRows, setSelectedRows] = useState((): ReadonlySet<number> => new Set())
  const [showSidebar, setShowSidebar] = useState(false)
  const dialog = useDialog()

  const sortedRows = useMemo((): readonly Contact[] => {
    if (!query.data?.body) return []
    if (sortColumns.length === 0) return query.data?.body

    return [...query.data.body].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey)
        const compResult = comparator(a, b)
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult
        }
      }
      return 0
    })
  }, [query.data?.body, sortColumns])

  const gridWithInPercent = showSidebar ? 70 : 100

  if (!query.data?.body) return <div>Loading...</div>

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ my: 2 }}>
          Contacts
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" onClick={() => dialog.open()}>
            <Add />
          </IconButton>
          <IconButton color="primary" onClick={() => setShowSidebar(!showSidebar)}>
            <Info />
          </IconButton>
        </Box>
      </Box>
      {dialog.isOpen && <AddContactDialog dialog={dialog} />}
      <Box sx={{ display: 'flex', flexDirection: 'row', border: 1, height: '50px' }}>
        {selectedRows.size > 0 && (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                console.log('close', selectedRows)
              }}
            >
              <Close />
            </IconButton>
            <Typography sx={{ m: 1, mr: 4 }} variant="body1">
              {selectedRows.size} selected
            </Typography>
            <IconButton
              color="primary"
              onClick={() => {
                console.log('delete', selectedRows)
              }}
            >
              <Edit />
            </IconButton>

            <IconButton
              color="primary"
              onClick={() => {
                console.log('delete', selectedRows)
              }}
            >
              <Delete />
            </IconButton>

            <IconButton
              color="primary"
              onClick={() => {
                console.log('delete', selectedRows)
              }}
            >
              <ContentCopy />
            </IconButton>
          </>
        )}
        {selectedRows.size === 0 && (
          <>
            <Typography variant="body1">Filter</Typography>
          </>
        )}
      </Box>
      {query.data && (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
          <Box sx={{ width: `${gridWithInPercent}%` }}>
            <DataGrid
              className="fill-grid-XXXXX"
              columns={columns}
              rows={sortedRows}
              rowKeyGetter={rowKeyGetter}
              defaultColumnOptions={{
                sortable: true,
                resizable: true,
              }}
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
              sortColumns={sortColumns}
              onSortColumnsChange={setSortColumns}
              rowHeight={50}
              onSelectedCellChange={(cell) => {
                console.log('onSelectedCellChange', cell)
              }}
            />
          </Box>
          {showSidebar && (
            <Box sx={{ mx: 2, mt: 1 }}>
              {selectedRows.size > 0 && (
                <>
                  <Typography variant="h4">
                    {sortedRows.find(({ id }) => id === selectedRows.values().next().value)?.firstName}
                  </Typography>
                </>
              )}
              {selectedRows.size === 0 && (
                <Typography variant="body1">Kein Kontakt ausgewählt</Typography>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
