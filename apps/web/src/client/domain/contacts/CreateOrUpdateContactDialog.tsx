import { apiClient } from '@/client/api/client'
import { useContactStore } from '@/client/domain/contacts/useContactStore'
import type { UseDialogWithData } from '@/client/utils/useDialogWithData'
import type { CreateOrUpdateContact } from '@/common/models/contact'
import { Delete, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material'
import { useMutation, useQueryClient } from 'react-query'
import { useEffectOnce } from 'react-use'

export function AddContactDialog({
  dialog,
}: { dialog: UseDialogWithData<CreateOrUpdateContact | undefined> }) {
  const { contact, setInitialContact, setValue, clear } = useContactStore()

  useEffectOnce(() => {
    if (dialog.data) setInitialContact(dialog.data)
    else clear()
  })

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (newContact: CreateOrUpdateContact) => {
      return apiClient.createOrUpdateContact({ body: newContact })
    },
    onSuccess: () => {
      clear()
      handleClose()
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })

  const handleClose = () => {
    dialog.close()
  }

  const save = async () => void mutation.mutate(contact)

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
      }}
    >
      <DialogTitle>{dialogTitle(contact)}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Firma"
          type="text"
          fullWidth
          variant="standard"
          value={contact.company}
          onChange={(event) => setValue('company', event.target.value)}
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <TextField
            margin="dense"
            name="email"
            label="Vorname"
            type="text"
            fullWidth
            variant="standard"
            value={contact.firstName}
            onChange={(event) => setValue('firstName', event.target.value)}
          />
          <TextField
            margin="dense"
            name="email"
            label="Nachanme"
            type="text"
            fullWidth
            variant="standard"
            value={contact.lastName}
            onChange={(event) => setValue('lastName', event.target.value)}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <TextField
            margin="dense"
            label="Zusatz 1"
            type="text"
            fullWidth
            variant="standard"
            value={contact.additional1}
            onChange={(event) => setValue('additional1', event.target.value)}
          />
          <TextField
            margin="dense"
            label="Zusatz 2"
            type="text"
            fullWidth
            variant="standard"
            value={contact.additional2}
            onChange={(event) => setValue('additional2', event.target.value)}
          />
        </Box>
        <TextField
          required
          margin="dense"
          label="Adresse"
          type="text"
          fullWidth
          variant="standard"
          value={contact.address}
          onChange={(event) => setValue('address', event.target.value)}
        />
        <TextField
          margin="dense"
          label="Postfach"
          type="text"
          fullWidth
          variant="standard"
          value={contact.pobox}
          onChange={(event) => setValue('pobox', event.target.value)}
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <TextField
            sx={{ width: '30%' }}
            required
            margin="dense"
            name="email"
            label="PLZ"
            type="text"
            fullWidth
            variant="standard"
            value={contact.zipCode}
            onChange={(event) => setValue('zipCode', event.target.value)}
          />
          <TextField
            required
            margin="dense"
            name="email"
            label="Ort"
            type="text"
            fullWidth
            variant="standard"
            value={contact.city}
            onChange={(event) => setValue('city', event.target.value)}
          />
        </Box>
        <TextField
          margin="dense"
          label="Land"
          type="text"
          fullWidth
          variant="standard"
          value={contact.country}
          onChange={(event) => setValue('country', event.target.value)}
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <TextField
            margin="dense"
            label="Telefon 1"
            type="text"
            fullWidth
            variant="standard"
            value={contact.phone1}
            onChange={(event) => setValue('phone1', event.target.value)}
          />
          <TextField
            margin="dense"
            label="Telefon 2"
            type="text"
            fullWidth
            variant="standard"
            value={contact.phone2}
            onChange={(event) => setValue('phone2', event.target.value)}
          />
        </Box>
        <TextField
          margin="dense"
          label="E-Mail"
          type="text"
          fullWidth
          variant="standard"
          value={contact.email}
          onChange={(event) => setValue('email', event.target.value)}
        />
        <TextField
          margin="dense"
          label="Webseite"
          type="text"
          fullWidth
          variant="standard"
          value={contact.web}
          onChange={(event) => setValue('web', event.target.value)}
        />
        <TextField
          margin="dense"
          label="Notizen"
          type="text"
          fullWidth
          variant="standard"
          value={contact.notes}
          onChange={(event) => setValue('notes', event.target.value)}
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button onClick={save}>{buttonOkText(contact)}</Button>
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
