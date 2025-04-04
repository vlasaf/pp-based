
import React, { createContext, useContext, useState, useEffect } from 'react';

export type BankLevel = 'office' | 'branch' | 'headquarters';
export type TeamMember = 'manager' | 'analyst' | 'mentor' | 'accountant' | 'specialist';
export type ProductType = 'deposits' | 'credits' | 'cards' | 'mortgage';

export interface Product {
  id: ProductType;
  name: string;
  icon: string;
  unlocked: boolean;
  level: number;
  description: string;
  pointsPerSecond: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  knowledgeReward: number;
  trustReward: number;
  completed: boolean;
  type: 'product' | 'team' | 'bank';
  relatedTo?: ProductType | TeamMember;
}

export interface TeamMemberData {
  id: TeamMember;
  name: string;
  icon: string;
  role: string;
  unlocked: boolean;
  trustBonus: number;
  knowledgeBonus: number;
  description: string;
  cost: { knowledge: number; trust: number };
}

interface GameContextType {
  // Core game stats
  playerName: string;
  playerLevel: number;
  knowledgePoints: number;
  trustPoints: number;
  bankLevel: BankLevel;
  autoKnowledgePerSecond: number;
  
  // Collections
  products: Product[];
  team: TeamMemberData[];
  missions: Mission[];
  
  // Methods
  addKnowledgePoints: (amount: number) => void;
  addTrustPoints: (amount: number) => void;
  upgradeBank: () => void;
  upgradeProduct: (productId: ProductType) => void;
  unlockTeamMember: (memberId: TeamMember) => void;
  completeMission: (missionId: string) => void;
  getBankUpgradeCost: () => { knowledge: number; trust: number };
  calculatePlayerLevel: () => number;
  setTab: (tab: TabType) => void;
  currentTab: TabType;
  resetGame: () => void;
}

export type TabType = 'bank' | 'products' | 'team' | 'missions' | 'progress';

const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission-1',
    title: 'Изучить дебетовые карты',
    description: 'Пройдите обучающий модуль по дебетовым картам',
    knowledgeReward: 100,
    trustReward: 20,
    completed: false,
    type: 'product',
    relatedTo: 'cards',
  },
  {
    id: 'mission-2',
    title: 'Познакомиться с менеджером',
    description: 'Пройдите диалог с менеджером команды',
    knowledgeReward: 50,
    trustReward: 50,
    completed: false,
    type: 'team',
    relatedTo: 'manager',
  },
  {
    id: 'mission-3',
    title: 'Улучшить офис',
    description: 'Соберите достаточно ресурсов и улучшите офис до филиала',
    knowledgeReward: 200,
    trustReward: 100,
    completed: false,
    type: 'bank',
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'deposits',
    name: 'Вклады',
    icon: '💰',
    unlocked: true,
    level: 1,
    description: 'Депозитные продукты для накопления средств клиентов',
    pointsPerSecond: 0,
  },
  {
    id: 'credits',
    name: 'Кредиты',
    icon: '💳',
    unlocked: true,
    level: 1,
    description: 'Кредитные продукты для физических лиц',
    pointsPerSecond: 0,
  },
  {
    id: 'cards',
    name: 'Карты',
    icon: '💳',
    unlocked: true,
    level: 1,
    description: 'Дебетовые и кредитные карты',
    pointsPerSecond: 0,
  },
  {
    id: 'mortgage',
    name: 'Ипотека',
    icon: '🏠',
    unlocked: false,
    level: 0,
    description: 'Ипотечные кредиты и программы',
    pointsPerSecond: 0,
  },
];

const INITIAL_TEAM: TeamMemberData[] = [
  {
    id: 'manager',
    name: 'Менеджер',
    icon: '👨‍💼',
    role: 'Руководитель',
    unlocked: true,
    trustBonus: 1,
    knowledgeBonus: 0,
    description: 'Введет вас в курс дела и поможет с организационными вопросами',
    cost: { knowledge: 0, trust: 0 },
  },
  {
    id: 'analyst',
    name: 'Аналитик',
    icon: '👩‍💻',
    role: 'Финансовый аналитик',
    unlocked: false,
    trustBonus: 0,
    knowledgeBonus: 2,
    description: 'Поможет разобраться в финансовых показателях и отчетности',
    cost: { knowledge: 300, trust: 100 },
  },
  {
    id: 'mentor',
    name: 'Наставник',
    icon: '👨‍🏫',
    role: 'Куратор новичков',
    unlocked: false,
    trustBonus: 1,
    knowledgeBonus: 1,
    description: 'Поможет быстрее освоиться в банке и изучить его продукты',
    cost: { knowledge: 200, trust: 200 },
  },
  {
    id: 'accountant',
    name: 'Бухгалтер',
    icon: '👩‍💼',
    role: 'Главный бухгалтер',
    unlocked: false,
    trustBonus: 1,
    knowledgeBonus: 1,
    description: 'Расскажет о финансовой отчетности и бухгалтерии банка',
    cost: { knowledge: 500, trust: 150 },
  },
  {
    id: 'specialist',
    name: 'Ипотечный специалист',
    icon: '👨‍✈️',
    role: 'Эксперт по ипотеке',
    unlocked: false,
    trustBonus: 0,
    knowledgeBonus: 3,
    description: 'Поможет разобраться во всех нюансах ипотечных продуктов',
    cost: { knowledge: 700, trust: 300 },
  },
];

