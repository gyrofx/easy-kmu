import { findFirstProject } from '@/server/models/project/db/findFirstProject'
import { Agent } from 'undici'
import { opts } from '@/server/config/opts'
import { logger } from '@/server/logging/logger'
import { taskToHtml } from '@/server/models/task/taskToHtml'
import { findTaskByIdInDb } from './db/findTaskByIdInDb'
import { createOrUpdateTaskCardFile } from '@/server/models/task/createOrUpdateTaskCardFile'

export async function generateTaskCardPdf(taskId: string) {
  const task = await findTaskByIdInDb(taskId)
  if (!task) throw new Error('Task not found')
  const project = await findFirstProject(task.projectId)
  if (!project) throw new Error('Project not found')

  const htmltoPdf = await taskToHtml(project, task)

  const httpsAgent = new Agent({ connect: { rejectUnauthorized: false } })

  const url = `${opts().pdfService.url}/api/html-to-pdf`
  const responose = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(htmltoPdf),
    headers: {
      'Content-Type': 'application/json',
    },
    dispatcher: httpsAgent,
  } as any)

  if (responose.status !== 200) {
    logger().error('failed to genereate quote pdf', await responose.json())
  }

  const blob = await responose.blob()
  return createOrUpdateTaskCardFile(task, blob)
}
