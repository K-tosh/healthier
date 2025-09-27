import { AlertTriangle, Info, CheckCircle, Lightbulb, Heart } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MedicalCalloutProps {
  type: 'warning' | 'info' | 'tip' | 'emergency' | 'success';
  title?: string;
  children: React.ReactNode;
}

const calloutConfig = {
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconColor: 'text-yellow-600',
    title: 'Important Medical Information'
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
    iconColor: 'text-blue-600',
    title: 'Medical Information'
  },
  tip: {
    icon: Lightbulb,
    className: 'bg-green-50 border-green-200 text-green-800',
    iconColor: 'text-green-600',
    title: 'Health Tip'
  },
  emergency: {
    icon: AlertTriangle,
    className: 'bg-red-50 border-red-200 text-red-800',
    iconColor: 'text-red-600',
    title: 'Emergency Information'
  },
  success: {
    icon: CheckCircle,
    className: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    iconColor: 'text-emerald-600',
    title: 'Good to Know'
  }
};

export default function MedicalCallout({ type, title, children }: MedicalCalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div className={`my-8 border-l-4 rounded-lg p-6 ${config.className} border-l-current`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1">
          <h4 className="font-bold mb-2">{title || config.title}</h4>
          <div className="text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Predefined callout components for common use cases
export function MedicalWarning({ title, children }: { title?: string; children: React.ReactNode }) {
  return <MedicalCallout type="warning" title={title}>{children}</MedicalCallout>;
}

export function EmergencyAlert({ title, children }: { title?: string; children: React.ReactNode }) {
  return <MedicalCallout type="emergency" title={title}>{children}</MedicalCallout>;
}

export function HealthTip({ title, children }: { title?: string; children: React.ReactNode }) {
  return <MedicalCallout type="tip" title={title}>{children}</MedicalCallout>;
}

export function MedicalInfo({ title, children }: { title?: string; children: React.ReactNode }) {
  return <MedicalCallout type="info" title={title}>{children}</MedicalCallout>;
}