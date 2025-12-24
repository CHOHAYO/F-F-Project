import React from 'react';
import { 
  LayoutDashboard, 
  BarChart2, 
  PieChart, 
  ShoppingCart, 
  MapPin, 
  Users, 
  DollarSign, 
  Target 
} from 'lucide-react';
import { MenuId } from '../types';

interface SidebarProps {
  activeMenu: MenuId;
  onMenuClick: (id: MenuId) => void;
}

const MENU_ITEMS: { id: MenuId; label: string; icon: React.ReactNode }[] = [
  { id: 'flagship', label: 'Flagship', icon: <Target className="w-5 h-5" /> },
  { id: 'market', label: 'Market Status', icon: <BarChart2 className="w-5 h-5" /> },
  { id: 'sales_review', label: 'Sales Review', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'category', label: 'Category', icon: <ShoppingCart className="w-5 h-5" /> },
  { id: 'channel', label: 'Channel', icon: <MapPin className="w-5 h-5" /> },
  { id: 'voc', label: 'VOC', icon: <Users className="w-5 h-5" /> },
  { id: 'profit', label: 'Profit', icon: <DollarSign className="w-5 h-5" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuClick }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 z-40 hidden lg:flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
          Sales Analysis
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Dashboard Menu</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {MENU_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onMenuClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  ${activeMenu === item.id 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <span className={activeMenu === item.id ? 'text-blue-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
           <p className="text-xs text-slate-500 font-medium">System Status</p>
           <div className="flex items-center gap-2 mt-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs text-slate-700">Online</span>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;