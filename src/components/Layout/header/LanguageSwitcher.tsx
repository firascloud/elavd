"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import EnFlag from "@/assets/en-flag.svg";
import ArFlag from "@/assets/ar-flag.svg";
import Image from "next/image";

const LanguageSwitcher = ({ isFooter }: { isFooter?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");
  const router = useRouter();

  const languages = [
    {
      code: "en",
      nativeName: "English",
      flagImage: EnFlag,
    },
    {
      code: "ar",
      nativeName: "العربية",
      flagImage: ArFlag,
    },
  ];

  const currentLang = locale;
  const currentLanguage = languages.find((lang) => lang.code === currentLang);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        title="Language"
        aria-label="Language"
        type="button"
        className={`group relative flex items-center gap-2 px-1 py-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out`}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2">
          <Image
            src={currentLang === "ar" ? ArFlag : EnFlag}
            alt="Flag"
            width={20}
            height={20}
          />
          <span
            className={`${isFooter
              ? "text-white group-hover:text-green-200"
              : "text-gray-700 group-hover:text-gray-900"
              } text-sm font-medium transition-colors`}
          >
            {currentLanguage?.nativeName}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-all duration-300 ${isFooter
            ? `text-white ${isOpen
              ? "rotate-180 text-green-200"
              : "group-hover:text-green-200"
            }`
            : `text-gray-500 ${isOpen ? "rotate-180 text-[" : "group-hover:text-gray-700"
            }`
            }`}
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`absolute z-[9999] top-full mt-2 w-36 border border-gray-200/50 shadow-2xl bg-white overflow-hidden transition-all duration-300 ease-out ${isOpen
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
        style={{
          top: isFooter ? "-81px" : "",
          left: isFooter ? (currentLang === "ar" ? "10px" : "-0px") : "-32px",
        }}
      >
        {languages.map((lang, index) => (
          <button
            key={lang.code}
            className={`group cursor-pointer flex items-center gap-3 px-3 py-2 transition-all duration-200 ease-in-out w-full ${currentLang === lang.code
              ? "bg-gray-100 text-black"
              : "hover:bg-gray-50 hover:text-gray-900"
              }`}
            onClick={(e) => {
              setIsOpen(false);
              router.replace(pathname, { locale: lang.code as any });
            }}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex justify-around items-center gap-2">
              <Image src={lang.flagImage} alt="Flag" width={20} height={20} />
              <div
                className={`font-medium text-nowrap text-sm ${currentLang === lang.code ? "text-[#2c7242]" : "text-gray-900"
                  }`}
              >
                {lang.nativeName}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
