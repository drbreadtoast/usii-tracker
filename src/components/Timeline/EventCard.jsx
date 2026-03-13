import { MapPin, Clock, ExternalLink, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { EVENT_COLORS, VERIFICATION_COLORS, COUNTRY_COLORS } from '../../utils/colors'
import { formatDateOnly, getVerificationDescription } from '../../utils/verification'

export default function EventCard({ event, onLocate }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const typeInfo = EVENT_COLORS[event.type]
  const verInfo = VERIFICATION_COLORS[event.verificationStatus]
  const countryInfo = COUNTRY_COLORS[event.attributedTo]

  return (
    <div
      className={`border rounded-lg transition-all cursor-pointer hover:border-gray-600 ${
        event.isMajor
          ? 'border-amber-800/50 bg-gray-800/80 glow-amber'
          : 'border-gray-800 bg-gray-900/80'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
            style={{ backgroundColor: typeInfo?.color, boxShadow: `0 0 6px ${typeInfo?.color}60` }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-1.5">
              {event.isMajor && <Star size={13} className="text-amber-400 mt-0.5 shrink-0" fill="currentColor" />}
              <h3 className={`text-sm font-semibold leading-tight ${event.isMajor ? 'text-white' : 'text-gray-200'}`}>
                {event.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {/* Country badge */}
              {countryInfo && (
                <span
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor: `${countryInfo.color}20`, color: countryInfo.color }}
                >
                  {countryInfo.flag} {countryInfo.short}
                </span>
              )}

              {/* Verification badge */}
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: `${verInfo?.color}20`,
                  color: verInfo?.color,
                  border: `1px ${event.verificationStatus === 'rumored' ? 'dashed' : 'solid'} ${verInfo?.color}40`,
                }}
              >
                {verInfo?.icon} {verInfo?.label}
              </span>

              {/* Type badge */}
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px]"
                style={{ backgroundColor: `${typeInfo?.color}15`, color: typeInfo?.color }}
              >
                {typeInfo?.label}
              </span>

              {/* Time */}
              <span className="text-[10px] text-gray-500 flex items-center gap-0.5 ml-auto">
                <Clock size={10} />
                {formatDateOnly(event.timestamp)}
              </span>
            </div>
          </div>

          <button className="text-gray-600 mt-1 shrink-0">
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 ml-4.5 space-y-2 border-t border-gray-800 pt-2">
            <p className="text-xs text-gray-400 leading-relaxed">{event.description}</p>

            <p className="text-[10px] italic text-gray-600">
              {getVerificationDescription(event.verificationStatus)}
            </p>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={11} />
              <span>{event.location}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onLocate && onLocate(event) }}
                className="ml-auto text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-0.5"
              >
                Show on map <ExternalLink size={9} />
              </button>
            </div>

            {event.casualties && event.casualties !== 'N/A' && (
              <p className="text-xs text-red-400/80">
                <span className="font-semibold">Casualties:</span> {event.casualties}
              </p>
            )}

            {event.sources && event.sources.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Sources:</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {event.sources.map((src, i) => (
                    <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-0.5 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-950/30 px-1.5 py-0.5 rounded"
                    >
                      {src.name} <ExternalLink size={8} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {event.socialRefs && event.socialRefs.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Social Media:</span>
                {event.socialRefs.map((ref, i) => (
                  <div key={i} className="mt-1 text-[11px] text-gray-400 bg-gray-800/50 p-2 rounded border border-gray-800">
                    <span className="text-blue-400 font-semibold">{ref.handle}</span>
                    <p className="mt-0.5 italic">"{ref.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
