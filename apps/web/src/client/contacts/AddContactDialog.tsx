import { useState } from 'react'

import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Box,
} from '@mui/material'
import type { UseDialog } from '@/client/utils/useDialog'
import type { Contact } from '@/common/contact/contact'
import { persist } from 'zustand/middleware'
import { create } from 'zustand'
import { apiClient } from '@/client/api/client'

export function AddContactDialog({ dialog }: { dialog: UseDialog }) {
  const [open, setOpen] = useState(false)
  const {
    contact,
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

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    dialog.close()
  }

  const save = async () => {
    console.log('save', contact)
    await apiClient.createOrUpdateContact({ body: contact })
    clear()
    handleClose()
  }

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
      }}
    >
      <DialogTitle>Neuer Kontakt</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          // required
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
            required
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
            required
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
        <TextField
          // required
          margin="dense"
          label="Zusatz 1"
          type="text"
          fullWidth
          variant="standard"
          value={contact.additional1}
          onChange={(event) => setAdditional1(event.target.value)}
        />
        <TextField
          // required
          margin="dense"
          label="Zusatz 2"
          type="text"
          fullWidth
          variant="standard"
          value={contact.additional2}
          onChange={(event) => setAdditional2(event.target.value)}
        />
        <TextField
          // required
          margin="dense"
          label="Adresse"
          type="text"
          fullWidth
          variant="standard"
          value={contact.address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <TextField
          // required
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={save}>Subscribe</Button>
      </DialogActions>
    </Dialog>
  )
}

interface ContactState {
  contact: Contact
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
    address: '',
    zipCode: '',
    city: '',

    createdAt: '',
    updatedAt: '',
  }
}
