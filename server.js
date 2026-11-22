// ScrollStop — serveur Express
// Il sert la page (dossier public/) et fabrique les plans de montage via /api/plan.
// Tout le savoir-faire est dans les "modèles" ci-dessous : modifie-les librement.

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// 1. LES MODÈLES (ton savoir-faire)
// {sujet} et {duree} sont remplacés automatiquement.
// ---------------------------------------------------------------------------

const PLATEFORMES = {
  reels: {
    nom: 'Instagram Reels',
    conseils: [
      'Format 9:16 (1080 × 1920). Garde les textes hors des 20 % du bas, cachés par la légende et les boutons.',
      'Choisis une image de couverture lisible : elle apparaît sur ta grille de profil.',
      'Les Reels qui sont partagés en message privé sont les plus poussés : donne une raison de les envoyer à un ami.'
    ]
  },
  tiktok: {
    nom: 'TikTok',
    conseils: [
      'Format 9:16. Le spectateur décide en moins d\'une seconde : aucune image d\'intro, aucun logo au début.',
      'Prends le son directement dans la bibliothèque TikTok pour profiter des tendances.',
      'Ajoute des sous-titres : une grande partie des gens regardent sans le son.'
    ]
  },
  shorts: {
    nom: 'YouTube Shorts',
    conseils: [
      'Format 9:16, moins de 60 secondes pour être sûr d\'être classé en Short.',
      'Fais en sorte que la fin s\'enchaîne avec le début : la boucle augmente la durée de visionnage.',
      'Soigne le titre : sur YouTube, il compte autant que la légende.'
    ]
  }
};

