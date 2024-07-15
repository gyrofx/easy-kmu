import { Popover, Box } from '@mui/material'
import { useState } from 'react'
import { CirclePicker } from 'react-color'

export function ColorPickerPopover({
  anchor,
  onChange,
  handleClose,
}: {
  anchor: Element
  onChange: (color: string) => void
  handleClose: () => void
}) {
  const [color] = useState('#000000')

  return (
    <Popover
      open={true}
      onClose={handleClose}
      anchorEl={anchor}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
    >
      <Box sx={{ m: 2 }}>
        <CirclePicker
          color={color}
          onChangeComplete={({ hex }, event) => {
            event.stopPropagation()
            onChange(hex)
            handleClose()
          }}
        />
      </Box>
    </Popover>
  )
}
