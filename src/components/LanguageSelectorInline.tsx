import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage, languageOptions } from '@/hooks/useLanguage';

interface LanguageSelectorInlineProps {
  className?: string;
}

export function LanguageSelectorInline({ className = '' }: LanguageSelectorInlineProps) {
  const { language, setLanguage } = useLanguage();
  const currentLang = languageOptions.find(l => l.code === language);

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
      <SelectTrigger className={`w-[150px] h-9 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLang?.flag}</span>
          <SelectValue placeholder="Language" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
