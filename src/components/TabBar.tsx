
import React from 'react';
import { Building2, Briefcase, Users, Target, BarChart3 } from 'lucide-react';
import { useGame, TabType } from '../contexts/GameContext';

const TabBar: React.FC = () => {
  const { currentTab, setTab } = useGame();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'bank', label: 'Банк', icon: <Building2 size={20} /> },
    { id: 'products', label: 'Продукты', icon: <Briefcase size={20} /> },
    { id: 'team', label: 'Команда', icon: <Users size={20} /> },
    { id: 'missions', label: 'Миссии', icon: <Target size={20} /> },
    { id: 'progress', label: 'Прогресс', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="flex justify-between bg-white rounded-t-xl shadow-sm fixed bottom-0 left-0 right-0 border-t">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${currentTab === tab.id ? 'active' : ''}`}
          onClick={() => setTab(tab.id)}
        >
          {tab.icon}
          <span className="text-xs">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabBar;
