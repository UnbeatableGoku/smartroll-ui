import { MapPin } from 'lucide-react'

export const Loader = () => {
  return (
    <div className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className={`relative h-8 w-8`}>
          <MapPin className="h-8 w-8 animate-pulse" />
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
        </div>
        <p className="animate-pulse text-lg font-medium text-primary">
          Loading....
        </p>
      </div>
    </div>
  )
}