const TONS = {
  fun: {
    nom: 'Fun',
    // Chaque accroche = une phrase + un type + le geste de montage de la 1re image
    accroches: [
      { type: 'Relatable', texte: 'POV : tu te lances dans {sujet} sans rien préparer 😅',
        visuel: 'Commence en plein chaos, caméra à l\'épaule, aucune mise en place.' },
      { type: 'Curiosité', texte: 'Personne ne m\'avait prévenu pour {sujet}…',
        visuel: 'Gros plan sur ta tête déçue, puis zoom arrière brutal qui révèle la scène.' },
      { type: 'Interruption', texte: 'Stop. Avant de faire {sujet}, regarde ça.',
        visuel: 'Ta main couvre l\'objectif puis s\'écarte d\'un coup, avec un bruitage « pop ».' },
      { type: 'Contraste', texte: '{sujet} : ce que j\'imaginais vs la réalité 💀',
        visuel: 'Écran coupé en deux, version rêvée à gauche, vraie version à droite.' },
      { type: 'Test', texte: 'J\'ai testé {sujet} pour que tu n\'aies pas à le faire 🙃',
        visuel: 'Ouvre sur la fin (le raté ou la réussite) avec « RÉSULTAT ? », puis retour au début.' },
      { type: 'Défi', texte: 'Je te parie que tu ne tiens pas {duree} secondes sans rire 😂',
        visuel: 'Un chrono s\'affiche et démarre dès la toute première image.' }
    ],
    rythme: 'Coupes rapides (environ 1 plan par seconde), petits zooms punchy, bruitages sur les gags.',
    son: 'Un son tendance humoristique, ou une musique légère et rythmée. Ajoute des bruitages (whoosh, pop) sur les coupes.',
    cta: [
      'Tague quelqu\'un qui ferait exactement ça 😂',
      'Abonne-toi pour la partie 2 🍿',
      'Dis-moi en commentaire si ça t\'est déjà arrivé 👇'
    ],
    legendes: [
      'Bon… on en parle de {sujet} ? 😅',
      'Ça devait être simple. Ça ne l\'a pas été. 🙃',
      'Il fallait que je vous montre ça 😂'
    ],
    hashtags: ['#humour', '#drole']
  },
  motivant: {
    nom: 'Motivant',
    accroches: [
      { type: 'Avant / après', texte: 'Jour 1 vs jour [X] de {sujet}.',
        visuel: 'Écran partagé dès la 1re image, le « après » se révèle par un balayage. Remplace [X] par ton vrai chiffre.' },
      { type: 'Relatable', texte: 'Si tu galères avec {sujet}, cette vidéo est pour toi.',
        visuel: 'Plan serré, regard caméra, silence sur la phrase, puis le beat démarre juste après.' },
      { type: 'Interruption', texte: 'Arrête de remettre {sujet} à demain.',
        visuel: 'Un geste sec (objet posé fort, porte qui claque) : le bruit sert de réveil.' },
      { type: 'Curiosité', texte: 'Ce que personne ne te dit quand tu débutes {sujet}.',
        visuel: 'Travelling avant rapide vers ton visage pendant la phrase.' },
      { type: 'Transformation', texte: 'Il y a un an, je n\'aurais jamais cru réussir {sujet}.',
        visuel: 'Ouvre sur ta plus belle image du résultat, puis flash vers une vieille vidéo de toi.' },
      { type: 'Valeur', texte: 'La vraie différence entre ceux qui réussissent {sujet} et les autres 👇',
        visuel: '3 plans d\'action très courts (moins d\'1 s chacun) calés sur le beat avant la phrase.' }
    ],
    rythme: 'Coupes calées sur le beat de la musique, accélération progressive jusqu\'au moment fort.',
    son: 'Un beat énergique (120 à 140 BPM) avec un drop placé pile au moment du résultat. Voix off claire et posée par-dessus.',
    cta: [
      'Enregistre cette vidéo pour ta prochaine séance 💪',
      'Abonne-toi si tu veux progresser avec moi 🔥',
      'Écris « GO » en commentaire si tu t\'y mets aujourd\'hui'
    ],
    legendes: [
      'Personne ne viendra le faire à ta place. {sujet}, c\'est maintenant. 🔥',
      'Petit à petit, mais tous les jours. 💪',
      'Le plus dur, c\'est de commencer. La suite, je te la montre ici.'
    ],
    hashtags: ['#motivation', '#mindset']
  },
  pedagogique: {
    nom: 'Pédagogique',
    accroches: [
      { type: 'Erreurs', texte: '3 erreurs que tout le monde fait avec {sujet}',
        visuel: 'Gros « ❌ » rouge sur un plan de l\'erreur n°1, dès la première image.' },
      { type: 'Valeur', texte: '{sujet} expliqué en {duree} secondes ⏱️',
        visuel: 'Chrono en haut de l\'écran qui tourne pendant toute la vidéo.' },
      { type: 'Controverse', texte: 'Tu fais sûrement {sujet} de travers. Voilà pourquoi.',
        visuel: 'Montre directement le mauvais geste en gros plan, entouré d\'un cercle rouge.' },
      { type: 'Curiosité', texte: 'L\'astuce de {sujet} que j\'aurais aimé connaître plus tôt',
        visuel: 'Gros plan extrême sur le détail, puis zoom arrière qui révèle le contexte.' },
      { type: 'Contraste', texte: 'Arrête de faire {sujet} comme ça. Fais plutôt ça.',
        visuel: 'Mauvaise méthode barrée, puis coupe sèche sur la bonne pile sur le mot « ça ».' },
      { type: 'Valeur', texte: 'Si tu ne retiens qu\'une chose sur {sujet}, c\'est celle-là.',
        visuel: 'Le texte apparaît mot par mot, synchronisé avec ta voix.' }
    ],
    rythme: 'Un plan toutes les 2 à 3 secondes, textes courts et bien lisibles, flèches ou cercles pour montrer les détails.',
    son: 'Une musique lo-fi ou instrumentale discrète, volume bas : la voix off reste au premier plan.',
    cta: [
      'Enregistre pour ne pas oublier 📌',
      'Suis-moi pour d\'autres astuces comme celle-ci',
      'Pose ta question en commentaire, je réponds 👇'
    ],
    legendes: [
      'Tout ce qu\'il faut savoir sur {sujet}, en moins d\'une minute. 📌',
      'Garde cette vidéo sous le coude, elle va te servir.',
      'J\'aurais aimé qu\'on m\'explique {sujet} comme ça au début.'
    ],
    hashtags: ['#astuce', '#apprendre']
  },
  inspirant: {
    nom: 'Inspirant',
    accroches: [
      { type: 'Émotion', texte: 'Ce que {sujet} m\'a appris sur moi-même.',
        visuel: 'Plan large et lent, silhouette de dos, le texte apparaît en fondu.' },
      { type: 'Histoire', texte: 'Personne ne m\'a cru quand j\'ai commencé {sujet}.',
        visuel: 'Ouvre sur un moment de doute au ralenti, sans musique les 2 premières secondes.' },
      { type: 'Transformation', texte: 'Un jour, tout a basculé grâce à {sujet}.',
        visuel: 'Image du « avant » qui se fige, puis flash blanc vers le « après ».' },
      { type: 'Question', texte: 'Et si {sujet} était exactement ce qu\'il te manquait ?',
        visuel: 'Regard caméra très proche, voix basse, une seule phrase.' },
      { type: 'Histoire', texte: 'J\'ai failli abandonner {sujet}. Heureusement que non.',
        visuel: 'Ralenti sur l\'effort (souffle, mains), le son de la respiration au premier plan.' },
      { type: 'Boucle ouverte', texte: 'Regarde jusqu\'au bout, la fin me donne encore des frissons.',
        visuel: '1 seconde du moment final, puis retour au début avec « 3 mois plus tôt… ».' }
    ],
    rythme: 'Plans plus longs (3 à 4 secondes), transitions douces, ralentis sur les moments forts.',
    son: 'Piano ou cordes qui montent en intensité, avec un moment de silence juste avant la phrase clé.',
    cta: [
      'Partage-la à quelqu\'un qui a besoin de l\'entendre aujourd\'hui ❤️',
      'Abonne-toi pour la suite de l\'histoire',
      'Raconte-moi ton histoire en commentaire'
    ],
    legendes: [
      'Parfois, il suffit d\'un premier pas. ✨',
      '{sujet} a changé ma façon de voir les choses.',
      'Si tu lis ça, c\'est peut-être un signe.'
    ],
    hashtags: ['#inspiration', '#histoire']
  }
};

