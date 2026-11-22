# ScrollStop

Décris ta vidéo, ScrollStop te donne un plan de montage prêt à suivre pour Reels, TikTok et Shorts : accroche, découpage seconde par seconde, son, légende, hashtags et conseils.

## Lancer en local

1. Installe Node.js (version 18 ou plus) : https://nodejs.org
2. Ouvre un terminal dans ce dossier, puis tape :

```
npm install
npm start
```

3. Va sur http://localhost:3000

## Mettre en ligne (GitHub + Render, gratuit)

1. Crée un dépôt sur https://github.com (bouton **New**), par exemple `scrollstop`.
2. Clique sur **uploading an existing file** et glisse tous les fichiers du projet (sauf `node_modules` s'il existe), puis **Commit changes**.
3. Va sur https://render.com, connecte-toi avec ton compte GitHub.
4. **New** → **Web Service** → choisis ton dépôt `scrollstop`.
5. Réglages :
   - Runtime : **Node**
   - Build Command : `npm install`
   - Start Command : `npm start`
   - Instance Type : **Free**
6. Clique sur **Deploy**. Après 1 à 2 minutes, ton site est en ligne sur une adresse du type `https://scrollstop.onrender.com`.

À chaque modification envoyée sur GitHub, Render remet le site à jour tout seul.

À savoir : en version gratuite, le site se met en veille après environ 15 minutes sans visite. Le premier chargement suivant peut prendre une trentaine de secondes.

## Modifier le contenu

Tout le savoir-faire (accroches, rythmes, sons, appels à l'action, légendes, conseils) se trouve en haut de `server.js`. Ajoute ou modifie des phrases dans les listes : l'appli en choisit une au hasard à chaque génération.
