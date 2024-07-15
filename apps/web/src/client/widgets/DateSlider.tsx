import CloseIcon from '@mui/icons-material/Close'
import { Button, Slider, Stack } from '@mui/material'
import { isLength } from '@/client/utils/array'
import { removeTime } from '@/client/utils/date'
import { addDays, intervalToDuration } from 'date-fns'
import { isArray } from 'lodash'
import { useState } from 'react'

export interface DateSliderProps {
  range: [Date, Date]
  onChange: (range: [Date, Date]) => void
}

export function DateSlider({ range, onChange }: DateSliderProps) {
  const normalizedFromDate = removeTime(range[0])
  const normalizedToDate = removeTime(range[1])
  const [min, max] = dayRange(normalizedFromDate, normalizedToDate)
  const [value, setValue] = useState<number[]>([min, max])

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (!isArrayOfTwo(newValue)) return
    setValue(newValue)
    const rangeFrom = addDays(normalizedFromDate, newValue[0])
    const rangeTo = addDays(normalizedFromDate, newValue[1])
    onChange([rangeFrom, rangeTo])
  }

  const handleReset = () => {
    setValue([min, max])
    handleChange({} as Event, [min, max])
  }

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="off"
        max={max}
        min={min}
        marks={true}
      />
      <Button variant="outlined" startIcon={<CloseIcon />} onClick={handleReset}>
        Reset
      </Button>
    </Stack>
  )
}

function isArrayOfTwo(value: number | number[]): value is [number, number] {
  return isArray(value) && isLength(value, 2)
}

function dayRange(fromDate: Date, toDate: Date): [number, number] {
  const days = intervalToDuration({ start: fromDate, end: toDate }).days || 0
  return [0, days]
}
