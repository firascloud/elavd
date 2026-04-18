"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useTranslations, useLocale } from 'next-intl'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { orderService, OrderItem, OrderData } from '@/services/orderService'
import { emailService } from '@/services/emailService'

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  product?: {
    id: string
    name_ar: string | null
    name_en: string | null
    price?: number | null
  }
  items?: any[]
}

const countries = [
  { code: '+966', flag: '🇸🇦', name: 'KSA' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
]

export default function QuoteModal({ isOpen, onClose, product, items }: QuoteModalProps) {
  const t = useTranslations('common')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+966',
    city: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (formData.name.trim().length < 3) {
      toast.error(isAr ? 'الاسم يجب أن يكون 3 أحرف على الأقل' : 'Name must be at least 3 characters')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error(isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email')
      return
    }

    if (!/^\d{7,12}$/.test(formData.phone)) {
      toast.error(isAr ? 'يرجى إدخال رقم هاتف صحيح (7-12 رقم)' : 'Please enter a valid phone number (7-12 digits)')
      return
    }

    if (formData.city.trim().length < 2) {
      toast.error(isAr ? 'يرجى إدخال المدينة' : 'Please enter your city')
      return
    }

    if (formData.message.trim().length < 5) {
      toast.error(isAr ? 'يرجى كتابة سؤالك بوضوح' : 'Please write your question clearly')
      return
    }

    setLoading(true)

    try {
      const orderItems: OrderItem[] = product
        ? [{
          product_id: product.id,
          name_ar: product.name_ar || '',
          name_en: product.name_en || '',
          quantity: 1, // Default to 1 as quantity field is removed from simplified form
          price: product.price || 0
        }]
        : items?.map(item => ({
          product_id: item.id,
          name_ar: item.name_ar || '',
          name_en: item.name_en || '',
          quantity: item.quantity,
          price: item.price || 0
        })) || []

      const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

      const orderData: OrderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: `${formData.countryCode}${formData.phone}`,
        address: formData.city,
        notes: formData.message,
        total: totalPrice,
        subtotal: totalPrice,
        status: 'pending',
        payment_method: 'quote'
      }

      await orderService.createOrder(orderData, orderItems)

      // Send email notifications
      try {
        const emailParams = {
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`,
          city: formData.city,
          message: formData.message,
          total: totalPrice,
          items: orderItems.map(i => `${i.name_en || i.name_ar} (x${i.quantity})`).join(', '),
          product_name: product ? (locale === 'ar' ? product.name_ar : product.name_en) : (locale === 'ar' ? 'سلة التسوق' : 'Cart items'),
        };

        // 1. Notify Admin
        await emailService.sendOrderNotification(emailParams);

        // 2. Optional: Send confirmation to customer if you have a separate template
        // await emailService.sendCustomerConfirmation(emailParams, 'YOUR_CUSTOMER_TEMPLATE_ID');
        
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      toast.success(t('QuoteSuccess'))
      setFormData({ name: '', email: '', phone: '', countryCode: '+966', city: '', message: '' })
      onClose()
    } catch (error) {
      console.error(error)
      toast.error(t('QuoteError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-md border-none shadow-md max-h-[90vh] flex flex-col">
        <div className="bg-foreground px-8 py-4 lg:px-10 lg:py-6 text-primary-foreground relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

          <button
            onClick={onClose}
            className="absolute cursor-pointer top-6 right-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-primary-foreground/50 hover:text-primary-foreground"
          >
            <X size={20} />
          </button>

          <DialogTitle className="text-2xl font-black font-cairo text-center relative z-10">
            {isAr ? 'طلب استشارة / عرض سعر' : 'Quote / Consultation Request'}
          </DialogTitle>
          <p className="text-[10px] text-primary-foreground/60 text-center uppercase ltr:tracking-[0.2em] mt-2 font-black relative z-10">
            {isAr ? 'تواصل معنا وسيتم الرد عليك في أقرب وقت' : 'Contact us and we will reply as soon as possible'}
          </p>
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-6 bg-background" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="space-y-2">
              <label className="text-[13px] font-black uppercase text-muted-foreground block px-1">
                {isAr ? 'الاسم' : 'Name'}
              </label>
              <Input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={isAr ? 'اسمك بالكامل' : 'Your full name'}
                className="h-12 rounded-lg bg-muted/30 border-border focus:bg-background focus:ring-0 transition-all px-6 text-sm font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ltr:tracking-widest text-muted-foreground block px-1">
                {isAr ? 'بريدك الالكتروني' : 'Your Email'} *
              </label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@mail.com"
                className="h-12 rounded-lg bg-muted/30 border-border focus:bg-background focus:ring-0 transition-all px-6 text-sm font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ltr:tracking-widest text-muted-foreground block px-1">
                {isAr ? 'المدينة' : 'City'} *
              </label>
              <Input
                required
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                placeholder={isAr ? 'المدينة' : 'Your city'}
                className="h-12 rounded-lg bg-muted/30 border-border focus:bg-background focus:ring-0 transition-all px-6 text-sm font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ltr:tracking-widest text-muted-foreground block px-1">
                {isAr ? 'هاتف' : 'Phone'}
              </label>
              <div className="flex gap-2">
                <Select
                  value={formData.countryCode}
                  onValueChange={(val) => setFormData({ ...formData, countryCode: val })}
                >
                  <SelectTrigger className="h-12 w-[110px] cursor-pointer py-6 hover:bg-muted/30 rounded-lg bg-muted/30 border-border focus:ring-0 px-3 text-sm font-bold flex shrink-0">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{countries.find(c => c.code === formData.countryCode)?.flag}</span>
                        <span>{formData.countryCode}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-background cursor-pointer rounded-xl border-border shadow-xl overflow-hidden min-w-[140px]">
                    {countries.map((country) => (
                      <SelectItem
                        key={country.code}
                        value={country.code}
                        className="py-3 px-4 focus:bg-primary/5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{country.flag}</span>
                          <span className="font-bold text-sm text-muted-foreground">{country.code}</span>
                          <span className="text-[10px] text-muted-foreground/50 font-medium uppercase ltr:tracking-wider">{country.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="5xxxxxxxx"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 rounded-lg bg-muted/30 border-border focus:bg-background focus:ring-0 transition-all px-6 text-sm font-bold flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ltr:tracking-widest text-muted-foreground block px-1">
                {isAr ? 'سؤالك' : 'Your Question'} *
              </label>
              <Textarea
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="min-h-[120px] rounded-lg bg-muted/30 border-border focus:bg-background focus:ring-0 transition-all p-6 text-sm font-bold resize-none"
                placeholder={isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-16 rounded-2xl border-border font-black uppercase ltr:tracking-[0.2em] text-[10px] hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-95"
              >
                {t('Close')}
              </Button>
              <Button
                disabled={loading}
                className="flex-[2] h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase ltr:tracking-[0.2em] text-[10px] rounded-2xl transition-all shadow-primary/20 active:scale-95 disabled:grayscale"
              >
                {loading ? (isAr ? 'جاري الإرسال...' : 'Sending...') : t('SendRequest')}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
