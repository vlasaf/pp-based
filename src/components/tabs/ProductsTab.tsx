
import React, { useState } from 'react';
import { useGame, ProductType } from '../../contexts/GameContext';

const ProductsTab: React.FC = () => {
  const { products, upgradeProduct, knowledgePoints, completeMission } = useGame();
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleProductClick = (productId: ProductType) => {
    const product = products.find(p => p.id === productId);
    if (product && product.unlocked) {
      setSelectedProduct(productId);
      setShowQuiz(false);
    }
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      if (currentQuestion < 2) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Quiz completed
        if (selectedProduct) {
          upgradeProduct(selectedProduct);
          // Complete related mission if exists
          const relatedMission = 'mission-1';
          completeMission(relatedMission);
        }
        setShowQuiz(false);
      }
    } else {
      // Incorrect answer
      alert('Неверный ответ. Попробуйте еще раз!');
    }
  };

  const getProductQuestions = (productId: ProductType) => {
    // Simple questions for each product
    const questionSets = {
      deposits: [
        {
          question: 'Какое преимущество дает клиенту накопительный вклад?',
          options: [
            { text: 'Возможность быстро снять деньги без потери процентов', correct: false },
            { text: 'Более высокая процентная ставка', correct: true },
            { text: 'Отсутствие налогообложения', correct: false },
          ],
        },
        {
          question: 'Какой вклад подойдет клиенту, который планирует копить на первый взнос по ипотеке?',
          options: [
            { text: 'Вклад с возможностью частичного снятия', correct: false },
            { text: 'Вклад с минимальной суммой', correct: false },
            { text: 'Вклад с максимальной процентной ставкой и фиксированным сроком', correct: true },
          ],
        },
        {
          question: 'Что такое капитализация процентов?',
          options: [
            { text: 'Когда проценты прибавляются к основной сумме вклада', correct: true },
            { text: 'Когда банк удерживает налог с процентов', correct: false },
            { text: 'Когда клиент может снять только проценты', correct: false },
          ],
        },
      ],
      credits: [
        {
          question: 'Что влияет на процентную ставку по кредиту?',
          options: [
            { text: 'Только кредитная история клиента', correct: false },
            { text: 'Кредитная история, доход и срок кредита', correct: true },
            { text: 'Только сумма кредита', correct: false },
          ],
        },
        {
          question: 'Какой тип кредита лучше предложить клиенту на покупку бытовой техники?',
          options: [
            { text: 'Ипотечный кредит', correct: false },
            { text: 'Потребительский кредит', correct: true },
            { text: 'Автокредит', correct: false },
          ],
        },
        {
          question: 'Что такое полная стоимость кредита (ПСК)?',
          options: [
            { text: 'Сумма кредита + первоначальный взнос', correct: false },
            { text: 'Сумма кредита + проценты', correct: false },
            { text: 'Все платежи заемщика по кредиту, включая комиссии и страховки', correct: true },
          ],
        },
      ],
      cards: [
        {
          question: 'В чем основное отличие дебетовой карты от кредитной?',
          options: [
            { text: 'Дебетовая карта позволяет тратить собственные средства клиента', correct: true },
            { text: 'Дебетовая карта всегда с кэшбэком, а кредитная - нет', correct: false },
            { text: 'По дебетовой карте нельзя снимать наличные', correct: false },
          ],
        },
        {
          question: 'Какой тип карты лучше предложить клиенту, который часто путешествует?',
          options: [
            { text: 'Обычную дебетовую карту без комиссий', correct: false },
            { text: 'Премиальную карту с бонусами за покупки за границей', correct: true },
            { text: 'Кредитную карту с максимальным лимитом', correct: false },
          ],
        },
        {
          question: 'Что такое грейс-период по кредитной карте?',
          options: [
            { text: 'Период, когда клиенту не нужно вносить минимальный платеж', correct: false },
            { text: 'Период, в течение которого не взимаются проценты при полном погашении задолженности', correct: true },
            { text: 'Период, когда карта находится на перевыпуске', correct: false },
          ],
        },
      ],
      mortgage: [
        {
          question: 'Что такое LTV в ипотечном кредитовании?',
          options: [
            { text: 'Размер ежемесячного платежа по ипотеке', correct: false },
            { text: 'Соотношение суммы кредита к стоимости недвижимости', correct: true },
            { text: 'Длительность ипотечного кредита', correct: false },
          ],
        },
        {
          question: 'Какое условие ипотеки позволяет снизить размер ежемесячного платежа?',
          options: [
            { text: 'Увеличение процентной ставки', correct: false },
            { text: 'Увеличение срока кредита', correct: true },
            { text: 'Уменьшение суммы кредита', correct: false },
          ],
        },
        {
          question: 'Что такое рефинансирование ипотеки?',
          options: [
            { text: 'Получение новой ипотеки на другую недвижимость', correct: false },
            { text: 'Получение нового кредита на более выгодных условиях для погашения старого', correct: true },
            { text: 'Продажа недвижимости для погашения ипотеки', correct: false },
          ],
        },
      ],
    };
    
    return questionSets[productId] || questionSets.cards;
  };

  const getUpgradeCost = (product: any) => {
    return 100 * (product.level + 1);
  };

  const selectedProductData = selectedProduct 
    ? products.find(p => p.id === selectedProduct) 
    : null;

  const questions = selectedProduct ? getProductQuestions(selectedProduct) : [];
  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="p-4 pb-16">
      {!selectedProduct ? (
        <>
          <h2 className="text-xl font-bold text-center mb-6">Банковские продукты</h2>
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <div
                key={product.id}
                className={`card-product ${!product.unlocked ? 'opacity-50' : ''}`}
                onClick={() => handleProductClick(product.id as ProductType)}
              >
                <div className="text-4xl mb-2">{product.icon}</div>
                <h3 className="font-semibold mb-1">{product.name}</h3>
                {product.unlocked && (
                  <div className="text-xs text-gray-600">Уровень: {product.level}</div>
                )}
                {product.unlocked && product.pointsPerSecond > 0 && (
                  <div className="text-xs text-blue-600">
                    +{product.pointsPerSecond} 📚/сек
                  </div>
                )}
                {!product.unlocked && (
                  <div className="text-xs text-gray-600">Заблокировано</div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : showQuiz ? (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-border">
          <h3 className="font-semibold text-center mb-4">
            Вопрос {currentQuestion + 1} из 3
          </h3>
          <p className="mb-4">{currentQuestionData.question}</p>
          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-bank-blue/50 tap-highlight"
                onClick={() => handleQuizAnswer(option.correct)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-4">
            <button
              className="tap-highlight text-blue-500"
              onClick={() => setSelectedProduct(null)}
            >
              ← Назад
            </button>
            <h2 className="text-xl font-bold text-center flex-1">
              {selectedProductData?.name}
            </h2>
          </div>
          
          <div className="text-6xl text-center my-6">
            {selectedProductData?.icon}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-border mb-4">
            <h3 className="font-semibold mb-2">О продукте</h3>
            <p className="text-sm">{selectedProductData?.description}</p>
            <div className="mt-2 text-sm">
              <div>Текущий уровень: {selectedProductData?.level}</div>
              <div>Приносит: +{selectedProductData?.pointsPerSecond} знаний/сек</div>
            </div>
          </div>
          
          <div className="bg-bank-green p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2 text-center">Повысить уровень знаний</h3>
            {selectedProductData && (
              <div className="flex justify-center mb-3">
                <div className="flex items-center">
                  <span className="mr-1">📚</span>
                  <span>{getUpgradeCost(selectedProductData)}</span>
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <button
                className="btn-primary w-full"
                onClick={startQuiz}
              >
                Пройти обучение
              </button>
              <button
                className={`btn-primary w-full ${selectedProductData && knowledgePoints < getUpgradeCost(selectedProductData) ? 'opacity-50' : ''}`}
                disabled={selectedProductData && knowledgePoints < getUpgradeCost(selectedProductData)}
                onClick={() => selectedProduct && upgradeProduct(selectedProduct)}
              >
                Улучшить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