// Découpage selon la durée : [début, fin, type d'étape]
const STRUCTURES = {
  15: [[0, 2, 'accroche'], [2, 6, 'contexte'], [6, 12, 'coeur'], [12, 15, 'cta']],
  30: [[0, 3, 'accroche'], [3, 8, 'contexte'], [8, 16, 'point1'], [16, 24, 'point2'], [24, 30, 'cta']],
  60: [[0, 3, 'accroche'], [3, 10, 'contexte'], [10, 22, 'point1'], [22, 34, 'point2'],
       [34, 46, 'point3'], [46, 54, 'revelation'], [54, 60, 'cta']]
};

const ETAPES = {
  accroche: {
    nom: 'Accroche',
    aMontrer: 'L\'action la plus forte liée à {sujet}. Commence directement : pas de « Salut tout le monde », pas de logo, pas de « Donc voilà ».',
    montage: '' // remplacé par le geste de montage de l'accroche choisie
  },
  contexte: {
    nom: 'Contexte',
    aMontrer: 'Montre la situation de départ ou le problème autour de {sujet}.',
    texteEcran: 'Le problème ? 👇',
    montage: 'Change d\'angle par rapport à l\'accroche pour relancer l\'attention.'
  },
  coeur: {
    nom: 'Le cœur',
    aMontrer: 'La solution ou le moment clé en action, en 2 ou 3 plans différents.',
    texteEcran: 'Voilà ce qui change tout ✅',
    montage: 'C\'est le moment fort : coupe sur le beat ou sur le geste.'
  },
  point1: {
    nom: 'Point n°1',
    aMontrer: 'Premier conseil ou première étape de {sujet}, illustré par un plan concret.',
    texteEcran: '1️⃣ La base',
    montage: 'Un plan large puis un plan serré sur le détail.'
  },
  point2: {
    nom: 'Point n°2',
    aMontrer: 'Deuxième conseil. Change de décor ou d\'angle de caméra.',
    texteEcran: '2️⃣ Le détail qui fait la différence',
    montage: 'Transition rapide (jump cut ou whoosh) pour marquer le passage.'
  },
  point3: {
    nom: 'Point n°3',
    aMontrer: 'Troisième conseil, ou un avant / après.',
    texteEcran: '3️⃣ Le niveau au-dessus',
    montage: 'Écran partagé ou enchaînement avant / après pour montrer l\'écart.'
  },
  revelation: {
    nom: 'Révélation',
    aMontrer: 'Le résultat final ou le moment « waouh » de {sujet}.',
    texteEcran: 'Le résultat 🤯',
    montage: 'Place le drop ou la montée du son exactement ici. Ralenti possible.'
  },
  cta: {
    nom: 'Appel à l\'action',
    aMontrer: 'Regarde la caméra et dis clairement au spectateur quoi faire.',
    montage: 'Ralentis le rythme. Garde le texte à l\'écran au moins 2 secondes.'
  }
};

// Version « récit » des étapes, pour les tons fun, motivant et inspirant
// (les étapes numérotées 1, 2, 3 ne servent que pour le ton pédagogique)
const ETAPES_RECIT = {
  contexte: {
    nom: 'Le décor',
    aMontrer: 'Le début de {sujet} : le lieu, les gens, l\'ambiance avant que ça bouge.',
    texteEcran: 'Ça partait tranquille…',
    montage: 'Change d\'angle par rapport à l\'accroche pour relancer l\'attention.'
  },
  coeur: {
    nom: 'Le moment fort',
    aMontrer: 'Le meilleur moment de {sujet} : une action, une réaction, un fou rire.',
    texteEcran: 'Et là… 😳',
    montage: 'Arrêt sur image ou ralenti sur le geste, avec un bruitage.'
  },
  point1: {
    nom: 'Ça démarre',
    aMontrer: 'On entre dans l\'action : les premières images de {sujet}.',
    texteEcran: 'C\'est parti 🔥',
    montage: 'Plans courts, un par seconde environ, pour lancer le rythme.'
  },
  point2: {
    nom: 'Ça se corse',
    aMontrer: 'Le passage difficile ou drôle : imprévu, effort, chute, fatigue.',
    texteEcran: 'Et là, ça se complique…',
    montage: 'Arrêt sur image ou ralenti sur le moment clé, avec un bruitage.'
  },
  point3: {
    nom: 'Le pic',
    aMontrer: 'Le moment que tout le monde retiendra de {sujet}.',
    texteEcran: 'Le moment que personne n\'oubliera',
    montage: 'Accélère juste avant, puis laisse respirer le plan.'
  }
};

