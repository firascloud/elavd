import { Layers } from "lucide-react";

export const ProductCardSkeleton = () => (
    <div className="bg-white border border-gray-100 p-6 flex flex-col h-[450px] animate-pulse">
        <div className="h-60 w-full bg-gray-50 mb-6 flex items-center justify-center rounded-lg">
            <Layers className="size-12 text-gray-100" />
        </div>
        <div className="flex flex-col items-center space-y-3">
            <div className="h-5 w-3/4 bg-gray-100 rounded" />
            <div className="h-3 w-1/2 bg-gray-50 rounded" />
            <div className="h-11 w-full bg-gray-100 rounded-full mt-auto" />
        </div>
    </div>
);

