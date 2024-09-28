import { apiClient } from '@/client/api/client'
import { emptyTask } from '@/client/domain/tasks/emptyTask'
import { useTaskStore } from '@/client/domain/tasks/useTaskStore'
import type { UseDialogWithData } from '@/client/utils/useDialogWithData'
import type { CreateOrUpdateTask } from '@/common/models/task'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useMutation, useQueryClient } from 'react-query'
import { useEffectOnce } from 'react-use'

export function CreateOrUpdateTasksDialog({
  dialog,
}: { dialog: UseDialogWithData<CreateOrUpdateTask | { projectId: string }> }) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (newTask: CreateOrUpdateTask) => {
      return apiClient.createOrUpdateTask({ body: newTask })
    },
    onSuccess: () => {
      handleClose()
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const { task, setName, setDescription, setNotes, setInitialTask, clear } = useTaskStore()
  useEffectOnce(() => {
    if (dialog.data) setInitialTask({ ...emptyTask(), ...dialog.data })
    else clear()
  })

  const handleClose = () => {
    dialog.close()
  }

  const save = async () => void mutation.mutate(task)

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
      }}
    >
      <DialogTitle>{dialogTitle(task)}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={task.name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            margin="dense"
            label="Beschreibung"
            type="text"
            fullWidth
            variant="standard"
            value={task.description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <TextField
            margin="dense"
            label="Notizen"
            type="text"
            fullWidth
            variant="standard"
            value={task.notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={save}>{buttonOkText(task)}</Button>
      </DialogActions>
    </Dialog>
  )
}

function dialogTitle({ id }: { id?: string }) {
  if (id) return 'Kontakt bearbeiten'
  return 'Neuer Kontakt'
}

function buttonOkText({ id }: { id?: string }) {
  if (id) return 'Aktualisieren'
  return 'Hinzufügen'
}
