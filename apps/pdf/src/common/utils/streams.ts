import { Readable } from 'stream'

export function readIntoBuffer(readable: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    readable.on('data', (chunk) => chunks.push(chunk))
    readable.on('end', () => resolve(Buffer.concat(chunks)))
    readable.on('error', (err) => reject(err))
  })
}
