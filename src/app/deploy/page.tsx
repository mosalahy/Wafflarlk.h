'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DeployPage() {
  const [apiToken, setApiToken] = useState('');
  const [accountId, setAccountId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deployMessage, setDeployMessage] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const validateInputs = () => {
    if (!apiToken.trim()) {
      setDeployMessage('يرجى إدخال Cloudflare API Token');
      setDeployStatus('error');
      return false;
    }
    if (!accountId.trim()) {
      setDeployMessage('يرجى إدخال Account ID');
      setDeployStatus('error');
      return false;
    }
    if (!projectName.trim()) {
      setDeployMessage('يرجى إدخال اسم المشروع');
      setDeployStatus('error');
      return false;
    }
    if (files.length === 0) {
      setDeployMessage('يرجى رفع ملفات الموقع');
      setDeployStatus('error');
      return false;
    }
    return true;
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsDeploying(true);
    setDeployStatus('deploying');
    setDeployMessage('جاري النشر...');

    const formData = new FormData();
    formData.append('apiToken', apiToken);
    formData.append('accountId', accountId);
    formData.append('projectName', projectName);
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setDeployStatus('error');
        setDeployMessage(data.message || 'حدث خطأ أثناء النشر');
      } else {
        setDeployStatus('success');
        setDeployMessage('تم النشر بنجاح! ✅');
        setDeployedUrl(data.url || `https://${projectName}.pages.dev`);
        // Reset form
        setApiToken('');
        setAccountId('');
        setProjectName('');
        setFiles([]);
      }
    } catch (error) {
      setDeployStatus('error');
      setDeployMessage('فشل الاتصال بخادم النشر');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-white">🚀 نشر على Cloudflare</h1>
            <Link
              href="/clock"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              الساعة العالمية
            </Link>
          </div>
          <p className="text-blue-100 text-lg">انشر موقعك على Cloudflare Pages بسهولة</p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleDeploy} className="bg-white rounded-xl shadow-2xl p-8">
          {/* Cloudflare Credentials Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">بيانات Cloudflare</h2>

            {/* API Token */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                API Token <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="أدخل Cloudflare API Token الخاص بك"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
              <p className="text-gray-500 text-sm mt-2">
                احصل على Token من <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">هنا</a>
              </p>
            </div>

            {/* Account ID */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Account ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="أدخل Account ID الخاص بك"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Project Name */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                اسم المشروع <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="أدخل اسم المشروع (مثال: my-site)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
              {projectName && (
                <p className="text-gray-500 text-sm mt-2">
                  الرابط سيكون: <span className="font-mono text-blue-600">https://{projectName}.pages.dev</span>
                </p>
              )}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">رفع الملفات</h2>

            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
              <label className="cursor-pointer">
                <div className="text-blue-600 text-5xl mb-4">📁</div>
                <p className="text-gray-700 font-semibold mb-2">اختر ملفات الموقع</p>
                <p className="text-gray-500 text-sm mb-4">
                  يمكنك رفع ملف ZIP أو ملفات متعددة (HTML, CSS, JS, صور)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".zip,.html,.css,.js,.jpg,.jpeg,.png,.gif,.svg,.json,.xml,.txt"
                />
                <button
                  type="button"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                  }}
                >
                  اختر الملفات
                </button>
              </label>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">الملفات المختارة:</h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="text-green-600 mr-2">✓</span>
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Deploy Button */}
          <button
            type="submit"
            disabled={isDeploying}
            className={`w-full py-3 rounded-lg font-bold text-white text-lg transition ${
              isDeploying
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {isDeploying ? '⏳ جاري النشر...' : '🚀 انشر الموقع'}
          </button>

          {/* Status Messages */}
          {deployStatus !== 'idle' && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                deployStatus === 'success'
                  ? 'bg-green-50 border-2 border-green-500'
                  : deployStatus === 'error'
                  ? 'bg-red-50 border-2 border-red-500'
                  : 'bg-blue-50 border-2 border-blue-500'
              }`}
            >
              <p
                className={`font-semibold ${
                  deployStatus === 'success'
                    ? 'text-green-700'
                    : deployStatus === 'error'
                    ? 'text-red-700'
                    : 'text-blue-700'
                }`}
              >
                {deployMessage}
              </p>

              {deployStatus === 'success' && deployedUrl && (
                <div className="mt-4">
                  <p className="text-gray-700 mb-2">رابط الموقع:</p>
                  <a
                    href={deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    زيارة الموقع {deployedUrl}
                  </a>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Footer Info */}
        <div className="mt-8 bg-white/10 backdrop-blur rounded-xl p-6 text-white">
          <h3 className="font-bold mb-3">💡 نصائح مهمة:</h3>
          <ul className="space-y-2 text-sm">
            <li>✓ تأكد من صحة API Token و Account ID من حسابك على Cloudflare</li>
            <li>✓ اسم المشروع يجب أن يكون بصيغة صحيحة (حروف صغيرة وشرطات)</li>
            <li>✓ الملفات يجب أن تحتوي على ملف index.html رئيسي</li>
            <li>✓ حجم الملفات الكلي يجب ألا يتجاوز 25 MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
