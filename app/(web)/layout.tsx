import HeroSection from "../component/hero/HeroSection";
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
   
      <div className="w-full">{children}</div>
      {/* <Footer/> */}
    </>
  );
}
