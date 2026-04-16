import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import Header from './components/Header'
import Footer from './components/Footer'
import { AppProvider } from "@/context/Appcontext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata = {
  title: "A.S Fragrance | Luxury Perfumes",
  description: "Experience the essence of luxury and victory with A.S Fragrance",
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
      </head>
      <body className={`${playfair.variable} ${jost.variable} font-jost antialiased bg-[#0a0a0a] text-white`}>
        <AppProvider>
          <Header />
          <main className="pt-[calc(2.5rem+4rem)]">
            {children}
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="dark"
            toastStyle={{
              backgroundColor: '#111',
              color: '#fff',
              border: '1px solid #2a2a2a',
              borderLeft: '3px solid #C9A96E',
              fontFamily: 'var(--font-jost)',
              fontSize: '13px',
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
