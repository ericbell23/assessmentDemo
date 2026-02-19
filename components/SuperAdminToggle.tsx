'use client';

interface SuperAdminToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function SuperAdminToggle({ isEnabled, onToggle }: SuperAdminToggleProps) {
  return (
    <div className={`mb-6 p-4 rounded-xl border transition-all ${
      isEnabled 
        ? 'bg-amber-50 border-amber-200 shadow-sm' 
        : 'bg-slate-50 border-slate-200'
    }`}>
      <label className="flex items-center space-x-4 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-14 h-7 rounded-full transition-colors ${
            isEnabled ? 'bg-amber-500' : 'bg-slate-300'
          }`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-1 ml-1 ${
              isEnabled ? 'translate-x-7' : 'translate-x-0'
            }`}></div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-900">
              Super Admin Mode
            </span>
            {isEnabled && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800 border border-amber-300">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-0.5">
            {isEnabled 
              ? 'High-value transactions can now be cleared' 
              : 'Enable to unlock high-value transaction clearing'}
          </p>
        </div>
      </label>
    </div>
  );
}