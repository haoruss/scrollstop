// ScrollStop — côté navigateur
// Envoie le formulaire au serveur, affiche le plan, gère Copier / Télécharger.

const formulaire = document.getElementById('formulaire');
const boutonGenerer = document.getElementById('bouton-generer');
const zoneErreur = document.getElementById('erreur');
const zoneResultat = document.getElementById('resultat');

let planActuel = null;

// Petit raccourci pour créer un élément avec du texte (textContent = pas de risque d'injection HTML)
function creer(balise, classe, texte) {
  const el = document.createElement(balise);
  if (classe) el.className = classe;
  if (texte) el.textContent = texte;
  return el;
}

function afficherErreur(message) {
  zoneErreur.textContent = message;
  zoneErreur.hidden = !message;
}

async function generer() {
  const donnees = {
    sujet: document.getElementById('sujet').value.trim(),
    plateforme: document.getElementById('plateforme').value,
    ton: document.getElementById('ton').value,
    duree: formulaire.querySelector('input[name="duree"]:checked').value
  };

  if (donnees.sujet.length < 2) {
    afficherErreur('Indique le sujet de ta vidéo (au moins 2 caractères).');
    document.getElementById('sujet').focus();
    return;
  }

  afficherErreur('');
  boutonGenerer.disabled = true;
  boutonGenerer.textContent = 'Création du plan…';

  try {
    const reponse = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donnees)
    });
    const resultat = await reponse.json();
    if (!reponse.ok) throw new Error(resultat.erreur || 'Erreur inconnue.');

    planActuel = resultat;
    afficherPlan(resultat);
  } catch (err) {
    afficherErreur(err.message === 'Failed to fetch'
      ? 'Impossible de joindre le serveur. Réessaie dans quelques secondes.'
      : err.message);
  } finally {
    boutonGenerer.disabled = false;
    boutonGenerer.textContent = 'Générer mon plan';
  }
}

function afficherPlan(plan) {
  document.getElementById('accroche').textContent = plan.accroche;
  document.getElementById('infos').textContent =
    `${plan.plateforme} · ${plan.duree} secondes · ton ${plan.ton.toLowerCase()} · sujet : ${plan.sujet}`;
  document.getElementById('rythme').textContent = 'Rythme : ' + plan.rythme;

  const liste = document.getElementById('segments');
  liste.replaceChildren();
  plan.segments.forEach(s => {
    const li = creer('li');
    li.append(creer('div', 'temps', `${s.debut}–${s.fin} s`));

    const contenu = creer('div');
    contenu.append(creer('h3', '', s.etape));
    contenu.append(creer('p', '', s.aMontrer));
    if (s.texteEcran) contenu.append(creer('span', 'ecran', 'Texte : ' + s.texteEcran));
    contenu.append(creer('p', 'astuce', 'Montage : ' + s.montage));

    li.append(contenu);
    liste.append(li);
  });

  document.getElementById('son').textContent = plan.son;
  document.getElementById('legende').textContent = plan.legende;
  document.getElementById('hashtags').textContent = plan.hashtags.join(' ');

  const conseils = document.getElementById('conseils');
  conseils.replaceChildren(...plan.conseils.map(c => creer('li', '', c)));

  zoneResultat.hidden = false;
  zoneResultat.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Version texte du plan, pour Copier et Télécharger
function planEnTexte(plan) {
  const lignes = [
    'SCROLLSTOP — PLAN DE MONTAGE',
    `Sujet : ${plan.sujet}`,
    `${plan.plateforme} · ${plan.duree} s · ton ${plan.ton.toLowerCase()}`,
    '',
    'ACCROCHE',
    plan.accroche,
    '',
    'DÉCOUPAGE',
    `Rythme : ${plan.rythme}`,
    ''
  ];
  plan.segments.forEach(s => {
    lignes.push(`[${s.debut}–${s.fin} s] ${s.etape.toUpperCase()}`);
    lignes.push(`  À montrer : ${s.aMontrer}`);
    if (s.texteEcran) lignes.push(`  Texte à l'écran : ${s.texteEcran}`);
    lignes.push(`  Montage : ${s.montage}`);
    lignes.push('');
  });
  lignes.push('SON', plan.son, '');
  lignes.push('LÉGENDE', plan.legende, '', plan.hashtags.join(' '), '');
  lignes.push('CONSEILS ' + plan.plateforme.toUpperCase());
  plan.conseils.forEach(c => lignes.push('- ' + c));
  return lignes.join('\n');
}

function confirmer(bouton, message) {
  const original = bouton.textContent;
  bouton.textContent = message;
  setTimeout(() => { bouton.textContent = original; }, 1800);
}

async function copier() {
  if (!planActuel) return;
  const bouton = document.getElementById('bouton-copier');
  const texte = planEnTexte(planActuel);
  try {
    await navigator.clipboard.writeText(texte);
  } catch {
    // Solution de secours pour les navigateurs qui bloquent le presse-papiers
    const zone = document.createElement('textarea');
    zone.value = texte;
    document.body.append(zone);
    zone.select();
    document.execCommand('copy');
    zone.remove();
  }
  confirmer(bouton, 'Copié ✓');
}

function telecharger() {
  if (!planActuel) return;
  const nom = planActuel.sujet
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'video';

  const fichier = new Blob([planEnTexte(planActuel)], { type: 'text/plain;charset=utf-8' });
  const lien = document.createElement('a');
  lien.href = URL.createObjectURL(fichier);
  lien.download = `scrollstop-${nom}.txt`;
  lien.click();
  URL.revokeObjectURL(lien.href);
  confirmer(document.getElementById('bouton-telecharger'), 'Téléchargé ✓');
}

formulaire.addEventListener('submit', e => { e.preventDefault(); generer(); });
document.getElementById('bouton-copier').addEventListener('click', copier);
document.getElementById('bouton-telecharger').addEventListener('click', telecharger);
document.getElementById('bouton-autre').addEventListener('click', generer);
