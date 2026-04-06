export const ProductCardSkeleton = ({ view = 'grid' }: { view?: 'grid' | 'list' }) => {
  if (view === 'list') {
    return (
      <div className="flex flex-col md:flex-row bg-white border border-gray-100 rounded-3xl overflow-hidden animate-pulse">
        <div className="w-full md:w-80 h-64 md:h-auto bg-gray-50 flex items-center justify-center p-8 shrink-0" />
        <div className="flex-1 p-8 md:p-12 space-y-6">
           <div className="h-4 w-24 bg-gray-100 rounded" />
           <div className="h-8 w-3/4 bg-gray-100 rounded" />
           <div className="h-4 w-1/2 bg-gray-100 rounded" />
           <div className="h-12 w-40 bg-gray-100 rounded-full mt-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white border border-gray-100 p-6 rounded-[2rem] gap-6 animate-pulse">
      <div className="h-48 w-full bg-gray-50 rounded-2xl" />
      <div className="flex flex-col items-center gap-3">
        <div className="h-5 w-3/4 bg-gray-100 rounded" />
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
        <div className="h-10 w-full bg-gray-100 rounded-full mt-4" />
      </div>
    </div>
  )
}
