import { List, Star } from 'lucide-react'
import EventCard from './EventCard'

export default function EventTimeline({ events, onEventSelect }) {
  const majorEvents = events.filter(e => e.isMajor)
  const otherEvents = events.filter(e => !e.isMajor)

  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <div className="px-3 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List size={14} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-300">Events Timeline</span>
          </div>
          <span className="text-xs text-gray-600">{events.length} events</span>
        </div>
      </div>

      {/* Scrollable event list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Major events first */}
        {majorEvents.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-1 py-1">
              <Star size={12} className="text-amber-400" fill="currentColor" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Major Events</span>
              <div className="flex-1 h-px bg-amber-900/30 ml-1" />
            </div>
            {majorEvents.map(event => (
              <EventCard key={event.id} event={event} onLocate={onEventSelect} />
            ))}
          </div>
        )}

        {/* Other events */}
        {otherEvents.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-1 py-1">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">All Events</span>
              <div className="flex-1 h-px bg-gray-800 ml-1" />
            </div>
            {otherEvents.map(event => (
              <EventCard key={event.id} event={event} onLocate={onEventSelect} />
            ))}
          </div>
        )}

        {events.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-gray-600">
            No events match current filters
          </div>
        )}
      </div>
    </div>
  )
}
