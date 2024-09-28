import { apiClient } from '@/client/api/client'
import { CreateOrUpdateTasksDialog } from '@/client/domain/tasks/CreateOrUpdateTasksDialog'
import { useTaskQuery } from '@/client/domain/tasks/useTaskQuery'
import { useDialogWithData } from '@/client/utils/useDialogWithData'
import type { CreateOrUpdateTask, Task } from '@/common/models/task'
import { Add, Delete, Edit, PictureAsPdf } from '@mui/icons-material'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

export function Tasks() {
  const { projectId } = useParams()
  const dialog = useDialogWithData<CreateOrUpdateTask | { projectId: string }>()

  const query = useTaskQuery(projectId || '')
  const queryClient = useQueryClient()
  if (!projectId) throw new Error('projectId is undefined')
  if (query.isLoading) return <h1>Loading...</h1>
  if (query.error) return <h1>Error</h1>

  const tasks = query.data || []

  async function deleteTask(task: Task) {
    await apiClient.deleteTask({ params: { taskId: task.id } })
    queryClient.invalidateQueries(['tasks', task.projectId])
  }

  async function downloadTaskCard(task: Task) {}

  return (
    <Box>
      {/* <Typography variant="h4">Angebote</Typography> */}

      <Box sx={{ display: 'flex', justifyContent: 'end', my: 2 }}>
        <IconButton onClick={() => dialog.open({ projectId })}>
          <Add />
        </IconButton>
      </Box>
      {dialog.isOpen && <CreateOrUpdateTasksDialog dialog={dialog} />}
      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid key={task.id} size={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h5">{task.name}</Typography>
                    <Typography variant="body1">{task.description}</Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Tooltip title="Task bearbeiten">
                  <IconButton onClick={() => dialog.open(task)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Auftragskarte">
                  <IconButton onClick={() => downloadTaskCard(task)}>
                    <PictureAsPdf />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Task löschen">
                  <IconButton onClick={() => deleteTask(task)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
