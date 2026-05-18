import React from 'react'
import Sidebar from '../_components/layout/sidebar.tsx'
import Header from '../_components/layout/header'
import LayoutWapper from '../_components/LayoutWapper'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
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
    )
}