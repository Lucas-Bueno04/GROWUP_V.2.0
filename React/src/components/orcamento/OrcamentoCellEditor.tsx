
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

interface OrcamentoCellEditorProps {
  value: number;
  onChange: (value: number) => void;
  onSave: () => void;
  onCancel?: () => void;
  isLoading: boolean;
}

export function OrcamentoCellEditor({ value, onChange, onSave, onCancel, isLoading }: OrcamentoCellEditorProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel?.();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg border border-gray-600">
      <Input
        type="number"
        value={value || 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        onKeyDown={handleKeyDown}
        className="w-28 h-8 bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
        autoFocus
      />
      <Button
        size="sm"
        onClick={onSave}
        disabled={isLoading}
        className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Save className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
