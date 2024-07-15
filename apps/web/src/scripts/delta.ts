import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

// TypeScript / ES6:
// import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

async function main() {
  const deltaOps = [{ insert: 'Hello\n' }, { insert: 'This is colorful', attributes: { color: '#f00' } }]

  const cfg = {}

  const converter = new QuillDeltaToHtmlConverter(deltaOps, cfg)

  const html = converter.convert()
  console.log(html)
}

main().catch(console.error)
