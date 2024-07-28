import { copyDirectory } from '@/server/pdf/createInvoice'
import type { HtmlToPdf } from '@easy-kmu/common'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

export async function htmlToPdf(body: HtmlToPdf) {
  if (existsSync('/tmp/templates')) {
    await rm('/tmp/templates', { recursive: true })
  }

  await mkdir('/tmp/templates/common', { recursive: true })
  await copyDirectory('./templates/common', '/tmp/templates/common')

  await Promise.all(
    body.files.map(async (file) => {
      const content = file.contentType === 'binary' ? Buffer.from(file.content, 'base64') : file.content
      await writeFile(`/tmp/templates/${file.path}`, content)
      // await writeFile(Buffer.from(file.base64, 'base64').toString('ascii'), `/tmp/templates/${file.path}`)
    }),
  )

  execSync(
    `node ./node_modules/.bin/pagedjs-cli --browserArgs "--no-sandbox" /tmp/templates/${body.entryFilePath} -o /tmp/index.pdf`,
  )

  return resolve('/tmp/index.pdf')
}
