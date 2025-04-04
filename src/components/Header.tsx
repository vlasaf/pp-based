
import React from 'react';
import { useGame } from '../contexts/GameContext';

const Header: React.FC = () => {
  const { playerName, playerLevel, knowledgePoints, trustPoints, autoKnowledgePerSecond } = useGame();

  return (
    <div className="bg-bank-blue rounded-b-xl shadow-sm p-4 mb-4">
      <h1 className="text-xl font-bold text-center mb-2">Добро пожаловать в твой первый банк!</h1>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Игрок: {playerName}</span>
          <span className="text-sm text-gray-600">Уровень: {playerLevel}</span>
        </div>
        <div className="flex gap-2">
          <div className="resource-badge bg-knowledge text-white">
            <span className="mr-1">📚</span>
            <span>{Math.floor(knowledgePoints)}</span>
            {autoKnowledgePerSecond > 0 && (
              <span className="text-xs ml-1">+{autoKnowledgePerSecond}/с</span>
            )}
          </div>
          <div className="resource-badge bg-trust text-white">
            <span className="mr-1">❤️</span>
            <span>{trustPoints}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
