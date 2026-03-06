import Toaster from "@rahoot/web/components/Toaster"
import { SocketProvider } from "@rahoot/web/contexts/socketProvider"
import type { Metadata } from "next"
import { Bebas_Neue, DM_Sans, Montserrat } from "next/font/google"
import { PropsWithChildren } from "react"
import "./globals.css"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
})

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Preston Palace Quiz",
  icons: "/icon.png",
}

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang="en" suppressHydrationWarning={true} data-lt-installed="true">
    <body className={`${montserrat.variable} ${dmSans.variable} ${bebasNeue.variable} bg-secondary antialiased`}>
      <SocketProvider>
        <main className="text-base-[8px] flex flex-col">{children}</main>
        <Toaster />
      </SocketProvider>
    </body>
  </html>
)

export default RootLayout
