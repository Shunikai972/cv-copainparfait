<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import heroPhoto from './assets-inline/noam-hero.js'
import bwPhoto from './assets-inline/noam-bw.js'
import peacePhoto from './assets-inline/noam-peace.js'
import altPhoto from './assets-inline/noam-alt.js'
import catOne from './assets-inline/chat-1.js'
import catTwo from './assets-inline/chat-2.js'
import pdfBase64 from './pdfData.js'

const theme = ref('dark')
const introVisible = ref(true)
const introStep = ref(0)
const introProgress = ref(0)
const shortlist = ref(false)
const toast = ref('')
const modalOpen = ref(false)
const mobileOpen = ref(false)
const openFaq = ref(0)
const catVisible = ref(false)
const catAlt = ref(false)
const catClicks = ref(0)
const konamiIndex = ref(0)
const applicationName = ref('')
const applicationIdea = ref('')

let introTimer
let catTimer
let toastTimer
let progressTimer

const introLines = [
  'Initialisation du dossier candidat…',
  'Vérification des compétences relationnelles…',
  'Analyse du risque félin…',
  'Compilation de la candidature…',
  'Résultat : étonnamment présentable.'
]

const skills = [
  ['Humour', 'Capacité à raconter des conneries avec un sérieux inquiétant.', 'niveau: stable'],
  ['Romantisme', 'Fonctionnalité disponible nativement, sans abonnement Premium.', 'feature_flag: on'],
  ['Intelligence', 'Assez pour savoir que mettre « intelligent » dans son propre CV est statistiquement suspect.', 'self_reported'],
  ['Code', 'Python, informatique et quatre heures pour automatiser une tâche qui en prenait cinq minutes.', 'production-ish'],
  ['Communication', 'Débats, longues discussions nocturnes et envoi occasionnel de vidéos de chats.', 'latency: low'],
  ['Cuisine', 'Niveau actuellement soumis à audit indépendant.', 'status: pending']
]

const interests = [
  ['🐈', 'Chats', 'Probablement mon principal conflit d’intérêts.'],
  ['📚', 'Lecture', 'Parce que fixer du texte pendant plusieurs heures est apparemment un loisir.'],
  ['🎮', 'Jeux vidéo', 'Le deuxième écran est une extension naturelle du corps humain.'],
  ['💻', 'Code', 'Passion, études et principale cause de « attends deux minutes, j’ai presque fini ».'],
  ['🧠', 'Discussions', 'Politique, sciences, technologie, société ou sujets absurdes à 2 h du matin.'],
  ['✍️', 'Poésie', 'J’écris des poèmes. Et si on apprend vraiment à se connaître, j’aimerais bien en écrire un pour toi.']
]

const issues = [
  ['BUG-001', 'Peut dire « j’arrive » alors qu’il est encore devant son PC.', 'minor'],
  ['BUG-002', 'S’arrête parfois pour regarder un chat dans la rue.', 'won’t fix'],
  ['BUG-003', 'Peut transformer une question simple en débat beaucoup trop approfondi.', 'known'],
  ['BUG-004', '« Je fais juste une petite modification au code » n’a aucune valeur temporelle fiable.', 'recurring'],
  ['BUG-005', 'Risque élevé de vouloir adopter un chat.', 'feature?']
]

const features = [
  'Loyal', 'Curieux', 'Affectueux', 'Romantique sans vouloir jouer dans une comédie Netflix',
  'Aime écouter', 'Capable de parler sérieusement', 'Aime apprendre les passions des autres',
  'Investi dans ce qu’il aime', 'Toujours partant pour rire'
]

const values = [
  ['Communication', 'Pouvoir dire les choses clairement, même quand elles sont moins simples.'],
  ['Confiance', 'Pas de jeu de rôle permanent : chacun peut rester lui-même.'],
  ['Humour', 'Être sérieux quand il faut, sans devoir l’être tout le temps.'],
  ['Curiosité', 'Apprendre de l’autre, découvrir ses passions et continuer à se surprendre.'],
  ['Indépendance', 'Être bien ensemble sans arrêter d’exister séparément.'],
  ['Affection', 'Les petits détails comptent souvent plus que les grandes déclarations.']
]

