import PageHeader from "@/components/common/page-header";
import { Sparkles } from "lucide-react";

export default function SpecialsPage() {
    return (
        <div className="min-h-screen bg-[#fcf9f9] pb-20">
            <PageHeader title="Specials" icon={<Sparkles size={28} />} />
            <div className="max-w-7xl mx-auto px-4 mt-16 text-center">
                <div className="bg-white rounded-[2.5rem] p-12 border border-[#eee1e1] shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
                    <p className="text-muted-foreground transition group">Our special offers will be listed here shortly.</p>
                </div>
            </div>
        </div>
    );
}
