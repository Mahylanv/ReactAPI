import React from 'react';
import { View, Text, Button } from 'react-native';

const ScoreScreen = ({ route }) => {
  const { total, correct } = route.params;

  return (
    <View>
      <Text> {correct} questions correctes sur {total} !</Text>
      <Button title="Restart Quiz" />
    </View>
  );
};

export default ScoreScreen;
