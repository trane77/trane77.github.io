// =============================================================
//  Federico Ricchiuto — Resume (redesign, one page, A4)
//  typst compile --font-path cv/fonts cv/cv.typ public/Federico_Ricchiuto_Resume.pdf
//  Content lives in cv.json (shared with the website CV page).
// =============================================================

// ---------- 1. PALETTE E MISURE ----------
#let sans        = "Source Sans 3"
#let ink         = rgb("#1a1a1a")   // colore 1: corpo del testo
#let accent      = rgb("#0b3a78")   // colore 2: etichette, ruoli, date
#let rule-c      = rgb("#0b3a78").lighten(72%)

#let rail = 62pt                    // colonna delle date
#let gap  = 14pt

// ---------- 2. PAGINA ----------
#set page(paper: "a4", margin: (x: 42pt, top: 36pt, bottom: 30pt))
#set text(font: sans, size: 9pt, weight: 350, fill: ink, lang: "en", region: "ca")
#set par(leading: 0.60em, spacing: 0.65em, justify: false)
#set list(
  marker: text(size: 5.5pt, fill: rgb("#3d3d3d"), baseline: -1.5pt)[■],
  indent: 2pt, body-indent: 6pt, spacing: 4pt,
)
#show link: set text(fill: ink)
#show list: set block(above: 4pt, below: 4pt)

// ---------- 3. COMPONENTI ----------

// Etichetta di sezione: testo + filetto che riempie la riga
#let section(title) = block(width: 100%, above: 13pt, below: 6pt)[
  #grid(
    columns: (auto, 1fr), column-gutter: 9pt, align: horizon,
    text(size: 8.3pt, weight: 700, fill: accent, tracking: 0.14em)[#upper(title)],
    line(length: 100%, stroke: 0.7pt + rule-c),
  )
]

// Riga con data nella colonna di sinistra
#let row(date, body) = block(width: 100%, above: 8pt, below: 0pt, breakable: false)[
  #grid(
    columns: (rail, 1fr), column-gutter: gap,
    align: (right + top, left + top),
    text(size: 8.6pt, weight: 400, fill: ink)[#date],
    body,
  )
]

// Riga rientrata: incarico svolto dentro l'attivita' freelance
#let subrow(date, body) = row(date, block(
  width: 100%,
  inset: (left: 14pt),
  stroke: (left: 0.9pt + rule-c),
)[#body])

// Datore di lavoro
#let company(name, place) = block(below: 1pt)[
  #text(size: 11.5pt, weight: 700)[#name]
  #h(6pt)
  #text(size: 9pt, weight: 400, fill: ink)[#place]
]

// Ruolo
#let jobtitle(t) = block(above: 2pt, below: 4pt)[
  #text(size: 9.6pt, weight: 600, fill: ink)[#t]
]

// Incarico dentro l'attività freelance
#let sub(name) = block(above: 0pt, below: 3pt)[
  #text(size: 6pt, fill: rgb("#3d3d3d"), baseline: -1.5pt)[■]
  #h(4pt)
  #text(size: 9.3pt, weight: 700)[#name]
]

// Riga tecnologie
#let stack(body) = block(above: 4pt, below: 0pt)[
  #text(size: 8.5pt, fill: ink)[
    #text(weight: 600, fill: ink)[Stack] #h(3pt) #body
  ]
]

// Cella della griglia competenze
#let skill(label, body) = block(below: 0pt)[
  #text(size: 8.2pt, weight: 700, fill: ink)[#upper(label)]
  #block(above: 3pt, below: 0pt)[#text(size: 8.8pt)[#body]]
]

#let cv = json("cv.json")
#let sep = [#h(7pt)#text(fill: rule-c)[|]#h(7pt)]

// ---------- 4. INTESTAZIONE ----------
#text(size: 27pt, weight: 700, tracking: -0.3pt)[#cv.name]
#v(3pt)
#text(size: 9.5pt, weight: 600, fill: accent, tracking: 0.16em)[#upper(cv.title)]
#v(7pt)
#text(size: 9pt, fill: ink)[
  #cv.location#sep#cv.contacts.map(c => link(c.url)[#c.label]).join(sep)
]
#v(7pt)
#line(length: 100%, stroke: 1.4pt + accent)
#v(9pt)

// ---------- 5. PROFILO ----------
#text(size: 9.4pt)[#cv.summary #text(weight: 600)[#cv.highlight]]

// ---------- 6. COMPETENZE ----------
#section("Technical Skills")
#grid(
  columns: (1fr, 1fr, 1fr),
  column-gutter: 20pt,
  row-gutter: 8pt,
  ..cv.skills.pairs().map(((label, items)) => skill(label)[#items.join(" / ")]),
)

// ---------- 7. ESPERIENZA ----------
#section("Experience")

#for job in cv.experience [
  #row(job.period)[
    #company(job.org, job.place)
    #jobtitle(job.role)
    #job.summary
    #if "points" in job { list(..job.points) }
    #if "stack" in job { stack(job.stack) }
  ]
  #for c in job.at("clients", default: ()) [
    #subrow(c.period)[
      #sub(c.name)
      #c.text
      #if "stack" in c { stack(c.stack) }
    ]
  ]
  #if "clients" in job { v(4pt) }
]

// ---------- 8. PIEDE: ISTRUZIONE, LINGUE, INTERESSI ----------
#v(10pt)
#grid(
  columns: (1.25fr, 1fr, 1fr),
  column-gutter: 20pt,
  [
    #section("Education")
    #text(weight: 600)[#cv.education.title] — #cv.education.field \
    #cv.education.details
  ],
  [
    #section("Languages")
    #cv.languages.map(l => [#text(weight: 600)[#l.name] — #l.level]).join(linebreak())
  ],
  [
    #section("Interests")
    #cv.interests.join(" / ")
  ],
)
