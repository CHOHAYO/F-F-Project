import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NavTabs from './components/NavTabs';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';
import { UploadType, SalesData, CompetitorData, ProductTrend, ReviewData, MenuId } from './types';
import { transformDataWithAI, generateTabSpecificAnalysis } from './services/geminiService';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  // State for Layout & Navigation
  const [activeMenu, setActiveMenu] = useState<MenuId>('flagship');
  const [isUploadVisible, setIsUploadVisible] = useState(true);

  const [uploadStatus, setUploadStatus] = useState<Record<UploadType, boolean>>({
    [UploadType.CUSTOMER]: false,
    [UploadType.SALES]: false,
    [UploadType.PRODUCT]: false,
    [UploadType.COMPETITOR]: false,
  });

  // Track how many files uploaded per type
  const [uploadCounts, setUploadCounts] = useState<Record<UploadType, number>>({
    [UploadType.CUSTOMER]: 0,
    [UploadType.SALES]: 0,
    [UploadType.PRODUCT]: 0,
    [UploadType.COMPETITOR]: 0,
  });

  // State for parsed data
  const [salesData, setSalesData] = useState<SalesData[] | null>(null);
  const [competitorData, setCompetitorData] = useState<CompetitorData[] | null>(null);
  const [productData, setProductData] = useState<ProductTrend[] | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData[] | null>(null);

  const [dataDate, setDataDate] = useState<string | null>(null);
  
  // AI Analysis States
  const [viewAnalysis, setViewAnalysis] = useState<string>("");
  const [isAnalyzingView, setIsAnalyzingView] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to update current date
  const updateDate = () => {
    if (!dataDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDataDate(`${yyyy}-${mm}-${dd}`);
    }
  };

  // --- MERGING LOGIC ---
  const mergeSalesData = (prev: SalesData[] | null, next: SalesData[]): SalesData[] => {
    if (!prev) return next;
    // Merge by 'month'. If month exists, overwrite/update, else append.
    const map = new Map(prev.map(item => [item.month, item]));
    next.forEach(item => map.set(item.month, item));
    // Sort by month string roughly (better sorting would require real dates)
    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
  };

  const mergeCompetitorData = (prev: CompetitorData[] | null, next: CompetitorData[]): CompetitorData[] => {
    if (!prev) return next;
    // Merge by 'subject'.
    const map = new Map(prev.map(item => [item.subject, item]));
    next.forEach(item => map.set(item.subject, item));
    return Array.from(map.values());
  };

  const mergeProductData = (prev: ProductTrend[] | null, next: ProductTrend[]): ProductTrend[] => {
    if (!prev) return next;
    // Merge by 'week'
    const map = new Map(prev.map(item => [item.week, item]));
    next.forEach(item => map.set(item.week, item));
    return Array.from(map.values()).sort((a, b) => a.week.localeCompare(b.week));
  };

  const mergeReviewData = (prev: ReviewData[] | null, next: ReviewData[]): ReviewData[] => {
    if (!prev) return next;
    // Reviews are additive usually, or merge by name if it's aggregate categories
    // Assuming aggregate data (e.g., 'Fast Delivery': 10)
    const map = new Map(prev.map(item => [item.name, item]));
    next.forEach(item => {
      if (map.has(item.name)) {
        // Option: Add values? Or Overwrite? Let's overwrite for now as it's cleaner for re-uploads
        // If we wanted to sum: map.get(item.name)!.value += item.value;
        map.set(item.name, item); 
      } else {
        map.set(item.name, item);
      }
    });
    return Array.from(map.values());
  };


  // --- 1. File Upload Handler ---
  const parseFile = (file: File, callback: (data: any[]) => void) => {
    setErrorMsg(null);
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (Array.isArray(json)) callback(json);
          else setErrorMsg("JSON 파일 형식이 올바르지 않습니다.");
        } catch (err) {
          setErrorMsg("JSON 파싱 오류");
        }
      };
      reader.readAsText(file);
    } 
    else if (fileType === 'csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => callback(results.data as any[]),
        error: (err: any) => setErrorMsg(`CSV 오류: ${err.message}`)
      });
    }
    else if (fileType === 'xlsx' || fileType === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          callback(jsonData as any[]);
        } catch (err) {
          setErrorMsg("Excel 오류");
        }
      };
      reader.readAsArrayBuffer(file);
    }
    else {
      setErrorMsg("지원하지 않는 파일 형식입니다.");
    }
  };

  const handleFileUpload = (file: File, type: UploadType) => {
    parseFile(file, async (rawData) => {
      setIsParsing(true);
      setErrorMsg(null);

      try {
        const cleanedData = await transformDataWithAI(rawData, type);
        
        if (cleanedData.length === 0) throw new Error("유효한 데이터 없음");

        switch (type) {
          case UploadType.SALES: 
            setSalesData(prev => mergeSalesData(prev, cleanedData as SalesData[])); 
            break;
          case UploadType.COMPETITOR: 
            setCompetitorData(prev => mergeCompetitorData(prev, cleanedData as CompetitorData[])); 
            break;
          case UploadType.PRODUCT: 
            setProductData(prev => mergeProductData(prev, cleanedData as ProductTrend[])); 
            break;
          case UploadType.CUSTOMER: 
            setReviewData(prev => mergeReviewData(prev, cleanedData as ReviewData[])); 
            break;
        }

        setUploadStatus(prev => ({ ...prev, [type]: true }));
        setUploadCounts(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
        updateDate();
        
      } catch (err: any) {
        setErrorMsg(`AI 변환 실패: ${err.message}`);
      } finally {
        setIsParsing(false);
      }
    });
  };

  // --- 2. AI Analysis Trigger (Per View) ---
  useEffect(() => {
    const fetchAnalysis = async () => {
      let contextData = null;
      
      // Select appropriate data for the current view
      if (activeMenu === 'flagship' && salesData) contextData = salesData;
      else if (activeMenu === 'market' && competitorData) contextData = competitorData;
      else if (activeMenu === 'category' && productData) contextData = productData;
      else if (activeMenu === 'voc' && reviewData) contextData = reviewData;

      if (contextData) {
        setIsAnalyzingView(true);
        setViewAnalysis(""); // Clear previous
        const analysis = await generateTabSpecificAnalysis(activeMenu, contextData);
        setViewAnalysis(analysis);
        setIsAnalyzingView(false);
      } else {
        setViewAnalysis(""); // Reset if no data for this view
      }
    };

    fetchAnalysis();
  }, [activeMenu, salesData, competitorData, productData, reviewData]);


  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
        
        <Header 
          dataDate={dataDate} 
          onRefreshClick={() => setIsUploadVisible(!isUploadVisible)} 
          isUploadVisible={isUploadVisible}
        />

        <main className="flex-1 px-8 py-8 overflow-y-auto">
          
          <NavTabs activeTab={activeMenu} onTabClick={setActiveMenu} />

          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm animate-pulse">
              <AlertCircle className="w-4 h-4" />
              {errorMsg}
            </div>
          )}
          
          {isParsing && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
               <div className="bg-white p-8 rounded-2xl flex flex-col items-center shadow-2xl animate-bounce-in">
                   <div className="relative">
                       <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                       <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-800">AI Data Processing</h3>
                   <p className="text-slate-500 mt-2 text-sm">Gemini AI가 파일을 병합하고 데이터를 분석 중입니다...</p>
               </div>
            </div>
          )}

          {isUploadVisible && (
            <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in-down">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
                        <span className="bg-blue-600 w-1 h-6 rounded-full"></span>
                        Data Import Center
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> AI Multi-File Support
                        </span>
                    </h3>
                    <button 
                      onClick={() => setIsUploadVisible(false)} 
                      className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      완료 (패널 닫기)
                    </button>
                </div>
                <UploadSection onFileUpload={handleFileUpload} uploadStatus={uploadStatus} counts={uploadCounts} />
            </div>
          )}

          <Dashboard 
            activeMenu={activeMenu}
            salesData={salesData}
            competitorData={competitorData}
            productData={productData}
            reviewData={reviewData}
            viewAnalysis={viewAnalysis}
            isAnalyzing={isAnalyzingView}
          />
        </main>
      </div>
    </div>
  );
}