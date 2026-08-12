import React from 'react'
import Sidebar from '../_components/layout/sidebar.tsx'
import Header from '../_components/layout/header'
import LayoutWapper from '../_components/LayoutWapper'
import '../dashboard.css'
import Providers from '../../providers'
import { NextIntlClientProvider } from 'next-intl'

export default async function layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const [commonMessages, dashboardMessages] = await Promise.all([
        import(`../../../../../messages/common/${locale}.json`).then((module) => module.default),
        import(`../../../../../messages/dashboard/${locale}.json`).then((module) => module.default),
    ])

    return (
        <NextIntlClientProvider locale={locale} messages={{ ...commonMessages, ...dashboardMessages }}>
            <Providers>
                <LayoutWapper>
                    <div className="flex min-h-screen">
                        <Sidebar />
                        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                            <Header />
                            <main className="p-4 flex-1 overflow-auto min-w-0">
                                {children}
                            </main>
                        </div>
                    </div>
                </LayoutWapper>
            </Providers>
        </NextIntlClientProvider>
    )
}
