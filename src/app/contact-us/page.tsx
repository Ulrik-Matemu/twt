'use client';
import { motion } from "framer-motion";

export default function ContactUsPage() {
    return (
        <>
             <section className="relative h-screen min-h-[700px] w-full flex items-center overflow-hidden bg-[#0a0f0a]">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/blackbuck-antelope.jpg"
                        alt="Tanzania Wildlife"
                        className="w-full h-full object-cover opacity-80 grayscale-[0.1]"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-16">
                    {/* Left Content */}
                    <div className="lg:col-span-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-white text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-"
                        >
                            Contact <span className="font-bold">US.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-8 text-gray-300 text-lg md:text-xl max-w-xl font-semilight leading-relaxed"
                        >
                            Humane capture, veterinary support, and specialized relocation services
                            across East Africa. Professional training for the next generation of
                            wildlife guardians.
                        </motion.p>


                    </div>


                </div>
            </section>
        </>
    )
}