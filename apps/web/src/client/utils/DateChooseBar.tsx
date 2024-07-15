import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import TodayIcon from '@mui/icons-material/Today'
import { Box, IconButton, Typography } from '@mui/material'
import { addDays, subDays } from 'date-fns'

interface DateChooseBarProps {
  date: Date
  onChangeDate: (date: Date) => void
}

export function DateChooseBar({ date, onChangeDate }: DateChooseBarProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <IconButton onClick={() => onChangeDate(subDays(date, 1))}>
        <ArrowBackIosIcon />
      </IconButton>

      <IconButton aria-label="today" onClick={() => onChangeDate(new Date())}>
        <TodayIcon />
      </IconButton>

      <IconButton onClick={() => onChangeDate(addDays(date, 1))}>
        <ArrowForwardIosIcon />
      </IconButton>

      <Typography sx={{ ml: 2, mt: 1 }} component="div" noWrap>
        {date.toLocaleDateString()}
      </Typography>
    </Box>
  )
}
