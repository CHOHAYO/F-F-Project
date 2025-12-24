import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, ComposedChart, PieChart, Pie, Cell
} from 'recharts';
import { SalesData, CompetitorData, ProductTrend, ReviewData, MenuId } from '../types';
import { TrendingUp, MessageSquare, Target, Activity, BrainCircuit, DollarSign, Package, Bot, Sparkles, ArrowUpRight } from 'lucide-react';
import SalesTable from './SalesTable';
import DataRecommender from './DataRecommender';

interface DashboardProps {
  activeMenu: MenuId;
  salesData: SalesData[] | null;
  competitorData: CompetitorData[] | null;
  productData: ProductTrend[] | null;
  reviewData: ReviewData[] | null;
  viewAnalysis: string;
  isAnalyzing: boolean;
}

// --- SUB-COMPONENTS ---

const AIStrategyCard = ({ analysis, isAnalyzing, title }: { analysis: string, isAnalyzing: boolean, title: string }) => (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-50/50 mb-8 transition-all duration-500 hover:shadow-indigo-100/80">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border border-indigo-200">
                    <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        Gemini AI Strategy Insight
                        {isAnalyzing && <span className="text-xs font-normal text-indigo-500 animate-pulse">Thinking...</span>}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{title}</p>
                </div>
            </div>
            
            <div className="pl-13 ml-13">
                {isAnalyzing ? (
                    <div className="space-y-3 animate-pulse">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                    </div>
                ) : analysis ? (
                    <div className="prose prose-sm max-w-none text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                        {analysis}
                    </div>
                ) : (
                    <p className="text-sm text-slate-400 italic">데이터를 업로드하면 AI가 전략적 인사이트를 제공합니다.</p>
                )}
            </div>
        </div>
    </div>
);

