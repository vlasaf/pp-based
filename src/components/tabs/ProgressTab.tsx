
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { BarChart3, Award, Building2 } from 'lucide-react';

const ProgressTab: React.FC = () => {
  const { 
    playerLevel, 
    knowledgePoints, 
    trustPoints, 
    bankLevel,
    products,
    team,
    missions,
    autoKnowledgePerSecond
  } = useGame();

  const getCompletedMissions = () => {
    return missions.filter(m => m.completed).length;
  };

  const getUnlockedProducts = () => {
    return products.filter(p => p.unlocked).length;
  };

  const getUnlockedTeamMembers = () => {
    return team.filter(m => m.unlocked).length;
  };

  const getBankLevelName = () => {
    switch (bankLevel) {
      case 'office':
        return 'Офис';
      case 'branch':
        return 'Филиал';
      case 'headquarters':
        return 'Головной офис';
      default:
        return 'Офис';
    }
  };

  const progressItems = [
    {
      title: 'Уровень игрока',
      value: playerLevel,
      icon: <Award className="text-yellow-500" />,
      description: 'Ваш текущий уровень в игре',
    },
    {
      title: 'Выполнено миссий',
      value: `${getCompletedMissions()}/${missions.length}`,
      icon: <BarChart3 className="text-blue-500" />,
      description: 'Количество завершенных миссий',
    },
    {
      title: 'Изучено продуктов',
      value: `${getUnlockedProducts()}/${products.length}`,
      icon: <Building2 className="text-green-500" />,
      description: 'Количество изученных банковских продуктов',
    },
    {
      title: 'Разблокировано сотрудников',
      value: `${getUnlockedTeamMembers()}/${team.length}`,
      icon: <Building2 className="text-purple-500" />,
      description: 'Количество разблокированных членов команды',
    },
  ];

  return (
    <div className="p-4 pb-16">
      <h2 className="text-xl font-bold text-center mb-6">Ваш прогресс</h2>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-border mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold">Статус банка</h3>
            <p className="text-sm text-gray-600">{getBankLevelName()}</p>
          </div>
          <div className="text-4xl">
            {bankLevel === 'office' && '🏢'}
            {bankLevel === 'branch' && '🏛️'}
            {bankLevel === 'headquarters' && '🏙️'}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Очки знаний</span>
            <span className="font-medium">{Math.floor(knowledgePoints)} 📚</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Баллы доверия</span>
            <span className="font-medium">{trustPoints} ❤️</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Автоматический доход</span>
            <span className="font-medium">{autoKnowledgePerSecond} 📚/сек</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {progressItems.map((item, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-border"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{item.value}</span>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTab;
