import { z } from 'zod'

export const htmlToPdfSchema = z.object({
  entryFilePath: z.string(),
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
      contentType: z.enum(['text', 'binary']),
    }),
  ),
})

export type HtmlToPdf = z.infer<typeof htmlToPdfSchema>
