import type { Contact } from '@/common/models/contact'
import type { Project } from '@/common/models/project'
import type { ProjectObject } from '@/common/models/projectObject'
import type { Task } from '@/common/models/task'
import type { HtmlToPdf } from '@easy-kmu/common'
import { readFile } from 'node:fs/promises'
import { renderToStaticMarkup } from 'react-dom/server'

export async function taskToHtml(project: Project, task: Task): Promise<HtmlToPdf> {
  // const currentPreparedInvoice = await preparedQuote(quote, project)
  const html = renderToStaticMarkup(await taskTemplate(project, task))
  const doc = `<!doctype html>${html}`
  const css = await readFile('src/server/templates/task.css', 'utf-8')
  // const signature = await readFile('src/server/templates/signature.jpg', 'binary')

  return {
    entryFilePath: 'index.html',
    files: [
      { path: 'index.html', content: doc, contentType: 'text' },
      { path: 'task.css', content: css, contentType: 'text' },
    ],
  }
}

function taskTemplate(project: Project, task: Task) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <link href="task.css" media="print" rel="stylesheet" />
        <link href="task.css" rel="stylesheet" />
        <link href="common/roboto/400.css" rel="stylesheet" />
        <link href="common/roboto-slab/300.css" rel="stylesheet" />
        <script src="paged.polyfill.js" />

        <title>Auftragskarte</title>
        <meta name="description" content="Auftragskarte Stoop Metallbau" />
      </head>

      <body>
        <section id="task">
          <div className="border section-margin">
            <div className="title center">Stoop Metallbau</div>
            <div className="subtitle center">
              Huebwisstrasse 11 - 8117 Fällanden - Tel 044 826 00 44 - Fax 044 826 06 44
            </div>
            <div className="subtitle center">
              E-Mail: stoop@stoopmetallbau.ch Homepage: www.stoopmetallbau.ch
            </div>
          </div>

          <div className="section section-margin border task">
            <div>Auftragskarte: </div>
            <div>
              {project.projectNumber} - {task.name}
            </div>
          </div>

          <div className="section section-margin border project-manager">
            <div>Zuständiger Projektleiter von STOOP METALLBAU AG: </div>
            <div>
              {project.projectManager.firstName} {project.projectManager.lastName}
            </div>
          </div>

          <div className="border section-margin">
            <ContactSection label="Auftraggeber" contact={project.customer} />
            <ObjectSection obj={project.object} />
            <ContactSection label="Bauleiter" contact={project.constructionManagement} />
            <ContactSection label="Architekt" contact={project.architect} />
            <ContactSection label="Bauherr" contact={project.builder} />
          </div>

          <SectionWithBorder label="Auftrag" text={`${project.name} - ${project.description}`} />
          <SectionWithBorder label="Material" text={project.material} />
          <SectionWithBorder label="Montage" text={project.assembly} />
          <SectionWithBorder label="Oberfläche" text={project.surface} />
          <SectionWithBorder label="Brandschutz" text={project.fireProtectionOption} />
          <SectionWithBorder label="EN-1090" text={project.en1090Option} />
          <SectionWithBorder label="Termin" text="" />
          <SectionWithBorder label="Bemerkungen" text="" classes={['notes']} />
        </section>
      </body>
    </html>
  )
}

function ContactSection(props: { label: string; contact: Contact | undefined }) {
  const { label, contact } = props
  return (
    <div className="section">
      <div className="col3 font-bold">{label}</div>
      <div className="col6">
        {contact && (
          <div>
            <div>{contact.company} </div>
            <div>{contact.address} </div>
            <div>
              {contact.zipCode} {contact.city}
            </div>
          </div>
        )}
      </div>
      <div className="col3 font-bold">Kontakt:</div>
      <div className="col6">
        {contact && (
          <div>
            <div>{contact.company} </div>
            <div>{contact.address} </div>
            <div>
              {contact.zipCode} {contact.city}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ObjectSection(props: { obj: ProjectObject | undefined }) {
  const { obj } = props
  return (
    <div className="section">
      <div className="col3 font-bold">Objektadresse:</div>
      <div className="col6">
        {obj && (
          <div>
            <div>{obj.appartement} </div>
            <div>{obj.address} </div>
            <div>
              {obj.zipCode} {obj.city}
            </div>
          </div>
        )}
      </div>
      <div className="col3 font-bold">Kontakt:</div>
      <div className="col6">
        {obj && (
          <div>
            <div>{obj.appartement} </div>
            <div>{obj.address} </div>
            <div>
              {obj.zipCode} {obj.city}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionWithBorder(props: { label: string; text: string | undefined; classes?: string[] }) {
  const { label, text, classes } = props
  return (
    <div className={`section section-margin border ${classes?.join(' ')}`}>
      <div className="col3">{label}</div>
      <div className="col15"> {text} </div>
    </div>
  )
}
