const id = 'noam-glass-redesign'
if (!document.getElementById(id)) {
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = './src/glass-overrides.css?v=glass-3d-v2'
  document.head.appendChild(link)
}
export { default } from './chat-2.js'
