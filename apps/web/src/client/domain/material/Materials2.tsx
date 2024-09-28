import { apiClient } from '@/client/api/client'
import { Add, Close, Delete, Edit } from '@mui/icons-material'
import { Box, Button, IconButton, Paper, TextField, Typography } from '@mui/material'
import {
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  MaterialReactTable,
  getMRT_RowSelectionHandler,
  useMaterialReactTable,
} from 'material-react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useDebounce } from 'react-use'
import { useSortingWithSearchParams } from '@/client/utils/dataGrid'
import { useDialogWithData } from '@/client/utils/useDialogWithData'
import { HttpError, isLength } from '@easy-kmu/common'
import type { Material } from '@/common/models/material'
import { MaterialGroupAutocomplete } from '@/client/domain/material/MaterialGroupAutocomplete'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'

export function Materials2() {
  const query = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const response = await apiClient.materials()
      if (response.status === 200) return response.body
      throw new HttpError('Failed to read objects', response.status)
    },
  })

  const materialGroupsQuery = useQuery({
    queryKey: ['materialsGroups'],
    queryFn: async () => {
      const response = await apiClient.materialGroups()
      if (response.status === 200) return response.body
      throw new HttpError('Failed to read objects', response.status)
    },
  })

  const dialog = useDialogWithData<Material>()

  const [selectedRows, setSelectedRows] = useState<Material[]>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [globalFilterDebounced, setGlobalFilterDebounced] = useState<string>('')
  const [materialGroup, setMaterialGroup] = useState<string | null>(null)
  const [material, setMaterial] = useState<Material[]>([])

  useEffect(() => {
    if (!query.data) return
    if (materialGroup) setMaterial(query.data.filter((m) => m.materialGroupId === materialGroup))
    else setMaterial(query.data)
  }, [materialGroup, query.data])

  useDebounce(() => void setGlobalFilterDebounced(globalFilter), 700, [globalFilter])

  const clearSelectionCallbackRef = useRef<() => void>()

  function registerClearSelectionCallback(callback: () => void) {
    clearSelectionCallbackRef.current = callback
  }

  if (!query.data) return <div>Loading...</div>
  if (!materialGroupsQuery.data) return <div>Loading...</div>

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ my: 2 }}>
          Material
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton disabled={true} color="primary" onClick={() => {}}>
            <Add />
          </IconButton>
          {/* <IconButton color="primary" onClick={() => setShowSidebar(!showSidebar)}>
            <Info />
          </IconButton> */}
        </Box>
      </Box>

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
              <Button variant="outlined" startIcon={<Delete />} color="error">
                Löschen
              </Button>
            </Box>
          </Box>
        )}
        {selectedRows.length === 0 && (
          <>
            <MaterialGroupAutocomplete
              sx={{ width: '300px', mr: 2 }}
              value={materialGroup || undefined}
              groups={materialGroupsQuery.data}
              label="Materialgruppe"
              onObjectChange={(group) => {
                console.log('group', group)
                if (group) setMaterialGroup(group.id)
              }}
            />
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
      {material && (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', gap: 2, width: 1 }}>
          <MaterialGrid
            data={material}
            onRowSelectionChange={setSelectedRows}
            globalFilter={globalFilterDebounced}
            registerClearSelectionCallback={registerClearSelectionCallback}
          />
        </Box>
      )}
    </Box>
  )
}

const columns: GridColDef<Material>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'name',
    width: 150,
    editable: true,
  },
  {
    field: 'kgPerMeter',
    headerName: 'kgPerMeter',
    width: 150,
    editable: true,
  },
  {
    field: 'pricePerMeter',
    headerName: 'pricePerMeter',
    width: 110,
    editable: true,
  },
  {
    field: 'pricePerKg',
    headerName: 'pricePerKg',
    description: 'This column has a value getter and is not sortable.',
    width: 160,
  },
  {
    field: 'length',
    headerName: 'length',
    description: 'This column has a value getter and is not sortable.',
    width: 160,
  },
]

function MaterialGrid({
  data,
  globalFilter,
  onRowSelectionChange,
  registerClearSelectionCallback,
}: {
  data: Material[]
  globalFilter: string
  onRowSelectionChange: (selected: Material[]) => void
  registerClearSelectionCallback: (callback: () => void) => void
}) {
  return (
    <Box sx={{ width: 1 }}>
      <DataGrid
        sx={{ height: 'calc(100vh - 375px)' }}
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        autoHeight={false}
        // pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  )
}