const stats = [
  ['Amour des chats', 100, '100 %'],
  ['Probabilité de parler informatique', 88, 'élevée'],
  ['Chance d’envoyer un meme', 97, '97 %'],
  ['Orientation politique', 100, 'hors cadre à gauche'],
  ['Discussions inutiles à 2 h du matin', 94, 'excellente'],
  ['Finir « juste un dernier truc » avant de dormir', 3, '3 %']
]

const testimonials = [
  ['« Il paraît qu’il est drôle. »', 'Source étonnamment proche du candidat'],
  ['« Miaou. »', 'Expert indépendant'],
  ['« Son code fonctionne. »', 'Certains jours']
]

const faqs = [
  ['Pourquoi un site entier ?', 'Parce qu’envoyer « salut ça va » ne permettait manifestement pas d’utiliser mes compétences en informatique.'],
  ['C’est une vraie candidature ?', 'Juridiquement, probablement pas. Moralement, à toi de voir.'],
  ['Combien de chats sont acceptables ?', 'Cette question semble orientée.'],
  ['Premier rendez-vous idéal ?', 'Quelque chose où on peut réellement discuter et rire : café, balade, bar tranquille, activité improvisée… bonus non contractuel si un chat apparaît.'],
  ['Quel est le processus de recrutement ?', 'Discussion → feeling → café/verre/sortie → conseil d’administration extraordinaire.']
]

const responsibilities = [
  'envoyer des trucs qui m’ont fait penser à toi',
  'retenir les petits détails importants',
  'proposer des sorties',
  'écouter vraiment quand quelque chose ne va pas',
  'accepter qu’un chat trouvé dans la rue puisse potentiellement devenir notre chat',
  'fournir une quantité raisonnable de sarcasme',
  'débattre pendant deux heures puis aller manger comme si rien ne s’était passé'
]

const themeLabel = computed(() => theme.value === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre')

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 3800)
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme.value
  localStorage.setItem('noam-theme', theme.value)
}

function finishIntro() {
  clearInterval(progressTimer)
  clearTimeout(introTimer)
  introProgress.value = 100
  introStep.value = introLines.length - 1
  setTimeout(() => {
    introVisible.value = false
    sessionStorage.setItem('noam-intro-seen', '1')
  }, 300)
}

function toggleShortlist() {
  shortlist.value = !shortlist.value
  localStorage.setItem('noam-shortlist', shortlist.value ? '1' : '0')
  showToast(shortlist.value
    ? 'Candidature enregistrée. Le candidat essaie de rester professionnel.'
    : 'Retiré de la shortlist. Décision transmise au conseil d’administration.')
}

function scrollTo(id) {
  mobileOpen.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function downloadCv() {
  const bytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0))
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'Noam-CV-candidature-amoureuse.pdf'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  showToast('CV téléchargé. Oui, le PDF existe vraiment.')
}

function scheduleCat() {
  clearTimeout(catTimer)
  catTimer = setTimeout(() => {
    catAlt.value = !catAlt.value
    catVisible.value = true
  }, 9000 + Math.random() * 9000)
}

function hideCat() {
  catVisible.value = false
  scheduleCat()
}

function clickCat() {
  catClicks.value++
  if (catClicks.value === 3) showToast('Le contrôleur qualité félin confirme que tu as de bons réflexes.')
  if (catClicks.value === 5) showToast('Le chat demande officiellement à participer à l’entretien.')
  if (catClicks.value >= 7) {
    showToast('Achievement unlocked : recrutement supervisé par un chat.')
    catClicks.value = 0
  }
}

function onKeydown(event) {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
  if (event.key === code[konamiIndex.value]) {
    konamiIndex.value++
    if (konamiIndex.value === code.length) {
      konamiIndex.value = 0
      document.body.classList.add('redistribution-mode')
      showToast('Mode redistribution activé : les compliments appartiennent désormais à tout le monde.')
      setTimeout(() => document.body.classList.remove('redistribution-mode'), 3500)
    }
  } else {
    konamiIndex.value = event.key === code[0] ? 1 : 0
  }
}

