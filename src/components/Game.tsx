
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import Header from './Header';
import TabBar from './TabBar';
import BankTab from './tabs/BankTab';
import ProductsTab from './tabs/ProductsTab';
import TeamTab from './tabs/TeamTab';
import MissionsTab from './tabs/MissionsTab';
import ProgressTab from './tabs/ProgressTab';
import { Button } from '@/components/ui/button';

const Game: React.FC = () => {
  const { currentTab, addKnowledgePoints, knowledgePoints } = useGame();
  const [showStartScreen, setShowStartScreen] = useState(true);
  
  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'bank':
        return <BankTab />;
      case 'products':
        return <ProductsTab />;
      case 'team':
        return <TeamTab />;
      case 'missions':
        return <MissionsTab />;
      case 'progress':
        return <ProgressTab />;
      default:
        return <BankTab />;
    }
  };

  const handleStartGame = () => {
    setShowStartScreen(false);
  };

  if (showStartScreen) {
    return (
      <div className="min-h-screen bg-bank-blue/30 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-8xl mb-6 animate-bounce-light">🏦</div>
          <h1 className="text-2xl font-bold text-center mb-4">Добро пожаловать в твой первый банк!</h1>
          <p className="text-center mb-8 text-gray-600">
            Развивай свой банк, изучай продукты и собирай команду профессионалов
          </p>
          <Button 
            className="btn-primary text-lg px-8 py-4 animate-pulse-light"
            onClick={handleStartGame}
          >
            Начать обучение
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bank-blue/30 flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto pb-16">
        {renderCurrentTab()}
      </div>
      <TabBar />
    </div>
  );
};

export default Game;
