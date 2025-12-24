import React from 'react';
import { UploadType, UploadZoneConfig } from '../types';
import { UploadCloud, FileSpreadsheet, CheckCircle2, Wand2, PlusCircle, Layers } from 'lucide-react';

interface UploadSectionProps {
  onFileUpload: (file: File, type: UploadType) => void;
  uploadStatus: Record<UploadType, boolean>;
  counts: Record<UploadType, number>;
}

const ZONES: UploadZoneConfig[] = [
  {
    id: UploadType.SALES,
    label: "매출/목표 데이터",
    description: "월별 매출, 목표치 (여러 파일 병합 가능)"
  },
  {
    id: UploadType.PRODUCT,
    label: "상품 분석 데이터",
    description: "주차별 판매량, 재고 (여러 파일 병합 가능)"
  },
  {
    id: UploadType.CUSTOMER,
    label: "고객 분석 데이터",
    description: "고객 리뷰, 키워드 (누적 업로드 가능)"
  },
  {
    id: UploadType.COMPETITOR,
    label: "경쟁사 데이터",
    description: "경쟁사 지표 (추가 업로드 시 업데이트)"
  }
];

const UploadSection: React.FC<UploadSectionProps> = ({ onFileUpload, uploadStatus, counts }) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: UploadType) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0], type);
      // Reset value to allow uploading the same file again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {ZONES.map((zone) => {
        const isUploaded = uploadStatus[zone.id];
        const count = counts[zone.id] || 0;
        
        return (
          <div 
            key={zone.id}
            id={`upload-zone-${zone.id}`}
            className={`
              relative group rounded-xl border-2 border-dashed transition-all duration-300 p-6 flex flex-col items-center justify-center text-center h-48
              ${isUploaded 
                ? 'border-blue-300 bg-blue-50/30' 
                : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50'
              }
            `}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => handleFileChange(e, zone.id)}
              accept=".csv,.json,.xlsx,.xls"
            />
            
            <div className="mb-3 relative">
              {isUploaded ? (
                <div className="relative">
                    <Layers className="w-10 h-10 text-blue-600" />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                        {count > 9 ? '9+' : count}
                    </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors relative">
                  <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-blue-600" />
                  <Wand2 className="w-3 h-3 text-purple-500 absolute -top-1 -right-1" />
                </div>
              )}
            </div>

            <h3 className={`font-bold mb-1 ${isUploaded ? 'text-blue-800' : 'text-slate-800'}`}>
              {zone.label}
            </h3>
            <p className="text-xs text-slate-500 break-keep leading-relaxed px-2">
              {isUploaded ? "추가 업로드 가능" : zone.description}
            </p>
            
            {isUploaded && (
               <div className="absolute top-3 right-3 flex gap-1">
                   <div className="bg-white/80 p-1 rounded-full shadow-sm">
                      <PlusCircle className="w-4 h-4 text-blue-600" />
                   </div>
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UploadSection;