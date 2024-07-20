import { Dialog, Button, DialogTitle, DialogContent, DialogActions, TextField, Box } from '@mui/material'
import type { Contact } from '@/common/contact/contact'
import { persist } from 'zustand/middleware'
import { create } from 'zustand'
import { apiClient } from '@/client/api/client'
import { useEffect } from 'react'
import type { UseDialogWithData } from '@/client/utils/useDialogWithData'
import { useMutation, useQueryClient } from 'react-query'

export function AddContactDialog({ dialog }: { dialog: UseDialogWithData<Contact> }) {
  const {
    contact,
    setInitialContact,
    setAdditional1,
    setAdditional2,
    setAddress,
    setCity,
    setCompany,
    setFirtName,
    setLastName,
    setPoBox,
    setZipCode,
    clear,
  } = useContactStore()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (dialog.data) setInitialContact(dialog.data)
  }, [])

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (newContact: Contact) => {
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
          onChange={(event) => setCompany(event.target.value)}
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
            onChange={(event) => setFirtName(event.target.value)}
          />
          <TextField
            margin="dense"
            name="email"
            label="Nachanme"
            type="text"
            fullWidth
            variant="standard"
            value={contact.lastName}
            onChange={(event) => setLastName(event.target.value)}
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
            onChange={(event) => setAdditional1(event.target.value)}
          />
          <TextField
            margin="dense"
            label="Zusatz 2"
            type="text"
            fullWidth
            variant="standard"
            value={contact.additional2}
            onChange={(event) => setAdditional2(event.target.value)}
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
          onChange={(event) => setAddress(event.target.value)}
        />
        <TextField
          margin="dense"
          label="Postfach"
          type="text"
          fullWidth
          variant="standard"
          value={contact.pobox}
          onChange={(event) => setPoBox(event.target.value)}
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
            onChange={(event) => setZipCode(event.target.value)}
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
            onChange={(event) => setCity(event.target.value)}
          />
        </Box>
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

interface ContactState {
  contact: Contact
  setInitialContact: (contact: Contact) => void
  setCompany: (value: string) => void
  setFirtName: (value: string) => void
  setLastName: (value: string) => void
  setAdditional1: (value: string) => void
  setAdditional2: (value: string) => void
  setAddress: (value: string) => void
  setPoBox: (value: string) => void
  setZipCode: (value: string) => void
  setCity: (value: string) => void
  clear: () => void
}

const useContactStore = create(
  persist<ContactState>(
    (set) => ({
      contact: emptyContact(),
      setInitialContact: (contact: Contact) => set((state) => ({ ...state, contact })),
      setCompany: (company: string) =>
        set((state) => ({ ...state, contact: { ...state.contact, company } })),
      setFirtName: (firstName: string) =>
        set((state) => ({ ...state, contact: { ...state.contact, firstName } })),
      setLastName: (lastName: string) =>
        set((state) => ({ ...state, contact: { ...state.contact, lastName } })),
      setAdditional1: (additional1: string) =>
        set((state) => ({ ...state, contact: { ...state.contact, additional1 } })),
      setAdditional2: (additional2: string) =>
        set((state) => ({ ...state, contact: { ...state.contact, additional2 } })),
      setAddress: (address: string) =>
        set((state) => ({ ...state, contact: { ...state.contact, address } })),
      setPoBox: (pobox: string) => set((state) => ({ ...state, contact: { ...state.contact, pobox } })),
      setZipCode: (zipCode: string) =>
        set((state) => ({ ...state, contact: { ...state.contact, zipCode } })),
      setCity: (city: string) => set((state) => ({ ...state, contact: { ...state.contact, city } })),

      clear: () => set((state) => ({ ...state, contact: emptyContact() })),
    }),
    {
      name: 'new-contact-store',
      // storage: createJSONStorage(() => localStorage),
    },
  ),
)

function emptyContact(): Contact {
  return {
    firstName: '',
    lastName: '',
    additional1: '',
    additional2: '',
    address: '',
    zipCode: '',
    city: '',
    company: '',
    pobox: '',
    country: '',

    createdAt: '',
    updatedAt: '',
  }
}
