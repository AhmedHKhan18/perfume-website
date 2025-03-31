import localFont from "next/font/local";
import "./globals.css";
import Header from './components/Header'
import Footer from './components/Footer'
import { AppProvider } from "@/context/Appcontext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "AS Fragrance",
  description: "Experience the essence of luxury and victory with A.S Fragnance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
    <AppProvider>
    <Header />
        {children}
    <Footer />
    </AppProvider>
      </body>
    </html>
  );
}
