import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, languageOptions } from '@/hooks/useLanguage';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const currentLang = languageOptions.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 px-3">
          <span className="text-lg">{currentLang?.flag}</span>
          <Globe className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={`cursor-pointer gap-3 ${language === lang.code ? 'bg-primary/10 text-primary' : ''}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            {language === lang.code && (
              <span className="text-xs text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
