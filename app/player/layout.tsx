import type { Metadata } from "next";

import { MediaPlayerProvider } from "@/context/PlayerContext";


export const metadata: Metadata = {
    title: "Media Player",
    description: "Tetzaveh 2nd Aliyah",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <MediaPlayerProvider>
            {children}
        </MediaPlayerProvider>
    );
}
