import React from 'react';
import { 
  Target, BarChart2, LayoutDashboard, ShoppingCart, MapPin, Users, DollarSign 
} from 'lucide-react';
import { MenuId } from '../types';

interface NavTabsProps {
  activeTab: MenuId;
  onTabClick: (id: MenuId) => void;
}

const TABS: { id: MenuId; label: string; icon: React.ReactNode }[] = [
  { id: 'flagship', label: 'Flagship', icon: <Target className="w-4 h-4" /> },
  { id: 'market', label: 'Market Status', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'sales_review', label: 'Sales Review', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'category', label: 'Category', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'channel', label: 'Channel', icon: <MapPin className="w-4 h-4" /> },
  { id: 'voc', label: 'VOC', icon: <Users className="w-4 h-4" /> },
  { id: 'profit', label: 'Profit', icon: <DollarSign className="w-4 h-4" /> },
];

const NavTabs: React.FC<NavTabsProps> = ({ activeTab, onTabClick }) => {
  return (
    <div className="bg-white border rounded-xl border-slate-200 p-1.5 flex items-center justify-between gap-1 overflow-x-auto shadow-sm mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={`
            flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
            ${activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NavTabs;