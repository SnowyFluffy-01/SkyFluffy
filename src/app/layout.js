import { Montserrat } from "next/font/google";
import "../../styles/globals.css";



const montserrat = Montserrat({ subsets: ["latin"],
  weight:'500'

});

export const metadata = {
  title: "SkyFluffy",
  description: "A SkyCrypt-Based project that mimics functionality of it. Personal Project of SnowyFluffy",
 
};

export const viewport = {
  width: 'device-width',
  initialScale:1,
  userScalable: true,

}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
       
        {children}
        
        </body>
    </html>
  );
}
