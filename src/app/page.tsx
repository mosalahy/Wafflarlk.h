'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-black/50 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">⏱️ Wafflarlk</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/clock"
              className="px-4 py-2 text-white hover:text-blue-400 transition font-semibold"
            >
              الساعة العالمية
            </Link>
            <Link
              href="/deploy"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
            >
              نشر على Cloudflare
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-white mb-6">
            مرحباً بك في Wafflarlk
          </h2>
          <p className="text-2xl text-slate-300 mb-12">
            أدوات قوية للويب والنشر على السحابة
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {/* Clock Feature */}
            <Link
              href="/clock"
              className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-8 hover:shadow-2xl hover:scale-105 transition transform border border-slate-600 hover:border-blue-500"
            >
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                الساعة العالمية
              </h3>
              <p className="text-slate-300">
                عرض الوقت الحالي في 8 مناطق زمنية حول العالم مع تحديث فوري
              </p>
            </Link>

            {/* Deploy Feature */}
            <Link
              href="/deploy"
              className="bg-gradient-to-br from-blue-700 to-purple-800 rounded-xl p-8 hover:shadow-2xl hover:scale-105 transition transform border border-blue-600 hover:border-purple-400"
            >
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                نشر على Cloudflare
              </h3>
              <p className="text-blue-100">
                انشر موقعك على Cloudflare Pages بسهولة وسرعة
              </p>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-slate-700">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">8</div>
              <p className="text-slate-300">مناطق زمنية</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">∞</div>
              <p className="text-slate-300">مشاريع</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">Fast</div>
              <p className="text-slate-300">سرعة فائقة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-slate-700 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>© 2026 Wafflarlk. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
