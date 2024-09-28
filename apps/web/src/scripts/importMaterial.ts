import { initOpts } from '@/server/config/opts'
import { initDatabase } from '@/server/db/db'
import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'
import { groupBy } from 'lodash'
import { createOrUpdateMaterialGroup } from '@/server/models/material/createOrUpdateMaterialGroup'
import { deleteAllMaterialGroups } from '@/server/models/material/deleteAllMaterialGroups'
import { deleteAllMaterials } from '@/server/models/material/deleteAllMaterials'
import { createOrUpdateMaterial } from '@/server/models/material/createOrUpdateMaterial'
import type { MaterialGroup } from '@/common/models/material'

async function main() {
  initOpts()
  await initDatabase()
  await readMaterial()
}

main().catch(console.error)

async function readMaterial() {
  // const materialCsv = await readFile('./src/scripts/material.csv', 'utf-8')
  const parsed = (await parseCsv('./src/scripts/material.csv')).map((record) => {
    const [group, name, kgPerMeter, centsPerMeter, centsPerKg, length] = record
    return {
      group: removeQuotes(group.trim()),
      name: removeQuotes(name.trim()),
      kgPerMeter: Number.parseFloat(kgPerMeter),
      centsPerMeter: Math.floor(Number.parseFloat(centsPerMeter) * 100) || undefined,
      centsPerKg: Math.floor(Number.parseFloat(centsPerKg) * 100) || undefined,
      length: Number.parseFloat(length),
    }
  })

  await deleteAllMaterials()
  await deleteAllMaterialGroups()
  const groups = groupBy(parsed, (item) => item.group)

  console.log(groups)
  const dbGroups = []
  for (const group of Object.keys(groups)) {
    dbGroups.push(await createOrUpdateMaterialGroup({ name: group, image: '' }))
  }

  const groupByName = groupBy(dbGroups, (group) => group.name)

  for (const material of parsed) {
    const { group, ...rest } = material
    await createOrUpdateMaterial({
      materialGroupId: groupIdFromName(group, groupByName),
      ...rest,
    })
  }

  console.log(dbGroups)
}

function groupIdFromName(name: string, groupByName: Record<string, MaterialGroup[]>) {
  const id = groupByName[name]?.[0]?.id
  if (!id) throw new Error('group not found')
  return id
}

function removeQuotes(str: string) {
  if (str.at(0) === '"' && str.at(-1) === '"') {
    return str.slice(1, -1)
  }
  return str
}

function parseCsv(path: string): Promise<MaterialCsvRecord[]> {
  return new Promise((resolve, reject) => {
    const csvData: MaterialCsvRecord[] = []
    createReadStream(path)
      .pipe(parse({ delimiter: ',', relax_quotes: true }))
      .on('data', (csvrow) => {
        csvData.push(csvrow)
      })
      .on('end', () => {
        resolve(csvData)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

type MaterialCsvRecord = [string, string, string, string, string, string]
