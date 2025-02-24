import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

// const demoNote = defineNoteConfig({
//   dir: 'demo',
//   link: '/demo',
//   sidebar: ['', 'bar','foo'],
// })
const demoNote1 = defineNoteConfig({
  dir: 'sushy',
  link: '/sushy',
  sidebar: 'auto',
})
const demoNote2 = defineNoteConfig({
  dir: 'ham',
  link: '/ham/',
  sidebar: 'auto',
})


export const notes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [demoNote1,demoNote2],

})
