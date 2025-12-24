import React from 'react';
import { MenuId, UploadType } from '../types';
import { Sparkles, ArrowRight, Database, Plus } from 'lucide-react';

interface DataRecommenderProps {
  activeMenu: MenuId;
  hasSales: boolean;
  hasCompetitor: boolean;
  hasProduct: boolean;
  hasReview: boolean;
}

const DataRecommender: React.FC<DataRecommenderProps> = ({ 
  activeMenu, hasSales, hasCompetitor, hasProduct, hasReview 
}) => {
  // Logic to determine what to suggest
  const getSuggestion = () => {
    switch (activeMenu) {
      case 'flagship':
        if (!hasSales) return {
          type: UploadType.SALES,
          title: "매출 데이터가 필요합니다",
          reason: "AI가 목표 달성률과 성장 추이를 분석하려면 매출/목표 데이터가 필수적입니다."
        };
        if (!hasProduct) return {
          type: UploadType.PRODUCT,
          title: "상품 데이터를 추가해보세요",
          reason: "매출 등락의 원인을 특정 상품(Best/Worst) 재고와 연관 지어 분석할 수 있습니다."
        };
        break;
      case 'market':
        if (!hasCompetitor) return {
          type: UploadType.COMPETITOR,
          title: "경쟁사 데이터를 업로드하세요",
          reason: "시장 내 우리 브랜드의 위치(Positioning)와 점유율 격차를 시각화할 수 있습니다."
        };
        if (!hasReview) return {
          type: UploadType.CUSTOMER,
          title: "고객 반응(VOC)을 더해보세요",
          reason: "경쟁사 대비 우리 브랜드의 평판이 낮은 이유를 고객 리뷰에서 찾을 수 있습니다."
        };
        break;
      case 'category':
        if (!hasProduct) return {
          type: UploadType.PRODUCT,
          title: "상품/재고 데이터가 없습니다",
          reason: "주차별 판매량과 재고 소진 속도를 분석하여 품절 임박 상품을 예측할 수 있습니다."
        };
        if (!hasSales) return {
          type: UploadType.SALES,
          title: "전체 매출 데이터를 연동하세요",
          reason: "개별 상품 판매가 전체 매출 목표에 기여하는 비중을 계산할 수 있습니다."
        };
        break;
      case 'voc':
        if (!hasReview) return {
          type: UploadType.CUSTOMER,
          title: "고객 리뷰 데이터가 필요합니다",
          reason: "텍스트 마이닝을 통해 고객의 감정(긍정/부정)과 주요 키워드를 추출할 수 있습니다."
        };
        break;
    }
    return null; // No suggestion needed or already has essential data
  };

  const suggestion = getSuggestion();

  if (!suggestion) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600 mt-1">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            AI Analysis Suggestion
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
              Insight Booster
            </span>
          </h4>
          <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            <span className="font-semibold text-blue-700">"{suggestion.title}"</span> — {suggestion.reason}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto pl-11 md:pl-0">
         <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Database className="w-3 h-3" />
            <span>Target: {suggestion.type}</span>
         </div>
         <button 
           className="whitespace-nowrap flex items-center gap-1 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
           onClick={() => document.getElementById(`upload-zone-${suggestion.type}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
         >
           <Plus className="w-4 h-4" />
           데이터 추가하기
         </button>
      </div>
    </div>
  );
};

export default DataRecommender;