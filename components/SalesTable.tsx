import React from 'react';
import { SalesData } from '../types';

interface SalesTableProps {
  data: SalesData[] | null;
}

const SalesTable: React.FC<SalesTableProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-lg">매출 현황 상세 (Sales Detail)</h3>
        <p className="text-xs text-slate-500">단위: 백만원 (성장율 제외)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-center w-1/4">구분 (Month)</th>
              <th className="px-6 py-4 text-right">목표 (Target)</th>
              <th className="px-6 py-4 text-right">실적 (Actual)</th>
              <th className="px-6 py-4 text-center">달성률 (Achievement)</th>
              <th className="px-6 py-4 text-center">성장 (Growth)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => {
              const achievement = row.target > 0 ? ((row.actual / row.target) * 100).toFixed(1) : 0;
              const isPositive = Number(achievement) >= 100;
              return (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 text-center bg-slate-50/30">{row.month}</td>
                  <td className="px-6 py-4 text-right text-slate-600">{row.target.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">{row.actual.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {achievement}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-slate-500">
                    {/* Mock growth calculation since we don't have prev year data in simple model */}
                    <span className={isPositive ? 'text-green-600' : 'text-red-500'}>
                       {isPositive ? '▲' : '▼'} {Math.abs(Number(achievement) - 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
             {/* Summary Row */}
            <tr className="bg-blue-50 font-bold border-t-2 border-blue-100">
                <td className="px-6 py-4 text-center text-blue-900">합계 (Total)</td>
                <td className="px-6 py-4 text-right text-blue-900">
                    {data.reduce((acc, cur) => acc + (cur.target || 0), 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right text-blue-900">
                    {data.reduce((acc, cur) => acc + (cur.actual || 0), 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center text-blue-700">-</td>
                <td className="px-6 py-4 text-center text-blue-700">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;