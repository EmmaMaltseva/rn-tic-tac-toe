import { StatusBar } from 'expo-status-bar';
import { ReactNode, useState} from 'react';
import { ImageBackground, StyleSheet, View, ImageBackgroundProps } from 'react-native';
import GameScreen from './screens/GameScreen';
import WelcomeScreen, {GameMode} from './screens/WelcomeScreen';
//import { useFonts, Montserrat_400Regular } from '@expo-google-fonts/montserrat';

interface ImageBackgroundFixedProps extends ImageBackgroundProps {
  children?: ReactNode;
}

function ImageBackgroundFixed(props: ImageBackgroundFixedProps) {
  return <ImageBackground {...props} />;
}

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>();

  let currentScreen;
  if (gameMode) {
    currentScreen = <GameScreen mode={gameMode}/>;
  } else {
    currentScreen = <WelcomeScreen onPressStart={setGameMode}/>;
  }

  return (
      <ImageBackgroundFixed
        source={{uri: 'C:/Users/374/code/rn-tic-tac-toe/assets/25348.png'}}
        style={styles.image}
      >
      <View style={styles.container}>
        <StatusBar style="auto"/>
        {currentScreen}
      </View>
    </ImageBackgroundFixed>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#caf0f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: "center",
  },
});
