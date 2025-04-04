
import React from 'react';
import { useGame } from '../../contexts/GameContext';

const BankTab: React.FC = () => {
  const { 
    bankLevel, 
    upgradeBank, 
    getBankUpgradeCost,
    knowledgePoints,
    trustPoints 
  } = useGame();

  const getUpgradeCost = () => {
    const cost = getBankUpgradeCost();
    return cost.knowledge > 0 ? cost : null;
  };

  const getBankImage = () => {
    switch (bankLevel) {
      case 'office':
        return "🏢";
      case 'branch':
        return "🏛️";
      case 'headquarters':
        return "🏙️";
      default:
        return "🏢";
    }
  };

  const getBankName = () => {
    switch (bankLevel) {
      case 'office':
        return "Офис";
      case 'branch':
        return "Филиал";
      case 'headquarters':
        return "Головной офис";
      default:
        return "Офис";
    }
  };

  const upgradeCost = getUpgradeCost();
  const canUpgrade = upgradeCost && 
    knowledgePoints >= upgradeCost.knowledge && 
    trustPoints >= upgradeCost.trust;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-center mb-6">Ваш банк</h2>
      
      <div className="bank-building animate-bounce-light">
        <div className="text-8xl text-center">{getBankImage()}</div>
      </div>
      
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">{getBankName()}</h3>
        <p className="text-sm text-gray-600">
          {bankLevel === 'office' && "Небольшой офис с минимальным набором услуг"}
          {bankLevel === 'branch' && "Просторный филиал со всеми банковскими продуктами"}
          {bankLevel === 'headquarters' && "Впечатляющий главный офис банка"}
        </p>
      </div>
      
      {upgradeCost && (
        <div className="bg-bank-yellow p-4 rounded-lg mb-4 text-center">
          <h3 className="font-semibold mb-2">
            {bankLevel === 'office' 
              ? "Улучшить до филиала" 
              : "Улучшить до головного офиса"}
          </h3>
          <div className="flex justify-center gap-4 mb-3">
            <div className="flex items-center">
              <span className="mr-1">📚</span>
              <span>{upgradeCost.knowledge}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">❤️</span>
              <span>{upgradeCost.trust}</span>
            </div>
          </div>
          <button 
            className={`btn-primary w-full ${!canUpgrade ? 'opacity-50' : ''}`}
            disabled={!canUpgrade}
            onClick={upgradeBank}
          >
            Улучшить здание
          </button>
        </div>
      )}
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-border">
        <h3 className="font-semibold mb-2">Что дает улучшение?</h3>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span>🏛️</span>
            <span>Филиал - открывает доступ к ипотечным продуктам</span>
          </li>
          <li className="flex items-start gap-2">
            <span>🏙️</span>
            <span>Головной офис - увеличивает бонусы от всех сотрудников</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BankTab;
