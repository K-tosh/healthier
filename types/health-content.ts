/**
 * TypeScript Type Definitions for HealthierKE Health Content
 * Auto-generated and manually enhanced for frontend consumption
 */

// Base types
export type DocumentId = string;
export type Slug = string;
export type ISODateString = string;

// Health content severity levels
export type Severity = 'mild' | 'moderate' | 'severe' | 'critical';

// Body systems for symptoms
export type BodySystem = 
  | 'cardiovascular' 
  | 'respiratory' 
  | 'digestive' 
  | 'nervous' 
  | 'musculoskeletal' 
  | 'endocrine' 
  | 'immune' 
  | 'reproductive' 
  | 'urinary' 
  | 'integumentary' 
  | 'general';

// Care urgency levels
export type CareUrgency = 'self_care' | 'routine_checkup' | 'urgent' | 'emergency';

// Article types
export type ArticleType = 
  | 'overview' 
  | 'symptoms' 
  | 'treatment' 
  | 'prevention' 
  | 'lifestyle' 
  | 'emergency' 
  | 'general';

// Target audiences
export type TargetAudience = 'general_public' | 'healthcare_workers' | 'patients' | 'caregivers';

// Treatment types
export type TreatmentType = 
  | 'medication' 
  | 'lifestyle' 
  | 'surgical' 
  | 'therapy' 
  | 'alternative' 
  | 'emergency';

// Cost estimates
export type CostEstimate = 'low' | 'moderate' | 'high' | 'varies';

// Kenya-specific accessibility levels
export type AccessibilityLevel = 
  | 'accessible' 
  | 'prescription_required' 
  | 'expensive' 
  | 'not_available';

// Urgency levels (computed)
export type UrgencyLevel = 'monitor' | 'routine' | 'urgent' | 'emergency';

// SEO Component
export interface SEOComponent {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  shareImage?: MediaFormat;
}

// Media formats
export interface MediaFormat {
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface MediaFile {
  documentId: DocumentId;
  url: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
}

// Kenya Health Metadata
export interface KenyaHealthMetadata {
  emergencyNumber: '999';
  healthMinistryContact: string;
  isRelevantToKenya: boolean;
  emergencyServices?: {
    ambulance: '999';
    police: '999';
    fire: '999';
    healthHotline: '719';
  };
}

// Base Content Interface
interface BaseHealthContent {
  id: DocumentId;
  slug: Slug;
  publishedAt: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  kenyaHealthMetadata?: KenyaHealthMetadata;
}

// Article Content Type
export interface Article extends BaseHealthContent {
  title: string;
  description: string;
  content?: string; // Full content (only in detailed views)
  blocks?: any[]; // Strapi blocks (only in detailed views)
  articleType: ArticleType;
  readingTime: number;
  priority: number;
  medicallyReviewed: boolean;
  healthDisclaimer: boolean;
  reviewDate?: ISODateString;
  medicalReviewer?: string;
  lastMedicalUpdate?: ISODateString;
  targetAudience: TargetAudience;
  
  // Relations
  relatedConditions?: ConditionSummary[];
  
  // SEO
  seo?: SEOComponent;
  
  // Computed fields
  isEmergencyContent: boolean;
  requiresDisclaimer: boolean;
}

// Condition Content Type
export interface Condition extends BaseHealthContent {
  name: string;
  description: string;
  overview?: string; // Full overview (only in detailed views)
  severity: Severity;
  isEmergency: boolean;
  color: string; // Hex color
  priority: number;
  prevalenceInKenya?: string;
  icon?: string; // Optimized icon URL
  
  // Relations
  articles?: ArticleSummary[];
  articleCount?: number;
  
  // SEO
  seo?: SEOComponent;
  
  // Computed fields
  urgencyLevel: UrgencyLevel;
  isCommonInKenya: boolean;
}

// Symptom Content Type
export interface Symptom extends BaseHealthContent {
  name: string;
  description: string;
  commonSeverity: Severity;
  bodySystem: BodySystem;
  whenToSeekCare: CareUrgency;
  commonInKenya: boolean;
  
  // Relations
  relatedConditions?: ConditionSummary[];
  
  // SEO
  seo?: SEOComponent;
  
  // Computed fields (Kenya-specific)
  urgencyLevel: UrgencyLevel;
  isRelevantToKenya: boolean;
  emergencyNumber?: '999' | null;
}

// Treatment Content Type
export interface Treatment extends BaseHealthContent {
  name: string;
  description: string;
  type: TreatmentType;
  estimatedCost: CostEstimate;
  availableInKenya: boolean;
  requiresPrescription: boolean;
  
  // Detailed fields (only in full views)
  sideEffects?: string;
  contraindications?: string;
  dosageInformation?: string;
  duration?: string;
  
  // Relations
  relatedConditions?: ConditionSummary[];
  conditionCount?: number;
  
  // SEO
  seo?: SEOComponent;
  
  // Computed fields (Kenya-specific)
  accessibilityInKenya: AccessibilityLevel;
  isAffordable: boolean;
}

// Health Topic Content Type
export interface HealthTopic extends BaseHealthContent {
  name: string;
  description: string;
  isActive: boolean;
  priority: number;
  icon?: string; // Optimized icon URL
  
  // Relations
  relatedConditions?: ConditionSummary[];
  conditionCount?: number;
  featuredArticles?: ArticleSummary[];
  articleCount?: number;
  
  // SEO
  seo?: SEOComponent;
}

// Summary types for relations (lightweight versions)
export interface ArticleSummary {
  id: DocumentId;
  title: string;
  slug: Slug;
  articleType: ArticleType;
  readingTime: number;
  medicallyReviewed: boolean;
  isEmergencyContent: boolean;
}

export interface ConditionSummary {
  id: DocumentId;
  name: string;
  slug: Slug;
  severity: Severity;
  isEmergency: boolean;
  color: string;
}

// Search results
export interface SearchResult {
  id: DocumentId;
  title: string;
  type: 'article' | 'condition' | 'symptom' | 'treatment' | 'health-topic';
  snippet: string;
  relevanceScore: number;
  isEmergency: boolean;
  url: string;
}

// API Response types
export interface APIResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface APIListResponse<T> extends APIResponse<T[]> {
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface APIErrorResponse {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
    details?: {
      code: string;
      [key: string]: any;
    };
    emergencyGuidance?: {
      message: string;
      contacts: {
        emergency: '999';
        healthHotline: '719';
        poisonControl: string;
      };
    };
  };
}

// Transform options for API responses
export interface TransformOptions {
  includeFull?: boolean;
  includeRelations?: boolean;
  optimizeForMobile?: boolean;
}

// Health content collections
export type HealthContent = Article | Condition | Symptom | Treatment | HealthTopic;

// Kenya emergency contacts
export const KENYA_EMERGENCY_CONTACTS = {
  emergency: '999',
  healthHotline: '719',
  poisonControl: '+254-20-2642660',
  healthMinistry: '+254-20-2717077'
} as const;

// Export content type strings for runtime checks
export const HEALTH_CONTENT_TYPES = [
  'article',
  'condition', 
  'symptom',
  'treatment',
  'health-topic'
] as const;

export type HealthContentType = typeof HEALTH_CONTENT_TYPES[number];