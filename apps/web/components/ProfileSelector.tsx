'use client';

import { useStore } from '@/stores/store';

export function ProfileSelector() {
  const profile = useStore((state) => state.profile);
  const states = useStore((state) => state.states);
  const setProfile = useStore((state) => state.setProfile);

  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
        Profile
      </label>
      <select
        value={profile}
        onChange={(e) => setProfile(e.target.value)}
        className="w-full bg-bg-tertiary/50 border border-white/10 text-text-primary px-3 py-2.5 rounded-lg text-sm focus:border-accent/50 focus:outline-none transition-colors appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
        }}
      >
        {states.length === 0 ? (
          <option value="sober">sober</option>
        ) : (
          states.map((state) => (
            <option key={state.name} value={state.name}>
              {state.name}
            </option>
          ))
        )}
      </select>
      {states.length > 0 && (
        <p className="text-xs text-text-muted mt-2">
          {states.find((s) => s.name === profile)?.description || ''}
        </p>
      )}
    </div>
  );
}
