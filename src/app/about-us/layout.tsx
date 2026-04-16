import { Metadata } from "next";


export const metadata: Metadata = {
    
}

export default function AboutUsPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            {children}
        </main>
    );
};