import { CartProvider } from '../components/CartContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Histoire from '../components/Histoire';
import Commander from '../components/Commander';
import Reserver from '../components/Reserver';
import Avis from '../components/Avis';
import Footer from '../components/Footer';
import Cart from '../components/Cart';

export default function Home() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <Histoire />
        <Commander />
        <Reserver />
        <Avis />
      </main>
      <Footer />
      <Cart />
    </CartProvider>
  );
}
