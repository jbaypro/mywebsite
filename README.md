# Site vitrine — Data & Digital Analytics

Site statique multi-pages, bilingue FR/EN, hébergé sur GitHub Pages. Volontairement anonyme (ni nom, ni email, employeurs anonymisés) et non référencé.

## Pages

| Fichier | Page | Particularité |
| --- | --- | --- |
| `index.html` | Accueil | fond animé « flux de données », fiche profil animée (une fois par session) ; redirige les anciens liens `index.html#about`… vers les vraies pages |
| `about.html` | À propos | explosion de poudre blanche à l'ouverture |
| `expertise.html` | Expertises | fond grille sobre |
| `experience.html` | Parcours | fond grille sobre |
| `work.html` | Réalisations | fond grille sobre |
| `contact.html` | Contact | LinkedIn et GitHub uniquement |

Chaque page contient deux versions des textes : `<span class="fr">…</span>` et `<span class="en">…</span>`. Modifier les deux. Le header et le footer sont répétés dans chaque page : une modification du menu se fait dans les six fichiers.

## Fichiers partagés

| Fichier | Rôle |
| --- | --- |
| `assets/site.css` | styles de tout le site |
| `assets/consent-default.js` | Consent Mode v2 : valeurs par défaut (tout « denied »), langue de la CMP |
| `assets/cmp.js` | init tarteaucitron + service `ga4consent` |
| `assets/site.js` | switch FR/EN (mémorisé), menu mobile, blocage de la page tant que la CMP n'a pas de réponse, suivi des clics de contact |
| `assets/home.js` | accueil : fond animé + animation d'arrivée |
| `assets/about.js` | à propos : explosion de poudre |
| `tarteaucitron/` | CMP tarteaucitron 1.37.0 auto-hébergée (licence MIT) : script, services, langues FR/EN, CSS |

## Consentement et tracking

- **Ordre dans le `<head>` de chaque page** : 0) `assets/consent-default.js` (seul `consent default`) → 1) `tarteaucitron.min.js` puis `assets/cmp.js` (`googleConsentMode: false`, sinon tarteaucitron envoie un second défaut tardif) → 2) GTM `GTM-PG57T4KN`. Ne pas changer cet ordre.
- **Fenêtre de consentement** : centrée, page floutée, défilement et navigation bloqués tant qu'aucun choix n'est fait. « Tout accepter » et « Tout refuser » ont le même poids visuel. Lien « Gestion des cookies » dans le footer.
- **Langue de la CMP** : toujours celle du site. Pendant la fenêtre, le switch FR/EN du header reste actif et recharge la page dans la nouvelle langue.
- **Événements dataLayer** :
  - `cmp_consent_update` (`analytics_storage` : granted / denied) : au clic et à chaque chargement si un choix est mémorisé ; rien tant que le visiteur n'a pas choisi ;
  - `language_switch` (`language`) ;
  - `contact_click` (`contact_method` : linkedin / github, `link_location` : footer / contact_page).
- Chaque page est une vraie URL : le `page_view` GA4 standard suffit (plus de `virtual_page_view`).

## Non-référencement (volontaire)

- Balises `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">` (+ `googlebot`, `bingbot`) dans chaque page.
- **Ne pas** ajouter de `robots.txt` qui bloquerait l'exploration : un robot qui ne peut pas lire la page ne voit pas le `noindex`.
- Pas de sitemap, pas de propriété Search Console.
