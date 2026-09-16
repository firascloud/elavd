import {
  BadgeCheck,
  Banknote,
  Building2,
  Gauge,
  ScanSearch,
  ShieldCheck,
  Store,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { moneyCountingSeo } from "@/seo/moneyCounting";

type Props = {
  locale: string;
  productCount: number;
};

export default function MoneyCountingSeoContent({ locale, productCount }: Props) {
  const isAr = locale === "ar";
  const content = moneyCountingSeo[isAr ? "ar" : "en"];

  const selectionPoints = isAr
    ? [
        {
          icon: Gauge,
          title: "سرعة العدّ وحجم العمل",
          text: "اختر سرعة وسعة تغذية تناسب عدد الأوراق النقدية التي تعالجها يومياً، خصوصاً في الفروع ونقاط التحصيل كثيرة الحركة.",
        },
        {
          icon: ScanSearch,
          title: "العدّ بالقيمة أو بالعدد",
          text: "بعض الأجهزة تحسب عدد الأوراق فقط، بينما تتعرّف أجهزة أخرى على الفئات المختلطة وتعرض القيمة الإجمالية للعملية.",
        },
        {
          icon: ShieldCheck,
          title: "تقنيات كشف التزوير",
          text: "راجع تقنيات الفحص التي يدعمها كل موديل، مثل الأشعة فوق البنفسجية والحبر المغناطيسي والأشعة تحت الحمراء.",
        },
        {
          icon: BadgeCheck,
          title: "الفرز وعدد الجيوب",
          text: "تساعد أجهزة الجيبين على فصل الورقة المرفوضة ومواصلة العدّ، بينما تناسب أجهزة الجيب الواحد الأعمال الأقل تعقيداً.",
        },
      ]
    : [
        {
          icon: Gauge,
          title: "Counting speed and workload",
          text: "Choose a counting speed and hopper capacity that match the number of banknotes processed each day, especially in busy branches and cash points.",
        },
        {
          icon: ScanSearch,
          title: "Piece or value counting",
          text: "Some machines count notes only, while mixed-denomination models identify each denomination and calculate the total value.",
        },
        {
          icon: ShieldCheck,
          title: "Counterfeit detection",
          text: "Check the detection methods supported by each model, including ultraviolet, magnetic, and infrared verification.",
        },
        {
          icon: BadgeCheck,
          title: "Sorting and pockets",
          text: "Two-pocket machines can separate rejected notes while counting continues; single-pocket models suit simpler daily workloads.",
        },
      ];

  const useCases = isAr
    ? [
        { icon: Building2, label: "البنوك وشركات الصرافة" },
        { icon: Store, label: "المتاجر ونقاط البيع" },
        { icon: Banknote, label: "الشركات ومراكز التحصيل" },
      ]
    : [
        { icon: Building2, label: "Banks and exchange offices" },
        { icon: Store, label: "Retail stores and points of sale" },
        { icon: Banknote, label: "Businesses and cash offices" },
      ];

  const faqs = isAr
    ? [
        {
          question: "ما الفرق بين ماكينة عدّ النقود وماكينة عدّ القيمة؟",
          answer:
            "ماكينة العدّ التقليدية تحسب عدد الأوراق، أما ماكينة عدّ القيمة فتتعرف على فئات العملة وتحسب القيمة الإجمالية، وقد تدعم عدّ الفئات المختلطة بحسب الموديل.",
        },
        {
          question: "هل تكشف جميع مكائن عدّ النقود العملات المزورة؟",
          answer:
            "ليست كل الأجهزة متساوية في قدرات الفحص. يجب مراجعة مواصفات الموديل والتأكد من تقنيات كشف التزوير والعملات التي يدعمها قبل الاختيار.",
        },
        {
          question: "كيف أختار ماكينة عدّ نقود مناسبة لنشاطي؟",
          answer:
            "ابدأ بحجم النقد اليومي، ونوع العملات، والحاجة إلى عدّ القيمة أو الفرز، وعدد الجيوب، ومستوى كشف التزوير المطلوب. يمكن لفريق إيلافد مساعدتك في مقارنة الموديلات المتاحة.",
        },
        {
          question: "هل تتوفر مكائن عدّ وفرز النقود للشركات في السعودية؟",
          answer:
            "يعرض هذا القسم موديلات مخصصة لاحتياجات مختلفة داخل السعودية، من العدّ اليومي في المتاجر إلى حلول الفرز والمعالجة النقدية للأعمال ذات الأحجام الأعلى.",
        },
      ]
    : [
        {
          question: "What is the difference between note counting and value counting?",
          answer:
            "A basic counter counts the number of notes. A value counter identifies denominations and calculates the total value, with some models supporting mixed-denomination counting.",
        },
        {
          question: "Do all money counters detect counterfeit notes?",
          answer:
            "Detection capabilities vary by model. Review the supported counterfeit-detection methods and currencies before choosing a machine.",
        },
        {
          question: "How do I choose the right money counting machine?",
          answer:
            "Consider daily cash volume, currencies, value-counting or sorting needs, number of pockets, and required detection level. Elavd can help compare available models.",
        },
        {
          question: "Are cash counting and sorting machines available in Saudi Arabia?",
          answer:
            "This category includes models for different Saudi business needs, from daily retail counting to higher-volume cash sorting and processing.",
        },
      ];

  return (
    <section
      className="mt-14 space-y-12 rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-8 lg:p-10"
      aria-labelledby="money-counting-guide-title"
    >
      <div className="max-w-4xl">
        <p className="mb-3 text-sm font-bold text-primary">
          {isAr ? `${productCount} منتجاً وحلاً متاحاً للمقارنة` : `${productCount} products and solutions to compare`}
        </p>
        <h2 id="money-counting-guide-title" className="font-cairo text-2xl font-black leading-tight text-foreground sm:text-3xl">
          {isAr ? "دليل اختيار ماكينة عدّ النقود المناسبة" : "How to choose a money counting machine"}
        </h2>
        <p className="mt-4 text-base font-medium leading-8 text-muted-foreground">
          {content.intro}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {selectionPoints.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-xl border border-border bg-muted/20 p-5 sm:p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <h3 className="font-cairo text-lg font-black text-foreground">{title}</h3>
            <p className="mt-2 text-sm font-medium leading-7 text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>

      <div>
        <h2 className="font-cairo text-xl font-black text-foreground sm:text-2xl">
          {isAr ? "من يستفيد من مكائن عدّ وفرز النقود؟" : "Who benefits from cash counting and sorting machines?"}
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {useCases.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border border-border px-4 py-4 text-sm font-bold text-foreground">
              <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-cairo text-xl font-black text-foreground sm:text-2xl">
          {isAr ? "أسئلة شائعة عن مكائن عدّ النقود" : "Money counting machine FAQs"}
        </h2>
        <div className="mt-5 divide-y divide-border rounded-xl border border-border">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group p-5 open:bg-muted/20">
              <summary className="cursor-pointer list-none font-cairo text-base font-black text-foreground marker:hidden">
                {question}
              </summary>
              <p className="mt-3 max-w-4xl text-sm font-medium leading-7 text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-foreground px-5 py-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <h2 className="font-cairo text-lg font-black">
            {isAr ? "تحتاج مساعدة في مقارنة الموديلات؟" : "Need help comparing models?"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-primary-foreground/70">
            {isAr
              ? "أرسل متطلبات عملك وسنساعدك في تحديد المواصفات المناسبة قبل طلب عرض السعر."
              : "Share your workload and requirements, and we will help identify the right specifications before you request a quote."}
          </p>
        </div>
        <Link
          href="/contact-us"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-6 text-sm font-black text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {isAr ? "تواصل مع فريق إيلافد" : "Contact Elavd"}
        </Link>
      </div>
    </section>
  );
}
