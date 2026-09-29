import { BadgeCheck, Banknote, Building2, Gauge, ScanSearch, ShieldCheck, Store } from "lucide-react";
import { Link } from "@/i18n/routing";
import { htmlToPlainText } from "@/lib/text";
import type { Product } from "@/services/productService";

type Props = { locale: string; products: Product[] };

// Claims are displayed only while the current product description contains the source wording.
const modelFacts = [
  { slug: "kisan-k2-money-counting-machine", model: "KISAN K2", evidence: ["لعد وفرز النقود", "تقنية الجيبين (1+1)"], functionAr: "عد وفرز النقود", functionEn: "Note counting and sorting", detailAr: "جيبان (1+1)", detailEn: "Two pockets (1+1)" },
  { slug: "kisan-newton-3f-money-counting-machine", model: "KISAN NEWTON 3F", evidence: ["لعد وفرز النقود", "تقييم جودة الأوراق"], functionAr: "عد وفرز النقود", functionEn: "Note counting and sorting", detailAr: "تقييم جودة الأوراق", detailEn: "Note quality assessment" },
  { slug: "kisan-fin-7900-money-counting-machine", model: "KISAN FIN-7900", evidence: ["لعد القيم المختلطة", "قراءة الأرقام التسلسلية"], functionAr: "عد القيم المختلطة", functionEn: "Mixed-denomination value counting", detailAr: "قراءة الأرقام التسلسلية", detailEn: "Serial-number reading" },
  { slug: "hitachi-hi110-money-counting-machine", model: "Hitachi HI-110", evidence: ["ماكينة عد النقود", "كشف تزوير"], functionAr: "عد النقود", functionEn: "Note counting", detailAr: "كشف التزوير مذكور في الوصف", detailEn: "Counterfeit detection mentioned in description" },
  { slug: "cassida-xpecto-money-counting-machine", model: "Cassida Xpecto", evidence: ["العد المختلط وفرز العملات", "كشف تزوير"], functionAr: "العد المختلط وفرز العملات", functionEn: "Mixed-denomination counting and sorting", detailAr: "كشف التزوير مذكور في الوصف", detailEn: "Counterfeit detection mentioned in description" },
  { slug: "ribao-bc-55", model: "RIBAO BC-55", evidence: ["لعد وفرز العملات الورقية", "التعرف التلقائي على العملات"], functionAr: "عد وفرز العملات الورقية", functionEn: "Banknote counting and sorting", detailAr: "التعرف التلقائي على العملات", detailEn: "Automatic currency recognition" },
  { slug: "nv-money-counting-machine", model: "NV / NEWTON", evidence: ["عد مختلط"], functionAr: "عد مختلط", functionEn: "Mixed-denomination counting", detailAr: "راجع مواصفات المنتج", detailEn: "Check product specifications" },
] as const;

