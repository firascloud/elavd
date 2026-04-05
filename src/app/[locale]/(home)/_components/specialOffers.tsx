"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getOffers, type Offer } from '@/services/home';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function SpecialOffers({ position }: { position: number }) {
    const locale = useLocale();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    const autoplay = useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: false }), []);
    const [emblaRef] = useEmblaCarousel({ 
        loop: true, 
        direction: locale === 'ar' ? 'rtl' : 'ltr',
        align: 'start'
    }, [autoplay]);

    useEffect(() => {
        const fetchOffersData = async () => {
            const data = await getOffers();
            setOffers(data.filter(o => o.position === position));
            setLoading(false);
        };
        fetchOffersData();
    }, [position]);

    if (loading || offers.length === 0) return null;

    if (position === 1) {
        return (
            <section className="w-full bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-4 md:gap-6">
                            {offers.map((offer) => (
                                <div 
                                    key={offer.id}  
                                    className="relative flex-[0_0_100%] sm:flex-[0_0_48%] lg:flex-[0_0_32%] min-w-0 aspect-[16/9] md:aspect-[4/3]  overflow-hidden "
                                >
                                    {offer.link ? (
                                        <Link href={offer.link as any} className="block w-full h-full relative">
                                            <Image
                                                src={offer.image_url}
                                                alt="Offer"
                                                fill
                                                className="object-contain group-hover:scale-105 transition-transform duration-1000"
                                                priority
                                            />
                                        </Link>
                                    ) : (
                                        <Image
                                            src={offer.image_url}
                                            alt="Offer"
                                            fill
                                            className="object-contain transition-transform duration-1000"
                                            priority
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (position === 2) {
        return (
            <>
                {offers.map((offer) => (
                    <section key={offer.id} className="w-full mt-10 pb-12 bg-white">
                        <div className="max-w-8xl mx-auto px-4">
                            <div className="relative w-full aspect-[21/9] md:aspect-[25/7] lg:aspect-[30/7]  overflow-hidden">
                                {offer.link ? (
                                    <Link href={offer.link as any} className="block relative w-full h-full">
                                         <Image
                                            src={offer.image_url}
                                            alt="Banner Offer"
                                            fill
                                            className="object-contain  transition-transform duration-1000"
                                        />
                                    </Link>
                                ) : (
                                    <Image
                                        src={offer.image_url}
                                        alt="Banner Offer"
                                        fill
                                        className="object-contain transition-transform duration-1000"
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                ))}
            </>
        );
    }

    return null;
}
