import heroPhoto from './src/assets-inline/noam-hero.js'
import bwPhoto from './src/assets-inline/noam-bw.js'
import peacePhoto from './src/assets-inline/noam-peace.js'
import altPhoto from './src/assets-inline/noam-alt.js'
import catOne from './src/assets-inline/chat-1.js'
import catTwo from './src/assets-inline/chat-2.js'
import pdfBase64 from './src/pdfData.js'

const photoMap = { hero: heroPhoto, bw: bwPhoto, peace: peacePhoto, alt: altPhoto, cat: catOne }
document.querySelectorAll('[data-photo]').forEach(img => { img.src = photoMap[img.dataset.photo] || '' })

try {
  const bytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0))
  const pdfUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
  document.querySelectorAll('[data-pdf-download]').forEach(link => {
    link.href = pdfUrl
    link.download = 'Noam-CV-amoureux.pdf'
  })
} catch (error) {
  console.warn('PDF download init failed', error)
}

(() => {
  const $ = (s, root = document) => root.querySelector(s)
  const $$ = (s, root = document) => [...root.querySelectorAll(s)]
  const root = document.documentElement
  const body = document.body

  const savedTheme = localStorage.getItem('noam-theme')
  const theme = savedTheme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  root.dataset.theme = theme
  const syncTheme = () => {
    const isDark = root.dataset.theme === 'dark'
    $$('.theme-toggle__thumb').forEach(el => {
      el.textContent = isDark ? '☾' : '☀'
      el.classList.toggle('theme-toggle__thumb--light', !isDark)
    })
    const label = $('[data-theme-label]')
    if (label) label.textContent = isDark ? 'Mode sombre' : 'Mode clair'
  }
  syncTheme()
  $$('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('noam-theme', root.dataset.theme)
    syncTheme()
  }))

  const intro = $('.intro')
  const site = $('.site-shell')
  const lines = $$('.intro__line')
  const progress = $('.intro__progress span')
  const progressText = $('[data-progress-text]')
  let introTimers = []
  const finishIntro = () => {
    if (!intro || intro.classList.contains('intro--leaving')) return
    intro.classList.add('intro--leaving')
    introTimers.forEach(clearTimeout)
    setTimeout(() => {
      intro.remove()
      site?.classList.add('site-shell--ready')
      setupReveal()
    }, 620)
  }
  if (sessionStorage.getItem('noam-intro-seen') === '1') {
    intro?.remove()
    site?.classList.add('site-shell--ready')
  } else if (intro) {
    lines.forEach(el => el.hidden = true)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      lines.forEach(el => el.hidden = false)
      if (progress) progress.style.width = '100%'
      if (progressText) progressText.textContent = 'READY'
      introTimers.push(setTimeout(finishIntro, 500))
    } else {
      lines.forEach((el, index) => {
        introTimers.push(setTimeout(() => {
          el.hidden = false
          const pct = Math.round(((index + 1) / lines.length) * 100)
          if (progress) progress.style.width = `${pct}%`
          if (progressText) progressText.textContent = pct === 100 ? 'READY' : `${pct}%`
        }, 500 + index * 520))
      })
      introTimers.push(setTimeout(finishIntro, 4100))
    }
    $('[data-skip-intro]')?.addEventListener('click', finishIntro)
    sessionStorage.setItem('noam-intro-seen', '1')
  }

  const navbar = $('.navbar')
  const onScroll = () => navbar?.classList.toggle('navbar--scrolled', scrollY > 16)
  addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.scroll
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    $('.mobile-nav')?.setAttribute('hidden', '')
  }))
  const mobile = $('.mobile-nav')
  $('[data-mobile-menu]')?.addEventListener('click', event => {
    if (!mobile) return
    const open = mobile.hasAttribute('hidden')
    mobile.toggleAttribute('hidden', !open)
    event.currentTarget.setAttribute('aria-expanded', String(open))
  })

  function setupReveal() {
    const nodes = $$('.reveal:not(.is-visible)')
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(n => n.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: .12, rootMargin: '0px 0px -30px 0px' })
    nodes.forEach(n => observer.observe(n))
  }
  if (!intro || sessionStorage.getItem('noam-intro-seen') === '1') setupReveal()

  const stats = $('#stats')
  if (stats) {
    const animateStats = () => $$('[data-percent]', stats).forEach((el, i) => setTimeout(() => { el.style.width = `${el.dataset.percent}%` }, i * 100))
    if ('IntersectionObserver' in window) {
      const ob = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) { animateStats(); ob.disconnect() }
      }, { threshold: .2 })
      ob.observe(stats)
    } else animateStats()
  }

  $$('.faq-item').forEach((item, index) => {
    const btn = $('button', item)
    const icon = $('i', btn)
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open')
      $$('.faq-item').forEach(other => {
        other.classList.remove('faq-item--open')
        const b = $('button', other); const ic = b ? $('i', b) : null
        b?.setAttribute('aria-expanded', 'false'); if (ic) ic.textContent = '+'
      })
      if (!isOpen) {
        item.classList.add('faq-item--open')
        btn.setAttribute('aria-expanded', 'true')
        if (icon) icon.textContent = '−'
      }
    })
    if (index === 0) { item.classList.add('faq-item--open'); btn?.setAttribute('aria-expanded', 'true'); if (icon) icon.textContent = '−' }
  })

  let toastTimer
  const toast = $('.toast-message')
  const showToast = message => {
    if (!toast) return
    toast.textContent = message
    toast.hidden = false
    toast.classList.add('toast-visible')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toast.classList.remove('toast-visible')
      setTimeout(() => { toast.hidden = true }, 220)
    }, 3800)
  }

  const shortlistBtn = $('[data-shortlist]')
  let shortlisted = localStorage.getItem('noam-shortlist') === '1'
  const syncShortlist = () => {
    if (!shortlistBtn) return
    shortlistBtn.classList.toggle('is-shortlisted', shortlisted)
    shortlistBtn.textContent = shortlisted ? 'Candidat en shortlist ✓' : 'Mettre le candidat en shortlist'
  }
  syncShortlist()
  shortlistBtn?.addEventListener('click', () => {
    shortlisted = !shortlisted
    localStorage.setItem('noam-shortlist', shortlisted ? '1' : '0')
    syncShortlist()
    showToast(shortlisted ? 'Candidature enregistrée. Le candidat essaie de rester professionnel.' : 'Retiré de la shortlist. Le candidat survivra administrativement.')
  })

  const modal = $('.modal-backdrop')
  const openModal = () => { if (modal) { modal.hidden = false; body.classList.add('modal-open'); setTimeout(() => $('[name="firstName"]', modal)?.focus(), 20) } }
  const closeModal = () => { if (modal) { modal.hidden = true; body.classList.remove('modal-open') } }
  $$('[data-open-application]').forEach(btn => btn.addEventListener('click', openModal))
  $('[data-close-application]')?.addEventListener('click', closeModal)
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal() })
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal() })
  $('[data-copy-application]')?.addEventListener('click', async event => {
    const first = $('[name="firstName"]', modal)?.value.trim() || 'Moi'
    const idea = $('[name="idea"]', modal)?.value.trim() || 'un café / une balade / un verre tranquille'
    const channel = $('[name="channel"]', modal)?.value.trim()
    const message = `Objet : suite favorable à ta candidature\n\nSalut Noam,\n${first} a examiné le dossier. Je propose ${idea}.\nLe conseil d’administration peut se réunir quand tu veux.${channel ? `\nPour me répondre : ${channel}` : ''}\n\nPS : le site était ridiculement bien fait.`
    try {
      await navigator.clipboard.writeText(message)
      event.currentTarget.textContent = 'Message copié ✓'
      showToast('Message copié. Aucun CRM amoureux n’a été impliqué.')
    } catch {
      prompt('Copie ce message :', message)
    }
  })

  const cat = $('.cat-easter')
  const catImg = $('.cat-easter__photo img')
  const catSources = [catOne, catTwo]
  let catAlt = 0, catClicks = 0, catTimer
  const scheduleCat = () => {
    clearTimeout(catTimer)
    catTimer = setTimeout(() => { if (cat) cat.hidden = false }, 13000 + Math.random() * 9000)
  }
  $('[data-close-cat]')?.addEventListener('click', () => {
    if (cat) cat.hidden = true
    catAlt = 1 - catAlt
    if (catImg) catImg.src = catSources[catAlt]
    scheduleCat()
  })
  $('.cat-easter__photo')?.addEventListener('click', () => {
    catClicks++
    if (catClicks === 3) showToast('Le contrôleur qualité félin confirme que tu as de bons réflexes.')
    if (catClicks === 5) showToast('Le chat demande officiellement à participer à l’entretien.')
    if (catClicks >= 7) { showToast('Achievement unlocked : recrutement supervisé par un chat.'); catClicks = 0 }
  })
  scheduleCat()

  const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
  let k = 0
  addEventListener('keydown', e => {
    if (e.key === sequence[k]) {
      k++
      if (k === sequence.length) {
        k = 0
        body.classList.add('redistribution-mode')
        showToast('Mode redistribution activé : les compliments appartiennent désormais à tout le monde.')
        setTimeout(() => body.classList.remove('redistribution-mode'), 3800)
      }
    } else k = e.key === sequence[0] ? 1 : 0
  })

  console.log('%cNOAM.CV', 'font-size:22px;font-weight:800;letter-spacing:4px')
  console.log('Tu as ouvert la console. Curiosité : +1 point.')
  console.log('status: emotionally_online | uptime: dépend fortement du sommeil | cat_dependency: unresolved')
})()
