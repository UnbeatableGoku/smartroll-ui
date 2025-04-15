import { MapPin } from 'lucide-react'

export const Loader = ({ message }: any) => {
  return (
    <div className="z-100 fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-black">
        <div className={`relative h-8 w-8`}>
          <MapPin className="h-8 w-8 animate-pulse text-[#0261BE]" />
          <div className="absolute inset-0 animate-ping rounded-full bg-[#0261BE]"></div>
        </div>
        {message ? (
          <p className="text-md animate-pulse px-3 text-center font-medium text-[#0261BE] md:text-lg">
            {message}
          </p>
        ) : (
          <p className="text-md animate-pulse text-center font-medium text-[#0261BE] md:text-lg">
            Loading....
          </p>
        )}
      </div>
    </div>
  )
}
