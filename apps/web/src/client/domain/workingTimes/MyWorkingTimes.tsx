import { useRouter } from '@/client/router/useRouter'
import {
  IconButton,
  Box,
  Grid2,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Button,
} from '@mui/material'
import { Add, AccessTime, Save, Edit, Delete } from '@mui/icons-material'
import { PageContainerToolbar, PageContainer } from '@toolpad/core'
import { useSpecialDaysQuery } from '@/client/domain/workingTimes/useSpecialDaysQuery'
import { addDays, format, isSameDay, parseISO, previousMonday, subDays } from 'date-fns'
import { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { range } from 'lodash'
import { useMyWorkTimeQuery } from '@/client/domain/workingTimes/useMyWorkTimeQuery'
import {
  CreateOrUpdateWorkingTimeEntry,
  type WorkingTimeEntry,
  workType,
} from '@/common/models/workingTime'
import { useOpenTaskQuery } from '@/client/domain/tasks/useTaskQuery'
import { useProjectsQuery } from '@/client/domain/projects/useProjectsQuery'
import { CreateOrUpdateWorkingTimeEntryDialog } from '@/client/domain/workingTimes/CreateOrUpdateWorkingTimeDialog'
import { useDialogWithData } from '@/client/utils/useDialogWithData'
import { IsoDateString } from '@easy-kmu/common'
import { workingTimeEntry } from '@/server/db/schema'

export function MyWorkingTimes() {
  return (
    <PageContainer slots={{ toolbar: MyWorkingTimesToolbar }}>
      <MyWorkingTimesInner />
    </PageContainer>
  )
}

function MyWorkingTimesToolbar() {
  const { navigateToAddProjects } = useRouter()

  return (
    <PageContainerToolbar>
      <IconButton color="primary" onClick={navigateToAddProjects}>
        <Add />
      </IconButton>
    </PageContainerToolbar>
  )
}

function MyWorkingTimesInner() {
  const [from, setFrom] = useState<Date>(previousMonday(new Date()))
  const [to, setTo] = useState<Date>(addDays(from, 7))
  const specialDays = useSpecialDaysQuery(from, to)
  const myWorkingTimes = useMyWorkTimeQuery(from, to)
  const tasks = useOpenTaskQuery()
  const projects = useProjectsQuery()

  if (specialDays.isLoading) return <Typography>Loading...</Typography>
  if (myWorkingTimes.isLoading) return <Typography>Loading...</Typography>
  if (tasks.isLoading) return <Typography>Loading...</Typography>
  if (projects.isLoading) return <Typography>Loading...</Typography>
  if (specialDays.isError) return <Typography>Error: {specialDays.error.message}</Typography>
  if (myWorkingTimes.isError) return <Typography>Error: {myWorkingTimes.error.message}</Typography>
  if (tasks.isError) return <Typography>Error: {tasks.error.message}</Typography>
  if (projects.isError) return <Typography>Error: {projects.error.message}</Typography>

  return (
    <>
      <DatePicker
        label="Basic date picker"
        value={from}
        onChange={(value) => setFrom(previousMonday(value || new Date()))}
      />
      <Grid2 container spacing={2} justifyContent="center">
        {range(0, 7).map((index) => {
          const day = addDays(from, index)
          return (
            <Grid2 key={index} size={{ xs: 12, lg: 6 }}>
              <Day
                day={day}
                workingTimes={myWorkingTimes.data?.filter((w) => isSameDay(day, parseISO(w.day))) ?? []}
              />
            </Grid2>
          )
        })}
      </Grid2>
    </>
  )
}

function Day({ day, workingTimes }: { day: Date; workingTimes: WorkingTimeEntry[] }) {
  const dialog = useDialogWithData<CreateOrUpdateWorkingTimeEntry | undefined>()
  return (
    <Card>
      <CreateOrUpdateWorkingTimeEntryDialog dialog={dialog} />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant="h3">{format(day, 'iiii')}</Typography>
          <Typography variant="subtitle1">{format(day, 'P')}</Typography>
          <Typography variant="body1">6h 30m</Typography>
        </Box>
        <LinearProgress variant="determinate" value={66} />
        <Box
          sx={{ mt: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              dialog.open({
                day: IsoDateString(day),
                workType: 'task',
                workingTimeInMin: 0,
                comment: '',
              })
            }
          >
            Neue Arbeitszeit erfassen
          </Button>
          {/*
          <Box>
            <IconButton>
              <Save />
            </IconButton>
          </Box> */}
        </Box>
        <Divider sx={{ my: 2 }} />
        {workingTimes.map((value) => (
          <Box
            key={value.id}
            sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2">Projekt XY - Aufgabe 1</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <Typography variant="body1">{value.workingTimeInMin}</Typography>
                <Typography variant="body1">{value.workType}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              {/* <IconButton>
              <Edit />
            </IconButton> */}
              <IconButton>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ))}

        {/* <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
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
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
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
      </CardContent>
    </Card>
  )
}

function WorkingTime(workingTime: WorkingTimeEntry) {}

function NewWorkingTime(props: { workingTime: WorkingTimeEntry }) {}
