import { CheckCircle, Star, TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface KeyTakeawaysProps {
  title?: string;
  takeaways: string[];
  variant?: 'default' | 'highlight' | 'medical';
}

export default function KeyTakeaways({ 
  title = "Key Takeaways", 
  takeaways, 
  variant = 'default' 
}: KeyTakeawaysProps) {
  const variantConfig = {
    default: {
      containerClass: 'bg-blue-50 border-blue-200',
      titleClass: 'text-blue-900',
      iconClass: 'text-blue-600',
      itemClass: 'text-blue-800'
    },
    highlight: {
      containerClass: 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200',
      titleClass: 'text-purple-900',
      iconClass: 'text-purple-600',
      itemClass: 'text-purple-800'
    },
    medical: {
      containerClass: 'bg-green-50 border-green-200',
      titleClass: 'text-green-900',
      iconClass: 'text-green-600',
      itemClass: 'text-green-800'
    }
  };

  const config = variantConfig[variant];

  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div className={`my-8 medical-card border-l-4 border-l-current ${config.containerClass}`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          {variant === 'highlight' ? (
            <Star className={`w-6 h-6 ${config.iconClass}`} />
          ) : variant === 'medical' ? (
            <TrendingUp className={`w-6 h-6 ${config.iconClass}`} />
          ) : (
            <CheckCircle className={`w-6 h-6 ${config.iconClass}`} />
          )}
          <h3 className={`text-xl font-bold ${config.titleClass}`}>
            {title}
          </h3>
          <Badge className={`${config.containerClass} ${config.itemClass} border-current`}>
            {takeaways.length} points
          </Badge>
        </div>
        
        <ul className="space-y-4">
          {takeaways.map((takeaway, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${config.containerClass} border border-current`}>
                <span className={`text-sm font-bold ${config.iconClass}`}>
                  {index + 1}
                </span>
              </div>
              <p className={`${config.itemClass} leading-relaxed font-medium`}>
                {takeaway}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}