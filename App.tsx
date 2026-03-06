import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Modal, TouchableOpacity } from 'react-native';
import { GameBoard } from './src/components/GameBoard';
import { GAME_CONFIG } from './src/config/constants';

export default function App() {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [gameOverState, setGameOverState] = useState<{
    visible: boolean;
    winner: 'player1' | 'player2' | 'tie';
  } | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleScoreChange = (p1Score: number, p2Score: number) => {
    setPlayer1Score(p1Score);
    setPlayer2Score(p2Score);
  };

  const handleTurnChange = (turn: number) => {
    setTurnCount(turn);
  };

  const handleGameOver = (winner: 'player1' | 'player2' | 'tie') => {
    setGameOverState({ visible: true, winner });
  };

  const handleRestart = () => {
    setGameOverState(null);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setTurnCount(0);
    setGameKey(prev => prev + 1); // Force remount
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Line Duel</Text>
        <Text style={styles.turnText}>
          Turn {turnCount} / {GAME_CONFIG.MAX_TURNS}
        </Text>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, styles.player1]}>
            Player 1: {player1Score}
          </Text>
          <Text style={[styles.scoreText, styles.player2]}>
            Player 2: {player2Score}
          </Text>
        </View>
      </View>
      <GameBoard
        key={gameKey}
        onScoreChange={handleScoreChange}
        onTurnChange={handleTurnChange}
        onGameOver={handleGameOver}
      />
      <StatusBar style="auto" />

      {/* Game Over Modal */}
      <Modal
        visible={gameOverState?.visible || false}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Over!</Text>

            {gameOverState?.winner === 'tie' ? (
              <Text style={styles.modalSubtitle}>It's a Tie!</Text>
            ) : (
              <Text style={[
                styles.modalSubtitle,
                gameOverState?.winner === 'player1' ? styles.player1 : styles.player2
              ]}>
                {gameOverState?.winner === 'player1' ? 'Player 1' : 'Player 2'} Wins!
              </Text>
            )}

            <View style={styles.finalScores}>
              <Text style={[styles.finalScoreText, styles.player1]}>
                Player 1: {player1Score}
              </Text>
              <Text style={[styles.finalScoreText, styles.player2]}>
                Player 2: {player2Score}
              </Text>
            </View>

            <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
              <Text style={styles.restartButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 5,
  },
  turnText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  finalScores: {
    width: '100%',
    marginBottom: 32,
  },
  finalScoreText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 8,
  },
  restartButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
