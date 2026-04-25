import React from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Logo from '@/assets/money-safe-security-cash-protection.svg';
import card1 from '@/assets/card-printer-ribbon-accessories.svg';
import card2 from '@/assets/magnetic-plastic-cards-high-quality.svg';
import card3 from '@/assets/plastic-card-printer-primacy-lava.svg';

export default function SpecialOffers({ position }: { position: number }) {
    const locale = useLocale();
    const altText = locale === 'ar'
        ? "خزنة أموال آمنة لحماية النقود والأصول"
        : "secure money safe for cash protection";
    
    const cardImages = [card1, card2, card3];
    const cardAlts = locale === 'ar'
        ? ["شرائط وطابعات بطاقات ملحقات", "بطاقات بلاستيكية مغناطيسية عالية الجودة", "طابعة بطاقات بلاستيكية بريماسي لافا"]
        : ["card printer ribbon accessories", "magnetic plastic cards high quality", "plastic card printer primacy lava"];
    const cardLinks = ["/store/card-printers", "/store/card-printers", "/store/card-printers"];

    if (position === 1) {
        return (
            <section className="w-full bg-background mt-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {[0, 1, 2].map((index) => (
                            <div 
                                key={index}  
                                className="relative w-full aspect-[16/9] md:aspect-[4/3] overflow-hidden group"
                            >
                                <Link href={cardLinks[index]} className="block w-full h-full relative">
                                    <Image
                                        src={cardImages[index]}
                                        alt={cardAlts[index]}
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-1000"
                                        priority
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (position === 2) {
        return (
            <section className="w-full mt-10 pb-12 bg-background">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative w-full aspect-[21/9] md:aspect-[25/7] lg:aspect-[30/7] overflow-hidden group">
                        <Link href="/store/steel-security-safes" className="block relative w-full h-full">
                             <Image
                                src={Logo}
                                alt={altText}
                                fill
                                className="object-contain group-hover:scale-[1.02] transition-transform duration-1000"
                            />
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return null;
}
