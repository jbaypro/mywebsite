# Site vitrine — Jules Bayer

Site statique, un seul fichier (`index.html`), bilingue FR/EN, sans dépendance serveur.

## Mise en ligne sur GitHub Pages (5 minutes)

1. Sur github.com, créer un dépôt **public** nommé exactement `<ton-identifiant>.github.io`
   (ex. `jules-bayer.github.io`). Ne pas cocher « Add a README ».
2. Déposer les fichiers de ce dossier à la racine du dépôt :
   - via l'interface web : *Add file → Upload files*, glisser `index.html`, `.nojekyll`, `README.md`, puis *Commit changes* ;
   - ou en ligne de commande :
     ```bash
     git init
     git add .
     git commit -m "Site vitrine"
     git branch -M main
     git remote add origin https://github.com/<ton-identifiant>/<ton-identifiant>.github.io.git
     git push -u origin main
     ```
3. Dans le dépôt : *Settings → Pages → Build and deployment* : Source = **Deploy from a branch**, Branch = **main** / **/ (root)**, *Save*.
4. Attendre 1 à 2 minutes. Le site est en ligne sur `https://<ton-identifiant>.github.io`.
   Chaque modification poussée sur `main` est redéployée automatiquement.

## Avant de publier

- Remplacer les placeholders en pointillés dans `index.html` (chercher `class="todo"`) : dates, nombre de comptes, email, LinkedIn.
- Déposer ton CV sous le nom `CV_Jules_Bayer.pdf` à la racine : le bouton « Télécharger le CV » pointe dessus.
- Les textes existent en deux versions : `<span class="fr">…</span>` et `<span class="en">…</span>`. Modifier les deux.

## Nom de domaine (plus tard)

1. Acheter le domaine (OVH, Gandi, Infomaniak…).
2. Chez le registrar, ajouter un enregistrement **CNAME** : `www` → `<ton-identifiant>.github.io`,
   et pour la racine quatre enregistrements **A** vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
3. Dans *Settings → Pages → Custom domain*, saisir `www.tondomaine.fr`, cocher **Enforce HTTPS**.
   GitHub crée alors un fichier `CNAME` dans le dépôt ; le laisser.

## Tracking (optionnel)

Coller l'extrait GTM dans `index.html` : la partie `<script>` juste après `<head>`, la partie `<noscript>` juste après `<body>`.
Brancher la CMP via GTM avec Consent Mode v2 (defaults `denied`). Ne pas poser de tag avant consentement.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Le site complet : HTML, CSS, JS, textes FR et EN |
| `.nojekyll` | Indique à GitHub Pages de servir les fichiers tels quels (sans traitement Jekyll) |
| `README.md` | Cette notice |

## Consentement et tracking (en place)

- **CMP** : tarteaucitron 1.37.0, auto-hébergé dans `tarteaucitron/` (licence MIT, fichier `LICENSE`). Seuls les fichiers utiles sont embarqués : script minifié, services, langues FR/EN, CSS.
- **Ordre dans le `<head>`** : 0) `gtag('consent','default', …)` tout « denied » → 1) tarteaucitron (`googleConsentMode: true`, service `gcmanalyticsstorage`) → 2) GTM `GTM-PG57T4KN`. Ne pas changer cet ordre.
- **Fenêtre de consentement** : centrée, page floutée, défilement et navigation bloqués (attribut `inert`) tant qu'aucun choix n'est fait. « Tout accepter » et « Tout refuser » ont le même poids visuel.
- **Langue de la CMP** : toujours celle du site (langue enregistrée par le switch FR/EN, sinon celle du navigateur). Pendant la fenêtre de consentement, le header reste au-dessus du voile : le switch FR/EN y est actif et recharge la page dans la nouvelle langue ; le reste (menu, contenu, footer) est inerte. « Gestion des cookies » recharge aussi la page si la langue du site a changé depuis, puis rouvre le panneau.
- **Mise à jour du consentement** : « Tout accepter » → `consent update {analytics_storage: 'granted'}` ; « Tout refuser » → reste `denied`. Lien « Gestion des cookies » dans le footer pour rouvrir le panneau.
- **Événements dataLayer** poussés par le site :
  - `virtual_page_view` (`page_id`, `page_location`, `page_title`) à chaque changement de page du menu (pas au premier chargement : le page_view GA4 le couvre) ;
  - `language_switch` (`language`) ;
  - `contact_click` (`contact_method` : email / linkedin / github, `link_location` : footer / contact_page). L'adresse email n'est jamais envoyée.
- Pour ajouter un service plus tard (Clarity, Hotjar…) : ajouter son fichier de service si besoin et `tarteaucitron.job.push('<service>')`.
