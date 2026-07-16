# Thaï Food 77 — Site Next.js

Site du restaurant thaïlandais **Thaï Food 77**, reconstruit avec **Next.js 14** (App Router) + **Tailwind CSS**.

## 🚀 Lancer le site (le plus simple)

Double-cliquez sur **`lancer.bat`**.

- Au premier lancement, il installe automatiquement les dépendances (quelques minutes).
- Il démarre ensuite le serveur et ouvre le site dans votre navigateur à **http://localhost:3000**.
- Pour arrêter : fermez la fenêtre noire ou appuyez sur `Ctrl + C`.

> Pré-requis : [Node.js](https://nodejs.org) doit être installé sur l'ordinateur (version LTS).

## 🧩 Lancer manuellement (ligne de commande)

```bash
npm install      # seulement la première fois
npm run dev      # démarre le serveur de développement
```

Puis ouvrez **http://localhost:3000**.

## 🏗️ Construire pour la production

```bash
npm run build    # génère la version optimisée
npm run start    # démarre le serveur de production
```

## 📁 Structure du projet

```
thai food/
├── app/
│   ├── layout.js        # Structure HTML, polices, script Iconify
│   ├── page.js          # Page principale (assemble les sections)
│   └── globals.css      # Tous les styles du site
├── components/
│   ├── Navbar.js        # Barre de navigation + menu mobile
│   ├── Hero.js          # Section d'accueil
│   ├── Histoire.js      # Section "Notre Histoire"
│   ├── Commander.js     # Carte des plats (+ ajout au panier)
│   ├── Reserver.js      # Formulaire de réservation
│   ├── Avis.js          # Carrousel des témoignages
│   ├── Footer.js        # Pied de page
│   ├── Cart.js          # Panier coulissant + commande
│   ├── CartContext.js   # Gestion de l'état du panier
│   ├── useReveal.js     # Animations d'apparition au scroll
│   └── Img.js           # Image avec fondu au chargement
├── lancer.bat           # 🟢 Lance le site sur localhost
├── tailwind.config.js   # Couleurs (th, gold, cream) + polices
├── postcss.config.mjs
├── next.config.mjs
└── package.json
```

## ✨ Fonctionnalités

- 🛒 Panier complet (ajout, quantités, suppression, total, confirmation)
- 📅 Formulaire de réservation avec confirmation
- 📱 Menu mobile + design responsive
- 🎬 Animations au défilement
- ⭐ Carrousel d'avis clients