const initialState = {
  playerName: 'Новичок',
  playerLevel: 1,
  knowledgePoints: 100,
  trustPoints: 50,
  bankLevel: 'office' as BankLevel,
  autoKnowledgePerSecond: 0,
  products: INITIAL_PRODUCTS,
  team: INITIAL_TEAM,
  missions: INITIAL_MISSIONS,
  currentTab: 'bank' as TabType,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerName, setPlayerName] = useState(initialState.playerName);
  const [playerLevel, setPlayerLevel] = useState(initialState.playerLevel);
  const [knowledgePoints, setKnowledgePoints] = useState(initialState.knowledgePoints);
  const [trustPoints, setTrustPoints] = useState(initialState.trustPoints);
  const [bankLevel, setBankLevel] = useState(initialState.bankLevel);
  const [autoKnowledgePerSecond, setAutoKnowledgePerSecond] = useState(initialState.autoKnowledgePerSecond);
  const [products, setProducts] = useState(initialState.products);
  const [team, setTeam] = useState(initialState.team);
  const [missions, setMissions] = useState(initialState.missions);
  const [currentTab, setCurrentTab] = useState<TabType>(initialState.currentTab);

  // Auto-generate knowledge points based on product levels
  useEffect(() => {
    if (autoKnowledgePerSecond > 0) {
      const timer = setInterval(() => {
        setKnowledgePoints(prev => prev + autoKnowledgePerSecond);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [autoKnowledgePerSecond]);

  // Calculate auto-knowledge per second based on product levels
  useEffect(() => {
    const total = products.reduce((sum, product) => {
      return sum + (product.unlocked ? product.pointsPerSecond : 0);
    }, 0);
    
    setAutoKnowledgePerSecond(total);
  }, [products]);

  const addKnowledgePoints = (amount: number) => {
    setKnowledgePoints(prev => prev + amount);
    calculatePlayerLevel();
  };

  const addTrustPoints = (amount: number) => {
    setTrustPoints(prev => prev + amount);
    calculatePlayerLevel();
  };

  const upgradeBank = () => {
    const cost = getBankUpgradeCost();
    
    if (knowledgePoints >= cost.knowledge && trustPoints >= cost.trust) {
      setKnowledgePoints(prev => prev - cost.knowledge);
      setTrustPoints(prev => prev - cost.trust);
      
      if (bankLevel === 'office') {
        setBankLevel('branch');
        // Unlock mortgage product
        setProducts(prev => 
          prev.map(p => p.id === 'mortgage' ? { ...p, unlocked: true, level: 1 } : p)
        );
      } else if (bankLevel === 'branch') {
        setBankLevel('headquarters');
      }
    }
  };

  const upgradeProduct = (productId: ProductType) => {
    const product = products.find(p => p.id === productId);
    
    if (!product || !product.unlocked) return;
    
    const upgradeCost = 100 * (product.level + 1);
    
    if (knowledgePoints >= upgradeCost) {
      setKnowledgePoints(prev => prev - upgradeCost);
      
      setProducts(prev => 
        prev.map(p => 
          p.id === productId
            ? { 
                ...p, 
                level: p.level + 1,
                pointsPerSecond: p.pointsPerSecond + 1
              }
            : p
        )
      );
    }
  };

  const unlockTeamMember = (memberId: TeamMember) => {
    const member = team.find(m => m.id === memberId);
    
    if (!member || member.unlocked) return;
    
    if (knowledgePoints >= member.cost.knowledge && trustPoints >= member.cost.trust) {
      setKnowledgePoints(prev => prev - member.cost.knowledge);
      setTrustPoints(prev => prev - member.cost.trust);
      
      setTeam(prev => 
        prev.map(m => 
          m.id === memberId
            ? { ...m, unlocked: true }
            : m
        )
      );
      
      // Boost auto-knowledge based on the team member's bonus
      if (member.knowledgeBonus > 0) {
        setProducts(prev => 
          prev.map(p => 
            p.unlocked
              ? { ...p, pointsPerSecond: p.pointsPerSecond + member.knowledgeBonus }
              : p
          )
        );
      }
    }
  };

  const completeMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    
    if (!mission || mission.completed) return;
    
    setMissions(prev => 
      prev.map(m => 
        m.id === missionId
          ? { ...m, completed: true }
          : m
      )
    );
    
    addKnowledgePoints(mission.knowledgeReward);
    addTrustPoints(mission.trustReward);
  };

  const getBankUpgradeCost = () => {
    if (bankLevel === 'office') {
      return { knowledge: 500, trust: 200 };
    } else if (bankLevel === 'branch') {
      return { knowledge: 2000, trust: 800 };
    }
    // If already at headquarters
    return { knowledge: 0, trust: 0 };
  };

  const calculatePlayerLevel = () => {
    // Simple level calculation based on total points
    const total = knowledgePoints + (trustPoints * 2);
    const newLevel = Math.floor(total / 500) + 1;
    
    if (newLevel !== playerLevel) {
      setPlayerLevel(newLevel);
    }
    
    return newLevel;
  };

  const setTab = (tab: TabType) => {
    setCurrentTab(tab);
  };

  const resetGame = () => {
    setPlayerName(initialState.playerName);
    setPlayerLevel(initialState.playerLevel);
    setKnowledgePoints(initialState.knowledgePoints);
    setTrustPoints(initialState.trustPoints);
    setBankLevel(initialState.bankLevel);
    setAutoKnowledgePerSecond(initialState.autoKnowledgePerSecond);
    setProducts(initialState.products);
    setTeam(initialState.team);
    setMissions(initialState.missions);
    setCurrentTab(initialState.currentTab);
  };

  return (
    <GameContext.Provider
      value={{
        playerName,
        playerLevel,
        knowledgePoints,
        trustPoints,
        bankLevel,
        autoKnowledgePerSecond,
        products,
        team,
        missions,
        addKnowledgePoints,
        addTrustPoints,
        upgradeBank,
        upgradeProduct,
        unlockTeamMember,
        completeMission,
        getBankUpgradeCost,
        calculatePlayerLevel,
        setTab,
        currentTab,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
};
