import { readFileSync } from 'fs'
import puppeteer from 'puppeteer'
;(async () => {
  console.log(puppeteer.defaultArgs)

  // Start the browser
  const browser = await puppeteer.launch()

  // Open a new blank page
  const page = await browser.newPage()

  // Set screen size
  await page.setViewport({ width: 1920, height: 1080 })

  // Navigate the page to a URL and wait for everything to load
  // await page.goto('http://127.0.0.1:5501/invoice2/invoice.html', { waitUntil: 'networkidle0' })

  const htmlContent = readFileSync(
    '/home/felix/dev/weasyprint-samples/invoice2/invoice-full.html',
    'utf-8',
  )
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

  // Use screen CSS instead of print
  await page.emulateMediaType('screen')

  // Render the PDF
  const pdf = await page.pdf({
    path: 'render.pdf', // Output the result in a local file
    printBackground: true,
    format: 'A4',
  })

  console.log('pdf', pdf.byteLength)

  // Close the browser
  await browser.close()
})()