export default function MoneyCountingSeoContent({ locale, products }: Props) {
  const isAr = locale === "ar";
  const rows = modelFacts.flatMap((fact) => {
    const product = products.find((item) => item.slug_en === fact.slug);
    const description = htmlToPlainText(product?.short_desc_ar);
    return product?.slug_en && fact.evidence.every((phrase) => description.includes(phrase))
      ? [{ ...fact, product }]
      : [];
  });
  const matched = (slug: string) => rows.find((row) => row.product.slug_en === slug)?.product;
  const k2 = matched("kisan-k2-money-counting-machine");
  const fin = matched("kisan-fin-7900-money-counting-machine");
  const cassida = matched("cassida-xpecto-money-counting-machine");
  const retail = cassida && htmlToPlainText(cassida.short_desc_ar).includes("المتاجر") ? cassida : null;
  const highVolume = fin && htmlToPlainText(fin.short_desc_ar).includes("العمليات النقدية العالية") ? fin : null;

  const points = isAr ? [
    { icon: Gauge, title: "حجم النقد وسرعة العد", body: <>قدّر عدد الأوراق التي تعالجها يوميًا، ثم قارن سرعة العد وسعة التغذية في مواصفات الأجهزة. اختر ما يلائم وتيرة العمل الفعلية، لا وصف «سريع» وحده.</> },
    { icon: ScanSearch, title: "عد الأوراق أم عد القيمة؟", body: <>عدّ الأوراق يحدد عددها، بينما يحسب عدّ القيمة إجمالي الفئات التي يتعرف عليها الجهاز. تحقق من دعم الفئات المختلطة في وصف كل موديل.{fin && <> يذكر وصف <Link className="font-bold text-primary hover:underline" href={`/product/${fin.slug_en}`}>KISAN FIN-7900</Link> عدّ القيم المختلطة.</>}</> },
    { icon: ShieldCheck, title: "كشف العملات المزورة", body: <>تختلف قدرات الكشف والعملات التي يمكن فحصها حسب الموديل؛ راجع مواصفاته قبل الشراء.{cassida && <> يذكر وصف <Link className="font-bold text-primary hover:underline" href={`/product/${cassida.slug_en}`}>Cassida Xpecto</Link> وظيفة كشف التزوير.</>}</> },
    { icon: BadgeCheck, title: "الفرز وعدد الجيوب", body: <>إذا كنت تحتاج فصل الأوراق أثناء العد، فقارن وظيفة الفرز وعدد الجيوب في مواصفات كل جهاز.{k2 && <> يذكر وصف <Link className="font-bold text-primary hover:underline" href={`/product/${k2.slug_en}`}>KISAN K2</Link> جيبين (1+1).</>}</> },
  ] : [
    { icon: Gauge, title: "Cash volume and counting speed", body: <>Estimate your daily note volume, then compare the stated counting speed and hopper capacity against your workload.</> },
    { icon: ScanSearch, title: "Piece or value counting?", body: <>Piece counting totals notes; value counting calculates the value of denominations the machine recognizes. Check supported modes and currencies.{fin && <> The <Link className="font-bold text-primary hover:underline" href={`/product/${fin.slug_en}`}>KISAN FIN-7900</Link> description mentions mixed-value counting.</>}</> },
    { icon: ShieldCheck, title: "Counterfeit detection", body: <>Detection features and supported currencies vary by model. Check the product specifications before buying.{cassida && <> The <Link className="font-bold text-primary hover:underline" href={`/product/${cassida.slug_en}`}>Cassida Xpecto</Link> description mentions counterfeit detection.</>}</> },
    { icon: BadgeCheck, title: "Sorting and pockets", body: <>If you need to separate notes while counting, compare each model's sorting features and pocket count.{k2 && <> The <Link className="font-bold text-primary hover:underline" href={`/product/${k2.slug_en}`}>KISAN K2</Link> description mentions two pockets (1+1).</>}</> },
  ];

  const faqs = isAr ? [
    { question: "ما الفرق بين عد الأوراق وعد القيمة؟", answer: "عدّ الأوراق يحسب عددها، أما عدّ القيمة فيتعرف على الفئات التي يدعمها الجهاز ويحسب مجموعها. تحقق من دعم الفئات المختلطة في مواصفات الموديل." },
    { question: "هل كل ماكينة عد نقود تكشف التزوير؟", answer: "لا. تختلف وظائف الكشف والعملات التي يمكن فحصها حسب الموديل، لذا راجع وصف المنتج ومواصفاته قبل الاختيار." },
    { question: "كيف أختار عدادة نقود مناسبة للعمل؟", answer: "حدد حجم النقد اليومي، وهل تحتاج عد الأوراق أم القيمة، ثم قارن إمكانات الفرز والكشف وسهولة التشغيل بين الموديلات المتاحة." },
    { question: "هل تختلف مكائن عد النقود في قدرات الفرز؟", answer: "نعم؛ تختلف وظائف الفرز وعدد الجيوب بحسب الجهاز. لا تفترض أن كل موديل يفصل الأوراق أو يتعامل مع الفئات المختلطة بالطريقة نفسها." },
    { question: "ما الذي يجب التحقق منه قبل اختيار جهاز للاستخدام في السعودية؟", answer: "راجع العملات والفئات المدعومة، وطريقة العد، ووظائف كشف التزوير والفرز في مواصفات المنتج. لا تفترض أن كل جهاز يدعم الريال السعودي أو الفئات نفسها." },
    { question: "ما الفرق بين ماكينة عد النقود وماكينة عد الفلوس؟", answer: "يُستخدم المصطلحان عادةً للفئة نفسها من الأجهزة؛ الفروق المهمة تكون في إمكانات العد والفرز والكشف حسب الموديل." },
  ] : [
    { question: "What is the difference between piece and value counting?", answer: "Piece counting totals notes. Value counting identifies supported denominations and calculates their total. Check each model's mixed-denomination support." },
    { question: "Do all money counters detect counterfeit notes?", answer: "No. Detection features and supported currencies vary by model; review the product description and specifications." },
    { question: "How do I choose a counter for my business?", answer: "Start with daily cash volume and your need for piece or value counting, then compare sorting, detection, and ease of use." },
    { question: "Do money counting machines differ in sorting capability?", answer: "Yes. Sorting functions and pocket counts vary. Check how each model handles rejected notes and mixed denominations." },
    { question: "What should I check before choosing a machine in Saudi Arabia?", answer: "Verify supported currencies and denominations, counting modes, detection, and sorting. Do not assume every model supports Saudi riyals." },
  ];

  return <div className="mt-14 space-y-10">
    <section className="space-y-6 rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-8 lg:p-10" aria-labelledby="money-counting-guide-title">
      <div className="max-w-4xl">
        <p className="mb-3 text-sm font-bold text-primary">{isAr ? `${products.length} منتجًا للمقارنة` : `${products.length} products to compare`}</p>
        <h2 id="money-counting-guide-title" className="font-cairo text-2xl font-black leading-tight text-foreground sm:text-3xl">{isAr ? "كيف تختار ماكينة عد نقود مناسبة لعملك؟" : "How to choose a money counting machine for your business"}</h2>
        <p className="mt-4 text-base font-medium leading-8 text-muted-foreground">{isAr ? "ابدأ بما يحدث في عملك يوميًا: كمية النقد، وتنوع الفئات، والحاجة إلى فرز الأوراق أو فحصها. ثم قارن هذه الاحتياجات بما يذكره وصف كل موديل، وافتح صفحة المنتج للتفاصيل قبل طلب عرض سعر." : "Start with your daily cash volume, denomination mix, and need to sort or inspect notes. Compare those needs with each model's description and open its product page for details before requesting a quote."}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{points.map(({ icon: Icon, title, body }) => <article key={title} className="rounded-xl border border-border bg-muted/20 p-5 sm:p-6">
        <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" aria-hidden="true" /></div>
        <h3 className="font-cairo text-lg font-black text-foreground">{title}</h3><p className="mt-2 text-sm font-medium leading-7 text-muted-foreground">{body}</p>
      </article>)}</div>
    </section>

    {rows.length > 0 && <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-8 lg:p-10" aria-labelledby="money-counting-comparison-title">
      <h2 id="money-counting-comparison-title" className="font-cairo text-2xl font-black text-foreground">{isAr ? "مقارنة مكائن عد النقود المتوفرة" : "Compare available money counting machines"}</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{isAr ? "الجدول يقتصر على المعلومات المذكورة في أوصاف المنتجات المعروضة حاليًا؛ راجع صفحة كل موديل للتفاصيل والعملات المدعومة." : "This table uses only details stated in the currently listed product descriptions. Check each product page for full specifications and supported currencies."}</p>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[560px] border-collapse text-start text-sm"><thead><tr className="border-b border-border bg-muted/30 text-foreground">
        <th scope="col" className="px-4 py-3 text-start font-black">{isAr ? "الموديل" : "Model"}</th>
        <th scope="col" className="px-4 py-3 text-start font-black">{isAr ? "نوع العد أو الفرز في الوصف" : "Counting or sorting in description"}</th>
        <th scope="col" className="px-4 py-3 text-start font-black">{isAr ? "معلومة إضافية من الوصف" : "Additional detail from description"}</th>
      </tr></thead><tbody>{rows.map((row) => <tr key={row.slug} className="border-b border-border last:border-0">
        <th scope="row" className="px-4 py-4 text-start font-bold"><Link className="text-primary hover:underline" href={`/product/${row.product.slug_en}`}>{row.model}</Link></th>
        <td className="px-4 py-4 text-muted-foreground">{isAr ? row.functionAr : row.functionEn}</td>
        <td className="px-4 py-4 text-muted-foreground">{isAr ? row.detailAr : row.detailEn}</td>
      </tr>)}</tbody></table></div>
    </section>}

    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-8 lg:p-10" aria-labelledby="money-counting-uses-title">
      <h2 id="money-counting-uses-title" className="font-cairo text-2xl font-black text-foreground">{isAr ? "مكائن عد النقود حسب الاستخدام" : "Money counting machines by use case"}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-border p-5"><Store className="mb-3 size-6 text-primary" aria-hidden="true" /><h3 className="font-cairo text-lg font-black">{isAr ? "المتاجر ونقاط البيع" : "Retail and points of sale"}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{isAr ? "إذا كنت تبحث عن ماكينة عد فلوس لنقطة بيع، ابدأ بحجم النقد اليومي وطريقة العد التي تحتاجها." : "Start with daily cash volume and the counting mode your checkout needs."}{retail && <>{" "}{isAr ? "يذكر وصف " : "The description of "}<Link className="font-bold text-primary hover:underline" href={`/product/${retail.slug_en}`}>Cassida Xpecto</Link>{isAr ? " المتاجر ضمن استخداماته." : " mentions retail use."}</>}</p></article>
        <article className="rounded-xl border border-border p-5"><Building2 className="mb-3 size-6 text-primary" aria-hidden="true" /><h3 className="font-cairo text-lg font-black">{isAr ? "الشركات والخزائن" : "Businesses and cash offices"}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{isAr ? "عند تجميع النقد من أكثر من نقطة، قارن بين عد الأوراق وعد القيمة والحاجة إلى فرز الأوراق قبل اعتماد جهاز عد النقود للعمل اليومي." : "When cash comes from several points, compare piece counting, value counting, and sorting needs before choosing a daily-use machine."}</p></article>
        <article className="rounded-xl border border-border p-5"><Banknote className="mb-3 size-6 text-primary" aria-hidden="true" /><h3 className="font-cairo text-lg font-black">{isAr ? "المعالجة النقدية الأكبر" : "Higher-volume cash handling"}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{isAr ? "إذا زاد حجم العمليات، راجع العد المختلط وإمكانات الفرز والمراجعة في مواصفات كل موديل." : "For larger workloads, check each model's mixed-value counting, sorting, and review features."}{highVolume && <>{" "}{isAr ? "يذكر وصف " : "The "}<Link className="font-bold text-primary hover:underline" href={`/product/${highVolume.slug_en}`}>KISAN FIN-7900</Link>{isAr ? " أنه مخصص لعمليات نقدية عالية." : " description states that it is designed for high-volume cash operations."}</>}</p></article>
      </div>
    </section>

    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-8 lg:p-10" aria-labelledby="money-counting-faq-title">
      <h2 id="money-counting-faq-title" className="font-cairo text-2xl font-black text-foreground">{isAr ? "أسئلة شائعة عن مكائن عد النقود" : "Money counting machine FAQs"}</h2>
      <div className="mt-5 divide-y divide-border rounded-xl border border-border">{faqs.map(({ question, answer }) => <details key={question} className="group p-5 open:bg-muted/20"><summary className="cursor-pointer list-none font-cairo text-base font-black text-foreground marker:hidden">{question}</summary><p className="mt-3 max-w-4xl text-sm font-medium leading-7 text-muted-foreground">{answer}</p></details>)}</div>
    </section>

    <section className="flex flex-col gap-4 rounded-xl bg-foreground px-5 py-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-7"><div>
      <h2 className="font-cairo text-lg font-black">{isAr ? "تحتاج مساعدة في مقارنة الموديلات؟" : "Need help comparing models?"}</h2>
      <p className="mt-1 text-sm leading-6 text-primary-foreground/70">{isAr ? "أرسل متطلبات عملك وسنساعدك في تحديد المواصفات المناسبة قبل طلب عرض السعر." : "Share your workload and requirements, and we will help identify the right specifications before you request a quote."}</p>
    </div><Link href="/contact-us" className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-6 text-sm font-black text-primary-foreground transition-colors hover:bg-primary/90">{isAr ? "تواصل مع فريق إيلافد" : "Contact Elavd"}</Link></section>
  </div>;
}
