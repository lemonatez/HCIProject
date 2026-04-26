import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface MenuFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  spicy: boolean;
  veggie: boolean;
  allergies: {
    diary: boolean;
    seafood: boolean;
    peanut: boolean;
  };
  other: string;
}

export function MenuFilter({ isOpen, onClose, onApply, currentFilters }: MenuFilterProps) {
  const [filters, setFilters] = React.useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sort By</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Preferences</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.spicy}
                  onChange={(e) => setFilters({ ...filters, spicy: e.target.checked })}
                  className="w-5 h-5 rounded accent-orange-500"
                />
                <span className="font-medium text-gray-900">Spicy</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.veggie}
                  onChange={(e) => setFilters({ ...filters, veggie: e.target.checked })}
                  className="w-5 h-5 rounded accent-orange-500"
                />
                <span className="font-medium text-gray-900">Veggie</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Allergies</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.allergies.diary}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      allergies: { ...filters.allergies, diary: e.target.checked }
                    })
                  }
                  className="w-5 h-5 rounded accent-orange-500"
                />
                <span className="font-medium text-gray-900">Diary</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.allergies.seafood}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      allergies: { ...filters.allergies, seafood: e.target.checked }
                    })
                  }
                  className="w-5 h-5 rounded accent-orange-500"
                />
                <span className="font-medium text-gray-900">Seafood</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.allergies.peanut}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      allergies: { ...filters.allergies, peanut: e.target.checked }
                    })
                  }
                  className="w-5 h-5 rounded accent-orange-500"
                />
                <span className="font-medium text-gray-900">Peanut</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Other
            </label>
            <input
              type="text"
              value={filters.other}
              onChange={(e) => setFilters({ ...filters, other: e.target.value })}
              placeholder="Specify other dietary needs..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleApply} fullWidth size="lg">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
