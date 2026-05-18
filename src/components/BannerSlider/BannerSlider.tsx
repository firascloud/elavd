'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

type PropType = {
  banners: { id: string; image: string; image_responsive: string; link: string }[];
};

const BannerSlider: React.FC<PropType> = ({ banners }) => {
  const { locale } = useParams();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: true,
      dragThreshold: 8,
      duration: 30,
      direction: (locale as string).startsWith('en') ? 'ltr' : 'rtl',
    },
    [
      Autoplay({
        delay: 4000,
        playOnInit: true,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }),
    ]
  );

  return (
    <div className="size-full overflow-hidden" ref={emblaRef}>
      <div className="flex size-full">
        {banners.map((banner, index) => (
          <div className="flex-[0_0_100%]" key={banner.id || index}>
            <Link href={banner.link} className="relative block size-full">
              <Image
                className="hidden cursor-pointer object-cover md:block"
                src={banner.image}
                alt={`Banner ${index + 1}`}
                priority={index === 0}
                fill
                sizes="100vw"
              />
              <Image
                className="cursor-pointer object-cover md:hidden"
                src={
                  banner.image_responsive
                    ? banner.image_responsive
                    : banner.image
                }
                alt={`Banner ${index + 1}`}
                priority={index === 0}
                fill
                sizes="100vw"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
