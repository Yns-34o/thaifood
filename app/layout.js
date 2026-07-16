import './globals.css';

export const metadata = {
  title: 'Thaï Food 77 — Restaurant Thaïlandais d’Exception',
  description:
    'Thaï Food 77 — Restaurant thaïlandais authentique à Pontault-Combault. Curry, Pad Thaï, Tom Yum et bien plus, préparés à la commande.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" async></script>
      </head>
      <body className="noise">{children}</body>
    </html>
  );
}