async function copyApplication() {
  const name = applicationName.value.trim() || 'Candidate anonyme'
  const idea = applicationIdea.value.trim() || 'un café / une balade / quelque chose où on peut discuter'
  const text = `${name} souhaite proposer un entretien informel à Noam. Proposition : ${idea}. Décision RH : à discuter.`
  try {
    await navigator.clipboard.writeText(text)
    showToast('Message copié. Il ne reste plus qu’à l’envoyer là où tu as reçu ce lien.')
  } catch {
    showToast('Copie automatique indisponible. Le formulaire reste juridiquement très peu contraignant.')
  }
  modalOpen.value = false
}

onMounted(() => {
  theme.value = localStorage.getItem('noam-theme') || 'dark'
  document.documentElement.dataset.theme = theme.value
  shortlist.value = localStorage.getItem('noam-shortlist') === '1'

  const alreadySeen = sessionStorage.getItem('noam-intro-seen') === '1'
  if (alreadySeen) {
    introVisible.value = false
  } else {
    progressTimer = setInterval(() => {
      introProgress.value = Math.min(100, introProgress.value + 2)
      introStep.value = Math.min(introLines.length - 1, Math.floor(introProgress.value / 21))
    }, 62)
    introTimer = setTimeout(finishIntro, 3400)
  }

  scheduleCat()
  window.addEventListener('keydown', onKeydown)

  console.log('%cNOAM.CV', 'font-size:22px;font-weight:800;letter-spacing:4px')
  console.log('Tu as ouvert la console. Curiosité : +1 point.')
  console.log('status: emotionally_online | uptime: variable selon quantité de sommeil | cat_dependency: unresolved')
})

