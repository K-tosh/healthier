interface PageHeaderProps {
  heading: string,
  text?: string,
}

export default function PageHeader({ heading, text } : PageHeaderProps) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
        {heading}
      </h1>
      {text && (
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {text}
        </p>
      )}
      <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
    </div>
  );
}
