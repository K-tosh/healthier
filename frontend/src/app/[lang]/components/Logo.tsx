import Link from "next/link";
import Image from "next/image";

export default function Logo({
  src,
  children,
}: {
  src: string | null;
  children?: React.ReactNode;
}) {
  console.log("🎨 Logo src:", src);
  
  return (
    <Link
      href="/"
      aria-label="Back to homepage"
      className="flex items-center p-2 hover:opacity-80 transition-opacity duration-200"
    >
      {src ? (
        <div className="relative w-auto h-8 md:h-10">
          <Image 
            src={src} 
            alt="HealthierKE Logo" 
            width={120}
            height={40}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-bold text-gray-900">
            HealthierKE
          </span>
        </div>
      )}
      {children && (
        <div className="ml-2">{children}</div>
      )}
    </Link>
  );
}