interface PageHeaderProps {
  heading: string,
  text?: string,
}

export default function PageHeader({ heading, text } : PageHeaderProps) {
  return (
    <div className="w-full text-center space-y-1 mb-4">
      {text && <span className="text-gray-500 text-sm mt-2 block">{text}</span>}
      <h1 className="text-3xl font-bold tracking-tight font-sans">{heading}</h1>
    </div>
  );
}
