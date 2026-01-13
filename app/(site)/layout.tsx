import "../styles/globals.css";
import AmplitudeInitializer from "../components/Helpers/AmplitudeInitializer";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import {Toaster} from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-base-100 text-base-content">
      <AmplitudeInitializer />
        <Navbar />
        <main className="container mx-auto px-4 lg:px-8 py-8 min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
