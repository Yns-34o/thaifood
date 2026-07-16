# Thaï Food 77 — Site Next.js

Site du restaurant thaïlandais **Thaï Food 77**, construit avec **Next.js 14** (App Router) + **Tailwind CSS**.
Inclut un **dashboard administrateur** pour gérer la carte en temps réel.

## 🚀 Lancer le site (le plus simple)

Double-cliquez sur **`lancer.bat`**.

- Au premier lancement, il installe automatiquement les dépendances (quelques minutes).
- Il démarre ensuite le serveur et ouvre le site dans votre navigateur à **http://localhost:3000**.
- Pour arrêter : fermez la fenêtre noire ou appuyez sur `Ctrl + C`.

> Pré-requis : [Node.js](https://nodejs.org) doit être installé (version LTS).

```bash
npm install      # la première fois seulement
npm run dev      # démarre le serveur de développement
```

## 🔐 Dashboard administrateur

Adresse : **http://localhost:3000/admin**

| | |
|---|---|
| Identifiant | `adminthaifood` |
| Mot de passe | `meilleurthai77` |

Depuis le dashboard, vous pouvez :

- **Plats** : créer, modifier (nom, prix, image, description, badge, catégorie, ordre), masquer/afficher ou supprimer un plat. L'image peut être **une URL** ou **un fichier uploadé** depuis l'ordinateur.
- **Catégories** : créer, renommer, réordonner ou supprimer des catégories (par défaut : Entrées, Plats principaux, Desserts, Boissons).
- **Promotions** : créer une promo **en pourcentage** (ex. -20 %) ou **à prix fixe** (ex. 12 €), applicable à **tous les plats**, à **une catégorie**, ou à **un plat précis**. L'ancien prix est barré sur le site et la remise est appliquée dans le panier.

> ⏱ **Temps réel** : toute modification apparaît sur le site sans rechargement (le menu se rafraîchit automatiquement toutes les 15 s et au retour sur l'onglet).

### Changer les identifiants (optionnel)

Par défaut les identifiants sont `adminthaifood` / `meilleurthai77`.
Pour les modifier, créez un fichier **`.env.local`** à la racine (voir `.env.example`) :

```
ADMIN_USERNAME=mon-nouveau-identifiant
ADMIN_PASSWORD=mon-nouveau-mot-de-passe
```

## 🏗️ Production

```bash
npm run build    # génère la version optimisée
npm run start    # démarre le serveur de production
```

## 📁 Structure du projet

```
thai food/
├── app/
│   ├── layout.js            # Structure HTML, polices, script Iconify
│   ├── page.js              # Page publique (assemble les sections)
│   ├── globals.css          # Styles
│   ├── admin/page.js        # 🟠 Page du dashboard admin (/admin)
│   └── api/                 # 🟠 Routes API (auth, menu public, CRUD admin, upload)
├── components/
│   ├── Navbar / Hero / Histoire / Commander / Reserver / Avis / Footer / Cart
│   ├── CartContext.js       # État du panier
│   ├── useMenu.js           # 🟠 Récupération du menu (temps réel, Firebase-ready)
│   ├── useReveal.js / Img.js
│   └── admin/               # 🟠 Interface du dashboard (AdminApp, managers, UI)
├── lib/                     # 🟠 Cœur métier
│   ├── store.js             # 🟠 Accès aux données (Firebase-ready)
│   ├── auth.js              # 🟠 Authentification admin
│   └── pricing.js           # 🟠 Calcul des prix / promos
├── data/menu.json           # 🟠 Données de la carte (plats, catégories, promos)
├── public/uploads/          # 🟠 Images uploadées depuis le dashboard
├── lancer.bat               # Lance le site sur localhost
└── package.json
```

## 🔥 Passer à Firebase (plus tard)

Aujourd'hui, les données sont stockées dans **`data/menu.json`** (fichier local). La structure est **prête pour Firebase** : seuls **deux fichiers** sont à modifier.

### 1. Données → Firestore

Remplacez le contenu de **`lib/store.js`** par des appels Firestore, en conservant **exactement les mêmes fonctions exportées** (`getMenu`, `getDishes`, `getCategories`, `getPromos`, `saveDish`, `deleteDish`, `saveCategory`, `deleteCategory`, `savePromo`, `deletePromo`). Routes API, dashboard et affichage public restent inchangés.

Suggestion de collections : `categories`, `dishes`, `promos` (documents = objets actuels).

### 2. Temps réel → Firestore `onSnapshot`

Dans **`components/useMenu.js`**, remplacez le polling par un listener `onSnapshot` sur les collections. Le composant `Commander.js` ne change pas (même interface de retour).

### 3. (Optionnel) Authentification → Firebase Auth

`lib/auth.js` peut être remplacé par Firebase Auth (Email/Password). Les routes admin vérifient déjà la session via `verifySession(req)` : il suffit d'adapter cette fonction.

## ✨ Fonctionnalités

- 🛒 Panier complet (ajout, quantités, suppression, total, confirmation)
- 📅 Formulaire de réservation avec confirmation
- 📱 Menu mobile + design responsive
- 🎬 Animations au défilement
- ⭐ Carrousel d'avis clients
- 🟠 Dashboard admin temps réel (plats, catégories, promos)
