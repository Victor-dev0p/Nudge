// app/partner/accept/page.tsx
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import PartnerAcceptClient from './PartnerAcceptClient';

export default function PartnerAcceptPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading invitation...</p>
          </div>
        </div>
      }
    >
      <PartnerAcceptClient />
    </Suspense>
  );
}