
import React, { useState } from 'react';
import { useGame, TeamMember } from '../../contexts/GameContext';

const TeamTab: React.FC = () => {
  const { team, unlockTeamMember, knowledgePoints, trustPoints, completeMission } = useGame();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogStep, setDialogStep] = useState(0);

  const handleMemberClick = (memberId: TeamMember) => {
    const member = team.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(memberId);
      if (member.unlocked) {
        setShowDialog(true);
        setDialogStep(0);
      }
    }
  };

  const nextDialogStep = () => {
    if (dialogStep < getDialogForMember().length - 1) {
      setDialogStep(prev => prev + 1);
    } else {
      setShowDialog(false);
      setDialogStep(0);
      // Complete related mission if exists
      if (selectedMember === 'manager') {
        completeMission('mission-2');
      }
    }
  };

  const getDialogForMember = () => {
    if (!selectedMember) return [];
    
    const dialogs: Record<TeamMember, {speaker: string, text: string}[]> = {
      manager: [
        { speaker: 'Менеджер', text: 'Добро пожаловать в наш банк! Рад видеть нового сотрудника.' },
        { speaker: 'Вы', text: 'Спасибо! Я очень рад присоединиться к команде.' },
        { speaker: 'Менеджер', text: 'В нашем банке важно знать продукты и уметь работать с клиентами.' },
        { speaker: 'Менеджер', text: 'Изучайте продукты, выполняйте миссии и развивайте свой офис!' },
        { speaker: 'Вы', text: 'Буду стараться! Мне уже не терпится начать.' },
        { speaker: 'Менеджер', text: 'Отлично! Если возникнут вопросы, всегда обращайтесь ко мне или другим коллегам.' },
      ],
      analyst: [
        { speaker: 'Аналитик', text: 'Привет! Я финансовый аналитик нашего банка.' },
        { speaker: 'Вы', text: 'Привет! Чем ты занимаешься?' },
        { speaker: 'Аналитик', text: 'Я анализирую финансовые показатели и помогаю принимать бизнес-решения.' },
        { speaker: 'Аналитик', text: 'В банковской сфере очень важно уметь работать с цифрами и понимать тренды.' },
        { speaker: 'Вы', text: 'Звучит интересно! Какие навыки нужны для такой работы?' },
        { speaker: 'Аналитик', text: 'Аналитическое мышление, внимание к деталям и хорошее знание Excel и SQL.' },
      ],
      mentor: [
        { speaker: 'Наставник', text: 'Здравствуйте! Я буду вашим наставником в первые месяцы работы.' },
        { speaker: 'Вы', text: 'Здравствуйте! Рад познакомиться.' },
        { speaker: 'Наставник', text: 'Моя задача - помочь вам быстрее адаптироваться и освоить все процессы.' },
        { speaker: 'Наставник', text: 'Не стесняйтесь задавать вопросы, даже если они кажутся простыми.' },
        { speaker: 'Вы', text: 'Спасибо за поддержку! Обязательно буду обращаться.' },
        { speaker: 'Наставник', text: 'Отлично! Вместе мы сделаем ваш онбординг максимально эффективным.' },
      ],
      accountant: [
        { speaker: 'Бухгалтер', text: 'Добрый день! Я главный бухгалтер нашего банка.' },
        { speaker: 'Вы', text: 'Добрый день! Рад знакомству.' },
        { speaker: 'Бухгалтер', text: 'В мои обязанности входит финансовая отчетность и контроль бюджета.' },
        { speaker: 'Бухгалтер', text: 'Если у вас будут вопросы по расчету зарплаты или компенсациям, обращайтесь.' },
        { speaker: 'Вы', text: 'Обязательно! А какие отчеты самые важные для банка?' },
        { speaker: 'Бухгалтер', text: 'Баланс и отчет о прибылях и убытках - это основа финансовой отчетности банка.' },
      ],
      specialist: [
        { speaker: 'Ипотечный специалист', text: 'Приветствую! Я специализируюсь на ипотечных продуктах.' },
        { speaker: 'Вы', text: 'Здравствуйте! Ипотека - это сложный продукт?' },
        { speaker: 'Ипотечный специалист', text: 'Ипотека имеет много нюансов, но это очень важный продукт для банка.' },
        { speaker: 'Ипотечный специалист', text: 'Мы помогаем клиентам приобрести жильё - это большая ответственность.' },
        { speaker: 'Вы', text: 'Какие знания нужны для работы с ипотекой?' },
        { speaker: 'Ипотечный специалист', text: 'Нужно хорошо знать условия программ, уметь оценивать риски и работать с документами.' },
      ],
    };
    
    return dialogs[selectedMember] || [];
  };

  const selectedMemberData = selectedMember 
    ? team.find(m => m.id === selectedMember) 
    : null;
  
  const dialog = getDialogForMember();
  const currentDialog = dialog[dialogStep];

  return (
    <div className="p-4 pb-16">
      {!selectedMember ? (
        <>
          <h2 className="text-xl font-bold text-center mb-6">Ваша команда</h2>
          <div className="grid grid-cols-2 gap-4">
            {team.map(member => (
              <div
                key={member.id}
                className={`card-product ${!member.unlocked ? 'opacity-50' : ''} ${member.unlocked ? 'animate-pulse-light' : ''}`}
                onClick={() => handleMemberClick(member.id as TeamMember)}
              >
                <div className="text-4xl mb-2">{member.icon}</div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <div className="text-xs text-gray-600">{member.role}</div>
                {!member.unlocked && (
                  <div className="flex justify-center gap-2 mt-2 text-xs">
                    <div className="flex items-center">
                      <span className="mr-1">📚</span>
                      <span>{member.cost.knowledge}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">❤️</span>
                      <span>{member.cost.trust}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : showDialog ? (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-border">
          <div className="flex gap-3 items-center mb-4">
            <div className="text-3xl">{selectedMemberData?.icon}</div>
            <h3 className="font-semibold">{currentDialog?.speaker}</h3>
          </div>
          <p className="mb-6 bg-bank-peach p-3 rounded-lg">{currentDialog?.text}</p>
          <button
            className="btn-primary w-full"
            onClick={nextDialogStep}
          >
            {dialogStep < dialog.length - 1 ? 'Далее' : 'Завершить'}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-4">
            <button
              className="tap-highlight text-blue-500"
              onClick={() => setSelectedMember(null)}
            >
              ← Назад
            </button>
            <h2 className="text-xl font-bold text-center flex-1">
              {selectedMemberData?.name}
            </h2>
          </div>
          
          <div className="text-6xl text-center my-6">
            {selectedMemberData?.icon}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-border mb-4">
            <h3 className="font-semibold mb-2">{selectedMemberData?.role}</h3>
            <p className="text-sm">{selectedMemberData?.description}</p>
            {selectedMemberData?.unlocked ? (
              <div className="mt-2 space-y-1 text-sm">
                {selectedMemberData.knowledgeBonus > 0 && (
                  <div>Бонус знаний: +{selectedMemberData.knowledgeBonus} к продуктам</div>
                )}
                {selectedMemberData.trustBonus > 0 && (
                  <div>Бонус доверия: +{selectedMemberData.trustBonus} к миссиям</div>
                )}
              </div>
            ) : (
              <div className="flex justify-center gap-4 mt-3">
                <div className="flex items-center">
                  <span className="mr-1">📚</span>
                  <span>{selectedMemberData?.cost.knowledge}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">❤️</span>
                  <span>{selectedMemberData?.cost.trust}</span>
                </div>
              </div>
            )}
          </div>
          
          {selectedMemberData?.unlocked ? (
            <button
              className="btn-primary w-full"
              onClick={() => setShowDialog(true)}
            >
              Поговорить
            </button>
          ) : (
            <button
              className={`btn-primary w-full ${
                knowledgePoints < (selectedMemberData?.cost.knowledge || 0) || 
                trustPoints < (selectedMemberData?.cost.trust || 0)
                  ? 'opacity-50'
                  : ''
              }`}
              disabled={
                knowledgePoints < (selectedMemberData?.cost.knowledge || 0) || 
                trustPoints < (selectedMemberData?.cost.trust || 0)
              }
              onClick={() => selectedMember && unlockTeamMember(selectedMember)}
            >
              Разблокировать
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamTab;
