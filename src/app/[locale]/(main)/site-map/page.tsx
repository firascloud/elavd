import PageHeader from "@/components/common/page-header";
import { Map } from "lucide-react";

export default function SiteMapPage() {
    return (
        <div className="min-h-screen bg-[#fcf9f9] pb-20">
            <PageHeader title="Site Map" icon={<Map size={28} />} />
            <div className="max-w-7xl mx-auto px-4 mt-16">
                <div className="bg-white rounded-[2.5rem] p-12 border border-[#eee1e1] shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Site Map</h2>
                    <p className="text-muted-foreground">The structure of our website will be displayed here.</p>
                </div>
            </div>
        </div>
    );
}
