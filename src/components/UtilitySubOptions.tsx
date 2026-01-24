import { Zap, Flame, MoreHorizontal } from 'lucide-react';

interface UtilitySubOptionsProps {
  onSelect: (subType: string) => void;
  onClose: () => void;
}

const utilityOptions = [
  {
    id: 'k-electric',
    title: 'K-Electric',
    description: 'Electricity bills',
    icon: Zap,
    color: 'text-yellow-400 bg-yellow-400/10',
  },
  {
    id: 'sui-gas',
    title: 'Sui Gas',
    description: 'Gas bills',
    icon: Flame,
    color: 'text-orange-400 bg-orange-400/10',
  },
  {
    id: 'other-utility',
    title: 'Other',
    description: 'Water, internet, etc.',
    icon: MoreHorizontal,
    color: 'text-blue-400 bg-blue-400/10',
  },
];

export function UtilitySubOptions({ onSelect, onClose }: UtilitySubOptionsProps) {
  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-md shadow-soft-xl animate-scale-in border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Select Utility Type</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose the type of utility bill</p>
        </div>

        <div className="p-4 space-y-3">
          {utilityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => onSelect(option.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-200 border border-border hover:border-primary/30 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {option.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
