import { Montserrat } from "next/font/google";
import "../../styles/globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: "500" });

// export const metadata = {
//   title: "SkyFluffy",
//   description:
//     "A SkyCrypt-Based project that mimics functionality of it. Personal Project of SnowyFluffy",
//   icons: {
//     icon: "/favicon.png",
//   },
//   openGraph: {
//     title: "SkyFluffy",
//     description:
//       "A SkyCrypt-Based project that mimics functionality of it. Personal Project of SnowyFluffy",
//     url: "https://skyfluffy.vercel.app",
//     siteName: "SkyFluffy",
//     images: [
//       {
//         url: "/favicon.png",
//         width: 1200,
//         height: 630,
//         alt: "Skyblock Website Preview",
//       },
//     ],
//   },
// };


export const viewport = {
  width: "device-width",
  "initial-scale": 1.0,
  "userScalable": true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
