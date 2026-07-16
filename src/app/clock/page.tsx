'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimeZone {
  label: string;
  offset: string;
  timezone: string;
}

const timeZones: TimeZone[] = [
  { label: 'Cairo (EET)', offset: 'UTC+2', timezone: 'Africa/Cairo' },
  { label: 'London (GMT)', offset: 'UTC+0', timezone: 'Europe/London' },
  { label: 'New York (EST)', offset: 'UTC-5', timezone: 'America/New_York' },
  { label: 'Los Angeles (PST)', offset: 'UTC-8', timezone: 'America/Los_Angeles' },
  { label: 'Tokyo (JST)', offset: 'UTC+9', timezone: 'Asia/Tokyo' },
  { label: 'Sydney (AEDT)', offset: 'UTC+11', timezone: 'Australia/Sydney' },
  { label: 'Dubai (GST)', offset: 'UTC+4', timezone: 'Asia/Dubai' },
  { label: 'Singapore (SGT)', offset: 'UTC+8', timezone: 'Asia/Singapore' },
];

export default function DigitalClock() {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTimes = () => {
      const newTimes: Record<string, string> = {};

      timeZones.forEach(({ timezone }) => {
        const time = new Date().toLocaleString('en-US', {
          timeZone: timezone,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        newTimes[timezone] = time;
      });

      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">⏰ Global Time Zone Clock</h1>
          <Link
            href="/deploy"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
          >
            🚀 نشر على Cloudflare
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-12">
          Global Time Zone Clock
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {timeZones.map(({ label, offset, timezone }) => (
            <div
              key={timezone}
              className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-6 shadow-2xl border border-slate-600 hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <h2 className="text-xl font-semibold text-blue-400 mb-2">
                  {label}
                </h2>
                <p className="text-sm text-slate-400 mb-4">{offset}</p>
                <div className="bg-black rounded-lg p-4 mb-4">
                  <time className="text-4xl font-mono font-bold text-green-400 tracking-wider">
                    {times[timezone] || '--:--:--'}
                  </time>
                </div>
                <p className="text-xs text-slate-500">{timezone}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-700 rounded-lg p-6 text-center border border-slate-600">
          <p className="text-slate-300 text-sm">
            Current server time: {new Date().toISOString()}
          </p>
        </div>
      </div>
    </div>
  );
}
