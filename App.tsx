import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { GameBoard } from './src/components/GameBoard';

export default function App() {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const handleScoreChange = (p1Score: number, p2Score: number) => {
    setPlayer1Score(p1Score);
    setPlayer2Score(p2Score);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Line Duel</Text>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, styles.player1]}>
            Player 1: {player1Score}
          </Text>
          <Text style={[styles.scoreText, styles.player2]}>
            Player 2: {player2Score}
          </Text>
        </View>
      </View>
      <GameBoard onScoreChange={handleScoreChange} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  player1: {
    color: '#3B82F6',
  },
  player2: {
    color: '#EF4444',
  },
});
