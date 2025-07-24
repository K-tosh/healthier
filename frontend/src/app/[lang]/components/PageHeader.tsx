interface PageHeaderProps {
  heading: string,
  text?: string,
}

export default function PageHeader({ heading, text } : PageHeaderProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20 -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full blur-3xl opacity-20 translate-y-20 -translate-x-20"></div>
      
      <div className="relative content-container">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="medical-heading text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
            {heading}
          </h1>
          {text && (
            <p className="medical-body text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              {text}
            </p>
          )}
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-8 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