onBeforeUnmount(() => {
  clearTimeout(introTimer)
  clearTimeout(catTimer)
  clearTimeout(toastTimer)
  clearInterval(progressTimer)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Transition name="intro-fade">
    <div v-if="introVisible" class="intro" role="dialog" aria-label="Introduction">
      <div class="intro__noise"></div>
      <div class="intro__panel">
        <div class="intro__topline"><span>NOAM.CV</span><span>candidate_loader.exe</span></div>
        <div class="intro__logo">N<span>.</span></div>
        <p class="intro__kicker">DOSSIER CONFIDENTIEL • NIVEAU DE SÉRIEUX VARIABLE</p>
        <h1>Chargement d’une candidature<br><em>probablement disproportionnée.</em></h1>
        <div class="intro__terminal">
          <span class="terminal__prompt">›</span>
          <span>{{ introLines[introStep] }}</span>
          <i></i>
        </div>
        <div class="intro__progress"><span :style="{ width: introProgress + '%' }"></span></div>
        <div class="intro__footer"><span>{{ introProgress }}%</span><button type="button" @click="finishIntro">Passer l’intro</button></div>
      </div>
    </div>
  </Transition>

  <div class="site-shell">
    <header class="nav-wrap">
      <nav class="nav container">
        <button class="brand" type="button" @click="scrollTo('hero')"><span>N</span><div><b>Noam</b><small>candidate.profile</small></div></button>
        <div class="nav__links">
          <button @click="scrollTo('profile')">Profil</button>
          <button @click="scrollTo('skills')">Compétences</button>
          <button @click="scrollTo('issues')">Known Issues</button>
          <button @click="scrollTo('faq')">FAQ</button>
        </div>
        <div class="nav__actions">
          <button class="icon-btn" type="button" :aria-label="themeLabel" :title="themeLabel" @click="toggleTheme">{{ theme === 'dark' ? '☼' : '◐' }}</button>
          <button class="nav-download" type="button" @click="downloadCv">Télécharger le CV</button>
          <button class="menu" type="button" aria-label="Menu" @click="mobileOpen = !mobileOpen"><span></span><span></span></button>
        </div>
      </nav>
      <Transition name="menu-drop">
        <div v-if="mobileOpen" class="mobile-nav">
          <button @click="scrollTo('profile')">Profil</button><button @click="scrollTo('skills')">Compétences</button><button @click="scrollTo('issues')">Known Issues</button><button @click="scrollTo('faq')">FAQ</button><button @click="downloadCv">Télécharger le CV</button>
        </div>
      </Transition>
    </header>

    <main>
      <section id="hero" class="hero section">
        <div class="hero__glow hero__glow--a"></div><div class="hero__glow hero__glow--b"></div>
        <div class="container hero__grid">
          <div class="hero__copy">
            <div class="hero__meta"><span class="online"><i></i> emotionally_online</span><span>Noam v?.x</span></div>
            <p class="eyebrow">OBJET : CANDIDATURE SPONTANÉE</p>
            <h1>Noam.</h1>
            <p class="hero__lead">Étudiant en informatique, romantique occasionnel, propriétaire de zéro chat contre son gré.</p>
            <p class="hero__role">Poste visé : <strong>potentiel copain</strong></p>
            <div class="hero__buttons">
              <button class="btn btn--primary" @click="scrollTo('profile')">Examiner la candidature <span>↘</span></button>
              <button class="btn btn--ghost" @click="scrollTo('skills')">Voir les qualifications</button>
            </div>
            <p class="hero__availability">Disponibilité : à négocier autour de mes deadlines.</p>
            <div class="hero__tiny"><span>server_status</span><b>stable-ish</b><span>uptime</span><b>sleep dependent</b></div>
          </div>
          <div class="hero__visual">
            <div class="portrait-card">
              <img :src="heroPhoto" alt="Portrait de Noam" />
              <div class="portrait-card__tag"><span>candidate_01</span><strong>NOAM</strong></div>
            </div>
            <div class="floating-note note--one">double diplôme<br><b>prépa + BUT info</b></div>
            <div class="floating-note note--two">cat affinity<br><b>100%</b></div>
          </div>
        </div>
      </section>

      <section id="profile" class="section section--soft">
        <div class="container two-col">
          <div>
            <p class="eyebrow">01 / PROFIL</p>
            <h2>Un profil sérieux.<br><em>Le contexte l’est moins.</em></h2>
          </div>
          <div class="prose-card">
            <p>Étudiant en double diplôme <strong>prépa ingénieur / BUT Informatique</strong>, spécialisé dans la résolution de problèmes, les projets inutilement ambitieux et l’affection disproportionnée envers les chats.</p>
            <p>À l’aise aussi bien devant du code que devant un livre, avec une capacité reconnue à transformer une conversation de cinq minutes en débat philosophique d’une heure.</p>
            <p>Je peux passer d’une discussion complètement débile à plusieurs heures sur la politique, la société, la science ou la technologie. Je suis très à gauche — suffisamment pour qu’un composant CSS tente parfois de sortir de l’écran.</p>
            <p class="prose-card__closing">Recherche actuellement une opportunité à durée indéterminée. Période d’essai autour d’un café acceptée.</p>
          </div>
        </div>
      </section>

      <section id="skills" class="section">
        <div class="container">
          <div class="section-head"><div><p class="eyebrow">02 / COMPÉTENCES</p><h2>Core skills</h2></div><p>Évaluation interne, méthodologie contestable.</p></div>
          <div class="skill-grid">
            <article v-for="(skill, i) in skills" :key="skill[0]" class="skill-card">
              <span class="skill-card__num">0{{ i + 1 }}</span><h3>{{ skill[0] }}</h3><p>{{ skill[1] }}</p><code>{{ skill[2] }}</code>
            </article>
          </div>
        </div>
      </section>

      <section class="section section--soft">
        <div class="container">
          <div class="section-head"><div><p class="eyebrow">03 / CENTRES D’INTÉRÊT</p><h2>Ce qui occupe mon cerveau</h2></div><p>Par ordre absolument non contractuel.</p></div>
          <div class="interest-grid">
            <article v-for="item in interests" :key="item[1]" class="interest-card"><span>{{ item[0] }}</span><div><h3>{{ item[1] }}</h3><p>{{ item[2] }}</p></div></article>
          </div>
        </div>
      </section>

      <section class="section photo-section">
        <div class="container">
          <div class="section-head"><div><p class="eyebrow">04 / PIÈCES JOINTES</p><h2>Preuves visuelles</h2></div><p>Le CV traditionnel demandait une photo. J’ai mal interprété la consigne.</p></div>
          <div class="photo-grid">
            <figure class="photo photo--tall"><img :src="bwPhoto" alt="Portrait noir et blanc de Noam" /><figcaption>mode : probablement en train de réfléchir</figcaption></figure>
            <figure class="photo"><img :src="peacePhoto" alt="Portrait de Noam faisant un signe de paix" /><figcaption>communication non verbale certifiée</figcaption></figure>
            <figure class="photo"><img :src="altPhoto" alt="Portrait de Noam" /><figcaption>build casual</figcaption></figure>
            <figure class="photo photo--cat"><img :src="catOne" alt="Chat de Noam" /><figcaption>direction des ressources félines</figcaption></figure>
          </div>
        </div>
      </section>

      <section class="section section--soft">
        <div class="container experience-grid">
          <div><p class="eyebrow">05 / EXPÉRIENCE</p><h2>Expérience professionnelle<br><em>amoureuse</em></h2><div class="job-meta"><b>Candidat potentiel</b><span>2026 → ?</span></div></div>
          <div class="responsibilities"><p>Responsabilités envisagées :</p><ul><li v-for="item in responsibilities" :key="item"><span>✓</span>{{ item }}</li></ul><small>Aucune ancienne relation n’a été inventée pour améliorer le CV. Le service conformité remercie le candidat.</small></div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head"><div><p class="eyebrow">06 / VALEURS</p><h2>La partie sans blague obligatoire</h2></div><p>Parce qu’un bon feeling ne remplace pas les bases.</p></div>
          <div class="values-grid"><article v-for="value in values" :key="value[0]"><h3>{{ value[0] }}</h3><p>{{ value[1] }}</p></article></div>
        </div>
      </section>

      <section id="stats" class="section section--soft">
        <div class="container">
          <div class="section-head"><div><p class="eyebrow">07 / ANALYTICS</p><h2>Statistiques totalement objectives</h2></div><p>Source : confiance excessive dans Excel.</p></div>
          <div class="stats-card">
            <div v-for="stat in stats" :key="stat[0]" class="stat-row">
              <div class="stat-row__top"><span>{{ stat[0] }}</span><strong>{{ stat[2] }}</strong></div><div class="meter"><i :style="{ width: stat[1] + '%' }"></i></div>
            </div>
            <small>Statistiques réalisées par un organisme indépendant composé de Noam.</small>
          </div>
        </div>
      </section>

      <section id="issues" class="section issue-section">
        <div class="container">
          <div class="issue-header"><div><p class="eyebrow">08 / BUG TRACKER</p><h2>Known Issues</h2></div><div class="release-status"><i></i><span>Stable release</span><small>quelques bugs connus, aucun critique</small></div></div>
          <div class="issue-table">
            <div class="issue-table__head"><span>ID</span><span>Description</span><span>Status</span></div>
            <div v-for="issue in issues" :key="issue[0]" class="issue-line"><code>{{ issue[0] }}</code><p>{{ issue[1] }}</p><span>{{ issue[2] }}</span></div>
          </div>
        </div>
      </section>

      <section class="section section--soft">
        <div class="container features-wrap">
          <div><p class="eyebrow">09 / CHANGELOG</p><h2>Features</h2><p class="feature-lead">La section précédente était contractuellement obligée d’être suivie d’un correctif d’image.</p></div>
          <div class="feature-cloud"><span v-for="feature in features" :key="feature">✓ {{ feature }}</span></div>
        </div>
      </section>

      <section class="section education-section">
        <div class="container education-grid">
          <div><p class="eyebrow">10 / FORMATION</p><h2>Double cursus</h2></div>
          <div class="degree-card"><span class="degree-card__year">CURRENT</span><h3>Prépa ingénieur + BUT Informatique</h3><p>Deux parcours en parallèle, parce qu’apparemment un seul emploi du temps ne suffisait pas.</p><hr><small>Spécialisation officieuse</small><strong>Faire croire à mon emploi du temps que 24 heures dans une journée suffisent.</strong></div>
        </div>
      </section>

      <section class="section section--soft poetry-section">
        <div class="container poetry-grid">
          <div class="poetry-card"><span>✦</span><p>J’écris des poèmes.</p><h2>Et j’aimerais peut-être<br>en écrire <em>pour toi.</em></h2><small>Pas dès le premier message. Il faut quand même laisser au comité éditorial le temps de trouver de la matière.</small></div>
          <div class="poetry-copy"><p>J’aime écrire quand j’ai quelque chose de vrai à raconter. Alors si on apprend à se connaître, si des détails, des souvenirs ou une façon de rire finissent par m’inspirer, oui : j’aimerais bien en faire un poème.</p><p>Promis, aucun acrostiche avec ton prénom n’est prévu sans consentement préalable.</p></div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head"><div><p class="eyebrow">11 / RÉFÉRENCES</p><h2>Témoignages</h2></div><p>Procédure de vérification volontairement insuffisante.</p></div>
          <div class="testimonial-grid"><blockquote v-for="quote in testimonials" :key="quote[1]"><p>{{ quote[0] }}</p><footer>— {{ quote[1] }}</footer></blockquote></div>
        </div>
      </section>

      <section id="faq" class="section section--soft faq-section">
        <div class="container faq-grid">
          <div><p class="eyebrow">12 / FAQ</p><h2>Questions raisonnablement fréquentes</h2><p>Le service RH répond sous un délai théorique de zéro à beaucoup trop de minutes.</p></div>
          <div class="faq-list"><article v-for="(faq, i) in faqs" :key="faq[0]" :class="{ open: openFaq === i }"><button @click="openFaq = openFaq === i ? -1 : i"><span>{{ faq[0] }}</span><b>{{ openFaq === i ? '−' : '+' }}</b></button><Transition name="answer"><p v-if="openFaq === i">{{ faq[1] }}</p></Transition></article></div>
        </div>
      </section>

      <section class="section final-cta">
        <div class="container cta-card">
          <div class="cta-card__label">APPLICATION_STATUS: OPEN</div><h2>Ma candidature a retenu<br>votre attention ?</h2><p>Le candidat est disponible pour un entretien informel. Café, verre, balade, activité improvisée : le format reste négociable.</p>
          <div class="cta-actions"><button class="btn btn--primary" @click="modalOpen = true">Proposer un entretien <span>↗</span></button><button class="btn btn--ghost" :class="{ selected: shortlist }" @click="toggleShortlist">{{ shortlist ? '✓ Dans la shortlist' : 'Mettre le candidat en shortlist' }}</button></div>
          <button class="text-download" @click="downloadCv">CV amoureux PDF ↓</button>
        </div>
      </section>
    </main>

    <footer class="footer"><div class="container"><div><b>NOAM.CV</b><span>Fait avec Vue, Vite et une quantité déraisonnable d’autodérision.</span></div><div><code>status: emotionally_online</code><code>cat_dependency: unresolved</code></div></div></footer>

    <Transition name="toast"><div v-if="toast" class="toast">{{ toast }}</div></Transition>

    <Transition name="cat-pop">
      <aside v-if="catVisible" class="cat-easter"><button class="cat-easter__close" @click="hideCat">×</button><button class="cat-easter__img" @click="clickCat"><img :src="catAlt ? catTwo : catOne" alt="Chat de Noam" /></button><div><b>Contrôle qualité.</b><span>Le chat surveille le recrutement.</span></div></aside>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="modalOpen" class="modal" @click.self="modalOpen = false">
        <div class="modal__card"><button class="modal__close" @click="modalOpen = false">×</button><span class="modal__tag">ENTRETIEN INFORMEL</span><h2>Proposer un entretien</h2><p>Ce formulaire n’envoie rien à un serveur. Il prépare juste un message à copier, parce qu’un site romantique qui collecte des données personnelles serait un choix de design assez discutable.</p><label>Ton prénom <input v-model="applicationName" placeholder="Optionnel" /></label><label>Une idée de sortie <textarea v-model="applicationIdea" rows="3" placeholder="Café, balade, verre, expo, activité improvisée…"></textarea></label><button class="btn btn--primary modal__submit" @click="copyApplication">Copier la proposition</button><small>Ensuite, envoie-la simplement à Noam par le canal où tu as reçu ce site.</small></div>
      </div>
    </Transition>
  </div>
</template>
