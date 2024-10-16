import { apiClient } from '@/client/api/client'
import type { UseDialogWithData } from '@/client/utils/useDialogWithData'
import { type CreateOrUpdateWorkingTimeEntry, workType, zodWorkType } from '@/common/models/workingTime'
import { IsoDateString, zodParse } from '@easy-kmu/common'
import { AccessTime } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

export function CreateOrUpdateWorkingTimeEntryDialog({
  dialog,
}: { dialog: UseDialogWithData<CreateOrUpdateWorkingTimeEntry | undefined> }) {
  const [workingTime, setWorkingTime] = useState<CreateOrUpdateWorkingTimeEntry>(
    dialog.data ?? {
      day: IsoDateString(new Date()),
      workType: 'task',
      workingTimeInMin: 0,
      comment: '',
    },
  )

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (body: CreateOrUpdateWorkingTimeEntry) => {
      return apiClient.createOrUpdateMyWorkTime({ body })
    },
    onSuccess: () => {
      handleClose()
      queryClient.invalidateQueries({ queryKey: ['myWorkTime'] })
    },
  })

  const handleClose = () => {
    dialog.close()
  }

  const save = async () => void mutation.mutate(workingTime)

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
      }}
    >
      <DialogTitle>{dialogTitle(workingTime)}</DialogTitle>
      <DialogContent>
        <TextField
          label="Arbeitszeit"
          type="text"
          value={workingTime.workingTimeInMin}
          onChange={(event) =>
            setWorkingTime({ ...workingTime, workingTimeInMin: Number(event.target.value) })
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTime />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label1">Art</InputLabel>
          <Select
            labelId="demo-simple-select-label1"
            id="demo-simple-select"
            value={workingTime.workType}
            onChange={(event) =>
              setWorkingTime({ ...workingTime, workType: zodParse(zodWorkType, event.target.value) })
            }
            label="Art"
            // onChange={handleChange}
          >
            {workType.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Aufgabe</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={1}
            label="Age"
            // onChange={handleChange}
          >
            <MenuItem value={1}>Aufgabe</MenuItem>
            <MenuItem value={2}>Ferien</MenuItem>
            <MenuItem value={3}>Krankheit</MenuItem>
          </Select>
        </FormControl> */}
        <TextField
          label="Kommentar"
          type="text"
          value={workingTime.comment}
          onChange={(event) => setWorkingTime({ ...workingTime, comment: event.target.value })}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTime />
                </InputAdornment>
              ),
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={save}>{buttonOkText(workingTime)}</Button>
      </DialogActions>
    </Dialog>
  )
}

function dialogTitle({ id }: { id?: string }) {
  if (id) return 'Arbeitszeit bearbeiten'
  return 'Neue Arbeitszeit erfassen'
}

function buttonOkText({ id }: { id?: string }) {
  if (id) return 'Aktualisieren'
  return 'Hinzufügen'
}
