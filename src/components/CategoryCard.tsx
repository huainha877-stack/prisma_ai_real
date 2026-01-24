import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  documentCount: number;
  category: 'medical' | 'education' | 'utility' | 'insurance' | 'others';
  onClick: () => void;
}

const categoryStyles = {
  medical: {
    card: 'category-medical',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    countBg: 'bg-red-100/80',
    countText: 'text-red-700'
  },
  education: {
    card: 'category-education',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    countBg: 'bg-amber-100/80',
    countText: 'text-amber-700'
  },
  utility: {
    card: 'category-utility',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    countBg: 'bg-blue-100/80',
    countText: 'text-blue-700'
  },
  insurance: {
    card: 'category-insurance',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    countBg: 'bg-purple-100/80',
    countText: 'text-purple-700'
  },
  others: {
    card: 'category-others',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    countBg: 'bg-gray-100/80',
    countText: 'text-gray-700'
  }
};

export function CategoryCard({ icon, title, description, documentCount, category, onClick }: CategoryCardProps) {
  const styles = categoryStyles[category];

  return (
    <button
      onClick={onClick}
      className={`category-card w-full text-left group ${styles.card}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${styles.iconBg} rounded-xl flex items-center justify-center ${styles.iconColor}`}>
          {icon}
        </div>
        <div className={`px-2.5 py-1 ${styles.countBg} rounded-full`}>
          <span className={`text-xs font-medium ${styles.countText}`}>
            {documentCount} {documentCount === 1 ? 'record' : 'records'}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>
      
      <div className="flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
        View records
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </button>
  );
}