// Mots ignorés pour fabriquer les hashtags à partir du sujet
const MOTS_VIDES = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'en', 'pour', 'avec',
  'sans', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'sur', 'dans', 'au', 'aux', 'comment', 'faire'];

// ---------------------------------------------------------------------------
// 2. LES OUTILS
// ---------------------------------------------------------------------------

function choisir(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

function remplir(texte, sujet, duree) {
  const resultat = texte.replace(/\{sujet\}/g, sujet).replace(/\{duree\}/g, duree)
    // contractions du français : « de le » → « du », « de une » → « d'une »…
    .replace(/\bde le /gi, 'du ')
    .replace(/\bde les /gi, 'des ')
    .replace(/(^|\s)à le /gi, '$1au ')
    .replace(/(^|\s)à les /gi, '$1aux ')
    .replace(/\b(de|que) ([aeiouyéèêàâîô])/gi, (m, mot, lettre) => mot.slice(0, -1) + '\'' + lettre);
  return resultat.charAt(0).toUpperCase() + resultat.slice(1); // majuscule en début de phrase
}

function hashtagsDuSujet(sujet) {
  return sujet
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(mot => mot.length > 2 && !MOTS_VIDES.includes(mot))
    .slice(0, 3)
    .map(mot => '#' + mot);
}

// ---------------------------------------------------------------------------
// 3. LA FABRICATION DU PLAN
// ---------------------------------------------------------------------------

function genererPlan({ sujet, plateforme, duree, ton }) {
  const p = PLATEFORMES[plateforme];
  const t = TONS[ton];
  const a = choisir(t.accroches);
  const accroche = remplir(a.texte, sujet, duree);
  const visuelAccroche = a.visuel + ' Texte à l\'écran dès la 1re image : beaucoup regardent sans le son.';
  const cta = choisir(t.cta);

  const segments = STRUCTURES[duree].map(([debut, fin, type]) => {
    const etape = (ton !== 'pedagogique' && ETAPES_RECIT[type]) || ETAPES[type];
    let texteEcran = etape.texteEcran || '';
    let montage = etape.montage;
    if (type === 'accroche') { texteEcran = accroche; montage = visuelAccroche; }
    if (type === 'cta') texteEcran = cta;

    return {
      debut,
      fin,
      etape: etape.nom,
      aMontrer: remplir(etape.aMontrer, sujet, duree),
      texteEcran,
      montage
    };
  });

  // 5 hashtags précis maximum (les génériques comme #reels ne servent à rien)
  const hashtags = [...new Set([...hashtagsDuSujet(sujet), ...t.hashtags])].slice(0, 5);

  return {
    sujet,
    plateforme: p.nom,
    duree,
    ton: t.nom,
    accroche,
    typeAccroche: a.type,
    visuelAccroche: a.visuel,
    rythme: t.rythme,
    segments,
    son: t.son,
    legende: remplir(choisir(t.legendes), sujet, duree) + '\n\n' + cta,
    hashtags,
    conseils: p.conseils
  };
}

// ---------------------------------------------------------------------------
// 4. LA ROUTE API
// ---------------------------------------------------------------------------

app.post('/api/plan', (req, res) => {
  const sujet = String(req.body.sujet || '').trim();
  const plateforme = String(req.body.plateforme || '');
  const duree = Number(req.body.duree);
  const ton = String(req.body.ton || '');

  if (sujet.length < 2 || sujet.length > 80) {
    return res.status(400).json({ erreur: 'Le sujet doit faire entre 2 et 80 caractères.' });
  }
  if (!PLATEFORMES[plateforme] || !STRUCTURES[duree] || !TONS[ton]) {
    return res.status(400).json({ erreur: 'Choix de plateforme, de durée ou de ton invalide.' });
  }

  res.json(genererPlan({ sujet, plateforme, duree, ton }));
});

app.listen(PORT, () => {
  console.log(`ScrollStop tourne sur http://localhost:${PORT}`);
});
