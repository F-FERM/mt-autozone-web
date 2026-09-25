import { Toaster } from "sonner";
import HeroSection from "../component/hero/HeroSection";
import Footer from "../component/layout/Footer";
import Navbar from "../component/layout/Navbar";



export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    
      <Navbar
      
      />
   
      <div className="w-full">{children}  <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#1D1D1D",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            },
          }}
        /></div>
      <Footer/>
    </>
  );
}
