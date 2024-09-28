import type { CreateOrUpdateTask } from '@/common/models/task'

export function emptyTask(): CreateOrUpdateTask {
  return {
    projectId: '',
    name: 'Ausführung',
    description: '',
    notes: '',
  }
}