const KPICard = ({ title, value, subtext, icon, color }: any) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-green-50 text-green-600 border-green-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
    };
    const activeColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${activeColor}`}>
                    {icon}
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    <span>Live</span>
                </div>
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
                <h4 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h4>
                <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>
            </div>
        </div>
    );
};

const ChartContainer = ({ title, subtitle, children }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full hover:border-blue-200 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    {title}
                </h3>
                {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-blue-600">
                <ArrowUpRight className="w-5 h-5" />
            </button>
        </div>
        <div className="flex-1 w-full min-h-[300px]">
            {children}
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ 
  activeMenu, salesData, competitorData, productData, reviewData, viewAnalysis, isAnalyzing
}) => {
  const hasAnyData = salesData || competitorData || productData || reviewData;

  // Render the Data Recommender first
  const renderRecommender = () => (
    <DataRecommender 
        activeMenu={activeMenu}
        hasSales={!!salesData}
        hasCompetitor={!!competitorData}
        hasProduct={!!productData}
        hasReview={!!reviewData}
    />
  );

  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-300 mx-4">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700">데이터 업로드 대기중</h3>
        <p className="text-slate-400 mt-2 max-w-md text-center">
            상단의 'Data Import Center'를 통해 Excel 또는 CSV 파일을 업로드해주세요. 
            AI가 자동으로 데이터를 분석하여 대시보드를 생성합니다.
        </p>
      </div>
    );
  }

  // --- VIEW RENDERING LOGIC ---

  // 1. FLAGSHIP VIEW (Main Sales Focus)
  if (activeMenu === 'flagship') {
      return (
          <div className="animate-fade-in pb-20">
              {renderRecommender()}
              <AIStrategyCard 
                title="Weekly Sales Performance Report" 
                analysis={viewAnalysis} 
                isAnalyzing={isAnalyzing} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <KPICard 
                    title="Total Revenue" 
                    value={salesData ? "₩" + (salesData.reduce((acc, cur) => acc + cur.actual, 0) / 100).toLocaleString() + "억" : "-"} 
                    subtext="▲ 15.3% vs Target"
                    icon={<DollarSign className="w-6 h-6" />}
                    color="blue"
                  />
                  <KPICard 
                    title="Goal Achievement" 
                    value={salesData ? Math.round((salesData.reduce((acc, c) => acc + c.actual, 0) / salesData.reduce((acc, c) => acc + c.target, 0)) * 100) + "%" : "-"} 
                    subtext="Exceeding Expectations"
                    icon={<Target className="w-6 h-6" />}
                    color="green"
                  />
                  <KPICard 
                    title="Forecasted EOM" 
                    value="₩285억" 
                    subtext="AI Prediction (Confidence 92%)"
                    icon={<BrainCircuit className="w-6 h-6" />}
                    color="purple"
                  />
              </div>

              <div className="mb-8">
                <SalesTable data={salesData} />
              </div>

              {salesData && (
                <ChartContainer title="Sales Trajectory vs Target" subtitle="Monthly Performance Analysis">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={salesData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <defs>
                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="month" scale="band" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                                cursor={{fill: '#f8fafc'}}
                            />
                            <Legend iconType="circle" />
                            <Bar dataKey="actual" name="Actual Sales" barSize={32} fill="url(#colorBar)" radius={[6, 6, 0, 0]} />
                            <Line type="monotone" dataKey="target" name="Target Goal" stroke="#ef4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartContainer>
              )}
          </div>
      );
  }

  // 2. MARKET STATUS VIEW (Competitor Focus)
  if (activeMenu === 'market') {
      return (
          <div className="animate-fade-in pb-20">
              {renderRecommender()}
              <AIStrategyCard 
                title="Competitor Market Intelligence" 
                analysis={viewAnalysis} 
                isAnalyzing={isAnalyzing} 
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {competitorData && (
                    <ChartContainer title="Competitor Positioning Radar" subtitle="Brand Strength Comparison">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={competitorData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="F&F (Our Brand)" dataKey="FnF" stroke="#4f46e5" strokeWidth={3} fill="#6366f1" fillOpacity={0.5} />
                                <Radar name="Competitor A" dataKey="CompA" stroke="#94a3b8" strokeWidth={2} fill="#94a3b8" fillOpacity={0.3} />
                                <Legend />
                                <Tooltip contentStyle={{ borderRadius: '12px' }}/>
                            </RadarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                  )}

                  {salesData && (
                      <ChartContainer title="Market Share Growth" subtitle="Sales Volume Trend">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fill="url(#colorGrowth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                  )}
              </div>
          </div>
      );
  }

  // 3. CATEGORY VIEW (Product Focus)
  if (activeMenu === 'category') {
      const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];
      return (
          <div className="animate-fade-in pb-20">
              {renderRecommender()}
              <AIStrategyCard 
                title="Product Mix & Inventory Optimization" 
                analysis={viewAnalysis} 
                isAnalyzing={isAnalyzing} 
              />
              
              {productData && (
                  <div className="mb-6 h-[400px]">
                     <ChartContainer title="Sales Velocity vs Inventory Levels" subtitle="Weekly Supply Chain Analysis">
                          <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={productData}>
                                  <CartesianGrid stroke="#f5f5f5" vertical={false} />
                                  <XAxis dataKey="week" axisLine={false} tickLine={false} />
                                  <YAxis yAxisId="left" orientation="left" stroke="#6366f1" axisLine={false} tickLine={false} />
                                  <YAxis yAxisId="right" orientation="right" stroke="#ec4899" axisLine={false} tickLine={false} />
                                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                  <Legend />
                                  <Bar yAxisId="left" dataKey="sales" name="Weekly Sales" barSize={40} fill="#6366f1" radius={[4, 4, 0, 0]} />
                                  <Line yAxisId="right" type="monotone" dataKey="inventory" name="Inventory Level" stroke="#ec4899" strokeWidth={3} dot={{r:4, fill: '#fff', strokeWidth: 2}} />
                              </ComposedChart>
                          </ResponsiveContainer>
                      </ChartContainer>
                  </div>
              )}
              
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productData && (
                        <ChartContainer title="Sales Contribution by Top SKU" subtitle="Pareto Analysis">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={productData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="sales"
                                        >
                                            {productData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{borderRadius: '12px'}} />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                        </ChartContainer>
                    )}
                    {/* Placeholder for Product Table or another chart */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white flex flex-col justify-center shadow-lg relative overflow-hidden">
                        <Activity className="w-32 h-32 absolute -right-4 -bottom-4 text-white opacity-10" />
                        <h3 className="text-2xl font-bold mb-2">Top Mover Alert</h3>
                        <p className="opacity-90 mb-6">Product 'SKU-A01' is selling 20% faster than anticipated. Restock recommended immediately.</p>
                        <button className="w-fit bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition">
                            View Supply Chain
                        </button>
                    </div>
               </div>
          </div>
      );
  }

  // 4. VOC VIEW (Review Focus)
  if (activeMenu === 'voc') {
      return (
          <div className="animate-fade-in pb-20">
               {renderRecommender()}
               <AIStrategyCard 
                title="Customer Sentiment & Feedback Analysis" 
                analysis={viewAnalysis} 
                isAnalyzing={isAnalyzing} 
              />

               {reviewData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ChartContainer title="Key Sentiment Drivers" subtitle="Frequency of keywords in positive reviews">
                            <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reviewData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{fontSize: 12, fontWeight: 600}} width={80} axisLine={false} tickLine={false}/>
                                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px'}} />
                                <Bar dataKey="value" name="Mentions" fill="#f43f5e" radius={[0, 6, 6, 0]} barSize={32}>
                                    {reviewData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f43f5e' : '#fb7185'} />
                                    ))}
                                </Bar>
                            </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <h4 className="text-slate-500 text-sm font-medium mb-2">Net Promoter Score</h4>
                            <div className="text-5xl font-bold text-slate-800 mb-2">72</div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Excellent</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                             <h4 className="text-slate-500 text-sm font-medium mb-2">Total Reviews</h4>
                             <div className="text-4xl font-bold text-slate-800 mb-2">{reviewData.reduce((acc, curr) => acc + curr.value, 0)}</div>
                             <p className="text-xs text-slate-400">Last 30 Days</p>
                        </div>
                    </div>
                </div>
               )}
          </div>
      );
  }
  
  // Default / Other Views (Fallback)
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <AIStrategyCard 
         title="General Market Overview" 
         analysis={viewAnalysis || "데이터가 충분하지 않아 상세 분석을 생성할 수 없습니다. 관련 데이터를 업로드해주세요."} 
         isAnalyzing={isAnalyzing} 
      />
      {salesData && <SalesTable data={salesData} />}
    </div>
  );
};

export default Dashboard;