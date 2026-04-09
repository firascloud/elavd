"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

interface SignInFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        setError(t("LoginError"));
        toast.error(t("LoginError"));
      } else {
        const { data: { session: newSession } } = await supabaseBrowser.auth.getSession();

        toast.success(t("LoginSuccessTitle"), {
          description: t("LoginSuccessDesc"),
        });

        const isAdmin = newSession?.user?.email === "admin@elavd.com";

        if (isAdmin) {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh();
      }
    } catch (err) {
      setError(t("UnexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="border-none shadow-2xl bg-background/80 backdrop-blur-xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardHeader className="space-y-2 pb-8 pt-10">
          <CardTitle className="text-3xl font-bold text-center tracking-tight text-foreground">
            {t("LoginTitle")}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground max-w-[280px] mx-auto">
            {t("LoginSubtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-10">
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
            >
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                {t("EmailLabel")}
              </label>
              <div className="relative group">
                <Input
                  id="email"
                  {...register("email", {
                    required: t("EmailRequired"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("InvalidEmail"),
                    },
                  })}
                  type="email"
                  placeholder={t("EmailPlaceholder")}
                  className={`bg-muted/30 border-muted-foreground/10 focus:border-primary/50 transition-all duration-300 h-11 ${errors.email ? "border-red-500/50" : ""
                    }`}
                />
                <div className="absolute inset-0 rounded-md pointer-events-none group-focus-within:ring-2 ring-primary/20 transition-all duration-300" />
              </div>
              {errors.email && (
                <p className="text-[11px] font-medium text-red-500 mt-1 ms-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  {t("PasswordLabel")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {t("ForgotPassword")}
                </Link>
              </div>
              <div className="relative group">
                <Input
                  id="password"
                  {...register("password", {
                    required: t("PasswordRequired"),
                    minLength: {
                      value: 6,
                      message: t("PasswordMinLength"),
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("PasswordPlaceholder")}
                  className={`bg-muted/30 border-muted-foreground/10 focus:border-primary/50 transition-all duration-300 h-11 pe-10 ${errors.password ? "border-red-500/50" : ""
                    }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 py-2 text-muted-foreground hover:bg-transparent hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <div className="absolute inset-0 rounded-md pointer-events-none group-focus-within:ring-2 ring-primary/20 transition-all duration-300" />
              </div>
              {errors.password && (
                <p className="text-[11px] font-medium text-red-500 mt-1 ms-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t("LoggingIn")}
                </>
              ) : (
                <span className="flex items-center gap-2">
                  {t("SignInButton")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              {t("NoAccount")}{" "}
              <Link
                href="/register"
                className="font-bold text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
              >
                {t("SignUp")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
