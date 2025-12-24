import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  dataDate: string | null;
  onRefreshClick: () => void;
  isUploadVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ dataDate, onRefreshClick, isUploadVisible }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-30 shadow-sm/50 backdrop-blur-sm bg-white/90">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          Sales Analysis
        </h2>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-slate-500">2025 Sales Performance & Forecast Analysis</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            210 RECORDS
          </span>
          {dataDate && (
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
               {dataDate}
             </span>
          )}
        </div>
      </div>

      <button
        onClick={onRefreshClick}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
          ${isUploadVisible 
            ? 'bg-slate-100 text-slate-700 border-slate-300' 
            : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
          }
        `}
      >
        <RefreshCw className={`w-4 h-4 ${isUploadVisible ? '' : ''}`} />
        {isUploadVisible ? 'Close Upload' : 'Refresh Data'}
      </button>
    </header>
  );
};

export default Header;