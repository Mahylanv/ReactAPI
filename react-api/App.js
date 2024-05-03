import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';


const App = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [categories, setCategories] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);  


  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php')
      .then(response => {
        setCategories(response.data.trivia_categories);
      })
      .catch(error => console.log(error));
  }, []);

  const startQuiz = () => {
    loadQuestions();  
    axios.get(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`)
      .then(response => {
        setQuestions(response.data.results);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizStarted(true);
      })
      .catch(error => console.log(error));
  };
  
  const goBack = () => {
    setQuizStarted(false);
  };
  

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }
  
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    }
  
    if (nextQuestionIndex >= questions.length - 1) { 
      loadQuestions();
    }
  };
  
  
  const loadQuestions = () => {
    axios.get(`https://opentdb.com/api.php?amount=20&category=${category}&difficulty=${difficulty}&type=multiple`)
      .then(response => {
        setQuestions(prevQuestions => [...prevQuestions, ...response.data.results]);
        if (currentQuestionIndex === 0) setCurrentQuestionIndex(0);
      })
      .catch(error => console.log(error));
  };

  const resetScore = () => {
    setScore(0); 
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {quizStarted ? (
        <ScrollView>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.desc}>{questions[currentQuestionIndex].question}</Text>
          {questions[currentQuestionIndex].incorrect_answers.concat(questions[currentQuestionIndex].correct_answer)
            .sort(() => Math.random() - 0.5)
            .map((answer, index) => (
              <TouchableOpacity key={index} style={styles.button} onPress={() => handleAnswer(answer)}>
                <Text style={styles.buttonText}>{answer}</Text>
              </TouchableOpacity>
            ))}
          <TouchableOpacity style={styles.btn} onPress={goBack}>
            <Text style={styles.buttonText}>Retour a l'accueil</Text>
          </TouchableOpacity>
          </ScrollView>
      ) : (
        <View style={styles.view}>
          <Text style={styles.title}>TriviaQuizz</Text>
          <Text style={styles.desc}>Testez vos connaissances et mettez a l'epreuve votre culture générale</Text>
          <Picker style={styles.picker}
            selectedValue={category}
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
            <Picker.Item label="Toutes catégories" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
            ))}
          </Picker>
          <Picker style={styles.picker}
            selectedValue={difficulty}
            onValueChange={(itemValue, itemIndex) => setDifficulty(itemValue)}>
            <Picker.Item label="facile" value="easy" />
            <Picker.Item label="moyen" value="medium" />
            <Picker.Item label="dur" value="hard" />
            <Picker.Item label="tout" value="" />
          </Picker>
          <Text style={styles.score}>Score: {score}</Text>
            <Button title='Réinitialiser le Score' onPress={resetScore}></Button>
          <TouchableOpacity style={styles.btn} onPress={startQuiz}>
            <Text style={styles.buttonText}>Commencer</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );  
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f4e8ff'
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#841584'
  },
  desc: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#841584'
  },
  score: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    width: '70%',
    margin: 'auto',
  },
  view: {
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    backgroundColor: "blue", 
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center'
  },
  btn: {
    backgroundColor: "#841584", 
    padding: 20,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});

export default App;