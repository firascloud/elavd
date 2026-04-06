'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/dneest-logo.webp';
import Image from 'next/image';

const NotFoundPage = () => {
  const t = useTranslations('common');

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background overflow-hidden relative font-sans">
      {/* Background Decorative Elements - More premium layering */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(242,133,56,0.03),transparent_70%)]" />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Logo with Branding */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <Link href="/">
              <Image 
                src={Logo} 
                alt="Dubai Network IT" 
                width={160} 
                height={50} 
                className="h-auto w-40 opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-pointer"
              />
            </Link>
          </motion.div>

          {/* Animated Illustration Area */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", damping: 15 }}
            className="relative mb-14"
          >
            <div className="text-[140px] md:text-[240px] font-black leading-none text-slate-200 dark:text-slate-900/40 select-none tracking-tighter drop-shadow-sm">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center pt-8">
              <motion.div
                animate={{
                  rotate: [0, 3, -3, 0],
                  y: [0, -12, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="relative z-10 bg-white/40 dark:bg-black/40 backdrop-blur-md p-6 rounded-full shadow-2xl border border-white/50 dark:border-white/10">
                  <Search className="w-20 h-20 md:w-32 md:h-32 text-primary drop-shadow-xl" strokeWidth={1} />
                </div>
                {/* Decorative pulse effect behind icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse" />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-5 mb-12">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-6xl font-black text-foreground tracking-tight"
            >
              <span className="text-primary">{t('PageNotFound').split(' ')[0]}</span> {t('PageNotFound').split(' ').slice(1).join(' ')}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto leading-relaxed font-medium"
            >
              {t('PageNotFoundDescription')}
            </motion.p>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-2xl px-12 h-16 text-base font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1.5 transition-all duration-300"
            >
              <Link href="/">
                <Home className="w-5 h-5 me-3" />
                {t('BackToHome')}
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto rounded-2xl px-12 h-16 text-base font-black border-2 bg-transparent hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 me-3 rtl:rotate-180" />
              {t('Cancel')}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
