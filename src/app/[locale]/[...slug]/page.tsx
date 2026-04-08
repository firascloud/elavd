'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/logo.svg';
import Image from 'next/image';

const NotFoundPage = () => {
  const t = useTranslations('common');

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background overflow-hidden relative font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(242,133,56,0.02),transparent_70%)]" />
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
            opacity: [0.02, 0.06, 0.02]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
            opacity: [0.02, 0.06, 0.02]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        <div className='flex flex-col items-center justify-center'>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", damping: 15 }}
            className="relative mb-8"
          >
            <div className="text-[100px] md:text-[180px] font-black leading-none text-muted dark:text-accent/30 select-none tracking-tighter drop-shadow-sm">
              404
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-3 mb-10 text-center">
            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl md:text-4xl font-bold text-foreground tracking-tight"
            >
              <span className="text-primary">{t('PageNotFound').split(' ')[0]}</span> {t('PageNotFound').split(' ').slice(1).join(' ')}
            </motion.h1>

            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto leading-relaxed font-normal"
            >
              {t('PageNotFoundDescription')}
            </motion.p>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-xl px-8 h-12 text-sm font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
            >
              <Link href="/">
                <Home className="w-4 h-4 me-2" />
                {t('BackToHome')}
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto rounded-xl px-8 h-12 text-sm font-bold border-2 bg-transparent hover:bg-muted/50 dark:hover:bg-accent/20 hover:border-border dark:hover:border-border hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180" />
              {t('Cancel')}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
