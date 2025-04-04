
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { CheckCircle2, Circle } from 'lucide-react';

const MissionsTab: React.FC = () => {
  const { missions, completeMission, products, team, bankLevel } = useGame();

  const getMissionIcon = (mission: any) => {
    switch (mission.type) {
      case 'product':
        return '📊';
      case 'team':
        return '👥';
      case 'bank':
        return '🏢';
      default:
        return '📋';
    }
  };

  const canCompleteMission = (mission: any) => {
    if (mission.completed) return false;
    
    if (mission.type === 'product' && mission.relatedTo) {
      const product = products.find(p => p.id === mission.relatedTo);
      return product && product.unlocked;
    }
    
    if (mission.type === 'team' && mission.relatedTo) {
      const member = team.find(m => m.id === mission.relatedTo);
      return member && member.unlocked;
    }
    
    if (mission.type === 'bank') {
      return bankLevel !== 'office';
    }
    
    return true;
  };

  return (
    <div className="p-4 pb-16">
      <h2 className="text-xl font-bold text-center mb-6">Ежедневные миссии</h2>
      
      <div className="space-y-4">
        {missions.map(mission => (
          <div 
            key={mission.id}
            className={`card-mission ${mission.completed ? 'bg-bank-green/30' : ''}`}
          >
            <div className="text-2xl">
              {getMissionIcon(mission)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{mission.title}</h3>
                {mission.completed ? (
                  <CheckCircle2 className="text-green-600" size={20} />
                ) : (
                  <Circle size={20} className="text-gray-300" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{mission.description}</p>
              <div className="flex justify-between">
                <div className="flex gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="mr-1">📚</span>
                    <span>{mission.knowledgeReward}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">❤️</span>
                    <span>{mission.trustReward}</span>
                  </div>
                </div>
                {!mission.completed && (
                  <button
                    className={`btn-primary text-sm py-1 ${!canCompleteMission(mission) ? 'opacity-50' : ''}`}
                    disabled={!canCompleteMission(mission)}
                    onClick={() => canCompleteMission(mission) && completeMission(mission.id)}
                  >
                    Выполнить
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {missions.every(m => m.completed) && (
        <div className="text-center mt-6 p-4 bg-bank-green rounded-lg">
          <h3 className="font-semibold mb-2">Все миссии выполнены!</h3>
          <p className="text-sm text-gray-600">Скоро появятся новые задания.</p>
        </div>
      )}
    </div>
  );
};

export default MissionsTab;
