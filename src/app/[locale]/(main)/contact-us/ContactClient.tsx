"use client";

import React, { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Mail, Phone, Send, Loader2 } from 'lucide-react';
import Image from 'next/image';
import PageHeader from '@/components/common/page-header';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { sendMessage } from '@/services/contactService';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function ContactClient() {
  const t = useTranslations('contact');
  const common = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const formRef = useRef<HTMLDivElement>(null);
  const { event, conversion } = useAnalytics();

  const schema = yup.object().shape({
    name: yup.string().required(isRtl ? 'الاسم مطلوب' : 'Name is required').min(3, isRtl ? 'يجب أن يكون الاسم 3 أحرف على الأقل' : 'Name must be at least 3 characters'),
    phone: yup.string().required(isRtl ? 'رقم الهاتف مطلوب' : 'Phone is required').matches(/^\d+$/, isRtl ? 'يجب أن يحتوي رقم الهاتف على أرقام فقط' : 'Phone must contain only digits'),
    email: yup.string().required(isRtl ? 'البريد الإلكتروني مطلوب' : 'Email is required').email(isRtl ? 'بريد إلكتروني غير صالح' : 'Invalid email'),
    message: yup.string().required(isRtl ? 'الرسالة مطلوبة' : 'Message is required').min(10, isRtl ? 'يجب أن تكون الرسالة 10 أحرف على الأقل' : 'Message must be at least 10 characters'),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {
    try {
      await sendMessage(data);
      
      // Trigger analytics ONLY on successful DB insert / submission
      event({
        action: 'generate_lead',
        category: 'Contact',
        label: 'Contact Us Form'
      });
      
      // Fallback conversion ID if not set in .env
      const conversionId = process.env.NEXT_PUBLIC_GADS_CONTACT_CONVERSION || 'AW-DEFAULT/CONTACT';
      conversion(conversionId, 1.0);

      // Send email notifications
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      toast.success(isRtl ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent successfully');
      reset();
    } catch (error) {
      console.error(error);
      toast.error(isRtl ? 'حدث خطأ أثناء إرسال الرسالة' : 'An error occurred while sending the message');
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const contactInfo = [
    {
      icon: <MapPin className="size-6 text-primary" />,
      title: t('address'),
      content: common('Address'),
      link: "https://www.google.com/maps/search/?api=1&query=Jabr+Bin+Rashid+Al+Murabba+Riyadh+12628+Saudi+Arabia",
    },
    {
      icon: <Mail className="size-6 text-primary" />,
      title: t('email'),
      content: "sales@elavd.com",
      link: "mailto:sales@elavd.com",
    },
    {
      icon: <Phone className="size-6 text-primary" />,
      title: t('phoneLabel1'),
      content: "0553202091",
      link: "tel:0553202091",
    },
    {
      icon: <Phone className="size-6 text-primary" />,
      title: t('phoneLabel2'),
      content: "0556482799",
      link: "tel:0556482799",
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Phone size={28} />}
      />

      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {contactInfo.map((info, idx) => (
            <a
              key={idx}
              href={info.link}
              target={info.link.startsWith('http') ? '_blank' : undefined}
              rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="bg-background border border-border rounded-[1.5rem] p-6 flex flex-col items-center text-center hover:shadow hover:shadow-muted/50 transition-all group cursor-pointer"
            >
              <div className="size-15 bg-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {info.icon}
              </div>
              <h3 className="text-lg font-black text-foreground mb-2 font-cairo">
                {info.title}
              </h3>
              <p className="text-muted-foreground text-[13px] leading-relaxed font-bold max-w-[180px]">
                {info.content}
              </p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 bg-muted/30 border border-border rounded-[2rem] p-10 flex flex-col items-center text-center justify-center space-y-8 group">
            <div className="relative w-full max-w-[220px] h-28 transform transition-transform group-hover:scale-105 duration-700">
              <Image
                src={require('@/assets/logo.svg')}
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-foreground font-cairo leading-tight">
                {t('speedSecurity')}
              </h2>
              <p className="text-muted-foreground text-sm leading-7 font-medium px-4">
                {t('description')}
              </p>
            </div>

            <button 
              onClick={scrollToForm}
              className="px-10 py-3.5  cursor-pointer bg-primary text-primary-foreground font-black text-sm rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 active:scale-95 uppercase tracking-widest"
            >
              {t('discoverMore')}
            </button>
          </div>

          <div ref={formRef} className="lg:col-span-7 bg-background border border-border rounded-[2rem] p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-8 border-b border-border pb-6 group">
              <div className="size-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <Mail size={20} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-black text-foreground font-cairo">
                  {t('title')}
                </h3>
                <p className="text-muted-foreground text-xs font-medium">
                  {t('subtitle')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block px-1">
                    {t('name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    {...register('name')}
                    placeholder={t('name')}
                    className={`w-full h-12 bg-muted/50 border ${errors.name ? 'border-destructive' : 'border-border'} rounded-xl px-5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs text-foreground font-bold`}
                  />
                  {errors.name && <p className="text-[10px] text-destructive font-bold px-1">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-phone" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block px-1">
                    {t('phone')}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    {...register('phone')}
                    placeholder={t('phone')}
                    className={`w-full h-12 bg-muted/50 border ${errors.phone ? 'border-destructive' : 'border-border'} rounded-xl px-5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs text-foreground font-bold`}
                  />
                  {errors.phone && <p className="text-[10px] text-destructive font-bold px-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block px-1">
                  {t('emailLabel')}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  {...register('email')}
                  placeholder="example@gmail.com"
                  className={`w-full h-12 bg-muted/50 border ${errors.email ? 'border-destructive' : 'border-border'} rounded-xl px-5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs text-foreground font-bold`}
                />
                {errors.email && <p className="text-[10px] text-destructive font-bold px-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block px-1">
                  {t('message')}
                </label>
                <textarea
                  id="contact-message"
                  {...register('message')}
                  rows={4}
                  placeholder={t('placeholder')}
                  className={`w-full bg-muted/50 border ${errors.message ? 'border-destructive' : 'border-border'} rounded-2xl p-5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs text-foreground font-bold resize-none`}
                />
                {errors.message && <p className="text-[10px] text-destructive font-bold px-1">{errors.message.message}</p>}
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  disabled={isSubmitting}
                  className="flex cursor-pointer items-center gap-3 px-12 py-3.5 bg-primary text-primary-foreground font-black rounded-xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/10 active:scale-95 group uppercase tracking-widest text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} className="group-hover:-translate-y-1 transition-transform" />
                  )}
                  <span>{isSubmitting ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : t('send')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

