import React, { useEffect, useState } from 'react'
import { ImageBackground, View, Text, StyleSheet, Alert } from 'react-native'
import Engine, {Cell, MakeMoveFn, OnMoveFn, State} from '../../game/Engine';
import {GameMode} from '../WelcomeScreen'
import GameBoard from './components/GameBoard';

function getEndgameText(winner: Cell): string {
    if (winner === Cell.Empty) {
        return 'It\'s a draw';
    } else {
        return `${winner === Cell.X ? 'X' : 'O'} wins!`;
    }
}

interface GameScreenProps {
    mode: GameMode;
}

export default function GameScreen({mode}: GameScreenProps) {
    const [currentPlayerMakeMove, setCurrentPlayerMakeMove] = useState<MakeMoveFn>();
    const [currentPlayer, setCurrentPlayer] = useState< Cell.X | Cell.O >();
    const [currentState, setCurrentState] = useState<State>();
    const [winner, setWinner] = useState<Cell>();

    const onPlayerMove: OnMoveFn = (state, whoAmI, makeMove) => {
        setCurrentState(state);
        setCurrentPlayer(whoAmI); 
        setCurrentPlayerMakeMove(() => makeMove);
    };

    const onBotMove: OnMoveFn = (state, whoAmI, makeMove) => {
        const emptyCells = [];
        const bestMove = [];
            if ((state[0][1] != Cell.Empty && state[0][1] === state[0][2] && state[0][0] === Cell.Empty) ||
                (state[1][0] != Cell.Empty && state[1][0] === state[2][0] && state[0][0] === Cell.Empty) ||
                (state[1][1] != Cell.Empty && state[1][1] === state[2][2] && state[0][0] === Cell.Empty)) { 
                makeMove(0,0)
            } else if (state[0][0] != Cell.Empty && state[0][0] == state[0][2] && state[0][1] === Cell.Empty ||
                       state[1][1] != Cell.Empty && state[1][1] == state[2][1] && state[0][1] === Cell.Empty) { 
                makeMove(0,1)
            } else if (state[0][0] != Cell.Empty && state[0][0] == state[0][1] && state[0][2] === Cell.Empty ||
                       state[1][2] != Cell.Empty && state[1][2] == state[2][2] && state[0][2] === Cell.Empty ||
                       state[1][1] != Cell.Empty && state[1][1] == state[2][0] && state[0][2] === Cell.Empty) {
                makeMove(0,2); 
            } else if (state[0][0] != Cell.Empty && state[0][0] == state[2][0] && state[1][0] === Cell.Empty ||
                       state[1][1] != Cell.Empty && state[1][1] == state[1][2] && state[1][0] === Cell.Empty) {
                makeMove(1,0);
            } else if (state[1][1] === Cell.Empty) {
                makeMove(1,1);
            } else if (state[1][0] != Cell.Empty && state[1][0] == state[1][1] && state[1][2] === Cell.Empty ||
                       state[0][2] != Cell.Empty && state[0][2] == state[2][2] && state[1][2] === Cell.Empty ) {
                makeMove(1,2); 
            } else if (state[0][0] != Cell.Empty && state[0][0] == state[1][0] && state[2][0] === Cell.Empty ||
                       state[0][2] != Cell.Empty && state[0][2] == state[1][1] && state[2][0] === Cell.Empty ||
                       state[2][1] != Cell.Empty && state[2][1] == state[2][2] && state[2][0] === Cell.Empty) {
                makeMove(2,0); 
            } else if ((state[0][1] != Cell.Empty && state[0][1] === state[1][1] && state[2][1] === Cell.Empty) ||
                       (state[2][0] != Cell.Empty && state[2][0] === state[2][2] && state[2][1] === Cell.Empty)) {
                makeMove(2,1);
            } else if (state[0][0] != Cell.Empty && state[0][0] == state[1][1] && state[2][2] === Cell.Empty ||
                       state[0][2] != Cell.Empty && state[0][2] == state[1][2] && state[2][2] === Cell.Empty ||
                       state[2][0] != Cell.Empty && state[2][0] == state[2][1] && state[2][2] === Cell.Empty) {
                makeMove(2,2);
            } else {  
                for (let x = 0; x < Engine.BOARD_SIXE; x++) {
                    for (let y = 0; y <Engine.BOARD_SIXE; y++) {
                        if (state[x][y] === Cell.Empty) {
                            emptyCells.push([x,y]);         //добавляем в массив координаты пустой ячейки
                        }
                    }
                }          
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const [x,y] = emptyCells[randomIndex];
                makeMove(x,y);
            }
 
    };

    const onGameEnd = (winner: Cell) => {
        setWinner(winner);
    }

    const [engine] = useState(() => { 
        const playerTwo = mode === 'pvplocal' ? onPlayerMove : onBotMove;

        return new Engine(
            onPlayerMove, 
            playerTwo, 
            onGameEnd,
            'random'
        );
    });

    useEffect(() => {
        engine.startGame();
        setCurrentState(engine.getState());
    }, [engine]);
    
    const onCellPress = (x: number, y: number) => {
        try {
            currentPlayerMakeMove?.(x, y);
          } catch (err) {
            if (err instanceof Error) {
              Alert.alert('Некорректный ход', err.message || err.toString());
            } else {
              Alert.alert('Некорректный ход', 'неожиданная ошибка');
            }
          }
    };

    return (
        <View>
            <Text style={styles.gametext}>Make a move</Text>
            {winner === undefined
                ? <Text style={styles.gametext}>{currentPlayer === Cell.X ? 'X' : 'O'}, it's your move!</Text>
                : <Text style={styles.gametext}>{getEndgameText(winner)}</Text>
            }
            {currentState
                ? <GameBoard state={currentState} onCellPress={onCellPress}/>
                : <Text>Loading...</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
      width: '100%',
      height: '100%',
      flex: 1,
      justifyContent: "center",
    },
    gametext: {
        justifyContent: 'center',
        textAlign: 'center',
        color: '#0068bd',
        fontSize: 10,
        //color: 'white',
    },
  });