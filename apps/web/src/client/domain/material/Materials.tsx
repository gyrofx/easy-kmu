import { apiClient } from '@/client/api/client'
import { Add, Close, Delete, Edit } from '@mui/icons-material'
import { Box, Button, IconButton, Paper, TextField, Typography } from '@mui/material'
import {
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  type MRT_TableOptions,
  MaterialReactTable,
  getMRT_RowSelectionHandler,
  useMaterialReactTable,
} from 'material-react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useDebounce } from 'react-use'
import { useSortingWithSearchParams } from '@/client/utils/dataGrid'
import { useDialogWithData } from '@/client/utils/useDialogWithData'
import { HttpError, isLength, zodParse } from '@easy-kmu/common'
import type { CreateOrUpdateMaterial, Material } from '@/common/models/material'
import { MaterialGroupAutocomplete } from '@/client/domain/material/MaterialGroupAutocomplete'
import { z } from 'zod'

export function Materials() {
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
                setMaterialGroup(group?.id || null)
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

function useUpdateMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (material: CreateOrUpdateMaterial) => {
      return apiClient.createOrUpdateMaterial({ body: material })
    },
    onMutate: (newMaterial: CreateOrUpdateMaterial) => {
      queryClient.setQueryData(['materials'], (prevMaterials: any) =>
        prevMaterials?.map((prevMaterial: Material) =>
          prevMaterial.id === newMaterial.id ? { prevMaterial, ...newMaterial } : prevMaterial,
        ),
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['materials'] }),
  })
}

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
  const [sorting, setSorting] = useSortingWithSearchParams()
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const updateMaterial = useUpdateMaterial()

  const columns = useMemo<MRT_ColumnDef<Material>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          //remove any previous validation errors when user focuses on the input
          onFocus: () => setValidationErrors({ ...validationErrors, name: undefined }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      // {
      //   accessorKey: 'id',
      //   header: 'id',
      //   muiTableHeadCellProps: { style: { color: 'green' } },
      //   enableHiding: true,
      //   enableEditing: false,
      // },
      // {
      //   accessorKey: 'materialGroupId',
      //   header: 'materialGroupId',
      //   muiTableHeadCellProps: { style: { color: 'green' } },
      //   enableHiding: true,
      //   enableEditing: false,
      // },
      {
        header: 'kg/m',
        accessorKey: 'kgPerMeter',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        muiEditTextFieldProps: {
          required: true,
          type: 'number',
          error: !!validationErrors?.kgPerMeter,
          helperText: validationErrors?.kgPerMeter,
          //remove any previous validation errors when user focuses on the input
          onFocus: () => setValidationErrors({ ...validationErrors, kgPerMeter: undefined }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        header: 'Fr./m',
        accessorKey: 'centsPerMeter',
        // accessorFn: (row) => `${row.centsPerMeter ? row.centsPerMeter / 100 : '-'}`,

        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        muiEditTextFieldProps: {
          required: true,
          type: 'number',
          error: !!validationErrors?.pricePerMeter,
          helperText: validationErrors?.pricePerMeter,
          //remove any previous validation errors when user focuses on the input
          onFocus: () => setValidationErrors({ ...validationErrors, pricePerMeter: undefined }),
          //optionally add validation checking for onBlur or onChange
        },
        // Cell: ({ cell }) => <Box component="span">{toFixedNumber(cell.getValue<number>())}</Box>,
        // Edit: ({ cell }) => <Box component="span">{toFixedNumber(cell.getValue<number>())}</Box>,
      },
      {
        header: 'Fr./kg',
        accessorKey: 'centsPerKg',
        // accessorFn: (row) => `${row.centsPerKg ? row.centsPerKg / 100 : '-'}`,
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        muiEditTextFieldProps: {
          required: true,
          type: 'number',
          error: !!validationErrors?.pricePerKg,
          helperText: validationErrors?.pricePerKg,
          //remove any previous validation errors when user focuses on the input
          onFocus: () => setValidationErrors({ ...validationErrors, pricePerKg: undefined }),
          //optionally add validation checking for onBlur or onChange
        },
        Cell: ({ cell }) => <Box component="span">{toFixedNumber(cell.getValue<number>())}</Box>,
        // Edit: ({ cell }) => <Box component="span">{toFixedNumber(cell.getValue<number>())}</Box>,
      },
      {
        header: 'Länge Einheit',
        accessorKey: 'length',
        muiTableHeadCellProps: { style: { color: 'green' } },
        enableHiding: false,
        muiEditTextFieldProps: {
          required: true,
          type: 'number',
          error: !!validationErrors?.length,
          helperText: validationErrors?.length,
          //remove any previous validation errors when user focuses on the input
          onFocus: () => setValidationErrors({ ...validationErrors, length: undefined }),
          //optionally add validation checking for onBlur or onChange
        },
      },
    ],
    [validationErrors],
  )

  const handleSaveMaterial: MRT_TableOptions<Material>['onEditingRowSave'] = async ({
    values,
    row,
    table,
  }) => {
    console.log('handleSaveMaterial', { values, row })
    zodParse(zodCreateOrUpdateMaterial, values)
    const toUpdate = { ...row.original, ...zodParse(zodCreateOrUpdateMaterial, values) }
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors)
    //   return
    // }
    setValidationErrors({})
    await updateMaterial.mutate(toUpdate)
    table.setEditingRow(null) //exit editing mode
  }

  registerClearSelectionCallback(() => setRowSelection({}))

  const table = useMaterialReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: false, //enable some features
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

    positionActionsColumn: 'last',
    displayColumnDefOptions: { 'mrt-row-actions': { size: 150 } },

    muiTableContainerProps: {
      // TODO: find a better way to set the height
      sx: { height: 'calc(100vh - 375px)' },
    },

    createDisplayMode: 'row', //default ('row', and 'custom' are also available)
    editDisplayMode: 'row', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    // onCreatingRowCancel: () => setValidationErrors({}),
    // onCreatingRowSave: handleSaveMaterial,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveMaterial,

    onSortingChange: setSorting,

    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      density: 'compact',
      rowSelection,
      globalFilter,
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

const zodCreateOrUpdateMaterial = z.object({
  name: z.string(),
  kgPerMeter: z.number().default(0).or(z.string().default('0').transform(Number)),
  pricePerMeter: z
    .number()
    .optional()
    .or(
      z
        .string()
        .default('0')
        .transform((value) => (value ? Number.parseFloat(value) : undefined)),
    ),
  pricePerKg: z
    .number()
    .optional()
    .or(
      z
        .string()
        .default('0')
        .transform((value) => (value ? Number.parseFloat(value) : undefined)),
    ),
  length: z.number().default(0).or(z.string().default('0').transform(Number)),
})

function toFixedNumber(value: number) {
  return value ? (value / 100).toFixed(2) : '-'
}
