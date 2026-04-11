"use client";

const POLICY_AREAS = ["All", "Housing", "Education", "Policing", "Transit", "Environment", "Health", "Immigration"];
const TIME_RANGES = ["Last 30 Days", "Last 6 Months", "Current Session", "All Time"];
const LOCATIONS = ["All NYC", "Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];

export function DashboardFilters({ 
  selectedArea, setSelectedArea,
  selectedLocation, setSelectedLocation,
  selectedTime, setSelectedTime
}: { 
  selectedArea: string; setSelectedArea: (v: string) => void;
  selectedLocation: string; setSelectedLocation: (v: string) => void;
  selectedTime: string; setSelectedTime: (v: string) => void;
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8">
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide py-1">
          <span className="text-sm font-semibold text-[var(--muted)] mr-2 tracking-widest font-condensed uppercase shrink-0">Topic:</span>
          {POLICY_AREAS.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                selectedArea === area 
                  ? 'bg-[var(--accent)] text-white shadow-sm' 
                  : 'bg-white/60 text-[var(--foreground)] hover:bg-white border border-[var(--border)]'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-start md:justify-end">
           <select 
             value={selectedLocation} 
             onChange={(e) => setSelectedLocation(e.target.value)}
             className="bg-white/80 border border-[var(--border)] text-[13px] font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
           >
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
           </select>
           <select 
             value={selectedTime} 
             onChange={(e) => setSelectedTime(e.target.value)}
             className="bg-white/80 border border-[var(--border)] text-[13px] font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
           >
              {TIME_RANGES.map(t => <option key={t}>{t}</option>)}
           </select>
        </div>
      </div>
    </div>
  );
}
