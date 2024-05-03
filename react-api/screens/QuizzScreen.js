import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { fetchQuestions } from '../Api';

const QuizScreen = () => {
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMoreQuestions();
  }, [difficulty, category]); // S'assurer de recharger quand les paramètres changent

  const loadMoreQuestions = async () => {
    if (loading) return; // Éviter les chargements multiples simultanés
    setLoading(true);
    try {
      const newQuestions = await fetchQuestions(difficulty, category, 10); // Adapter la quantité selon les besoins
      setQuestions(prev => [...prev, ...newQuestions]);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const isCorrect = answer === questions[currentQuestionIndex].correct_answer;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    const nextQuestionIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextQuestionIndex);

    // Charger plus de questions si on approche de la fin du lot actuel
    if (nextQuestionIndex >= questions.length - 1) {
      loadMoreQuestions();
    }
  };

  if (!questions.length) return <ActivityIndicator size="large" color="#0000ff" />;

  const question = questions[currentQuestionIndex];
  const answers = [...question.incorrect_answers, question.correct_answer];
  answers.sort(() => Math.random() - 0.5); 

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
      <Text style={{ fontSize: 18 }}>Réponses correctes: {correctAnswers} / {currentQuestionIndex + 1}</Text>
      <Text style={{ fontSize: 24, marginVertical: 20 }}>{decodeURIComponent(question.question)}</Text>
      {answers.map((answer, index) => (
        <Button key={index} title={decodeURIComponent(answer)} onPress={() => handleAnswer(answer)} />
      ))}
      {loading && <ActivityIndicator size="small" />}
    </View>
  );
};

export default QuizScreen;
