import { Dotlottie, DotLottie } from "@lottiefiles/dotlottie-react-native";
import {
  BackHandler,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import Background from "../../../assets/Background";
import Flag from "../../../assets/Flag";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { useCallback, useEffect, useRef } from "react";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { scheduleOnRN } from "react-native-worklets";
import { BACKGROUND_ASPECT_RATIO } from "../../../consts";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { LevelConfigType } from "../../../types";

const GROUND_LEVEL = 10;
const MONSTER_SIZE = 100;
const MONSTER_INITIAL_POSITION = 25;
const FLAG_SIZE = 75;
const FLAG_OFFSET = 50;
const CHARACTER_SIZE = 75;
const CHARACTER_INITIAL_POSITION = 225;

type GameStateType = "READY" | "RUNNING" | "PAUSED" | "WON" | "OVER";

export default function Level() {
  const params = useLocalSearchParams<LevelConfigType>();
  const router = useRouter();

  const nbBackgrounds = Number(params.nbBackgrounds);
  const monsterSpeed = Number(params.monsterSpeed);

  const { width, height } = useWindowDimensions();

  const h = height / 384;
  const w = width / 853.3333333333334;

  const backgroundHeight = height;
  const backgroundWidth = height * BACKGROUND_ASPECT_RATIO;
  const groundLevel = GROUND_LEVEL * h;
  const monsterSize = MONSTER_SIZE * h;
  const monsterInitialPosition = MONSTER_INITIAL_POSITION * w;
  const flagSize = FLAG_SIZE * h;
  const flagOffset = FLAG_OFFSET * w;
  const characterSize = CHARACTER_SIZE * h;
  const characterInitialPosition = CHARACTER_INITIAL_POSITION * w;

  const worldWidth = backgroundWidth * nbBackgrounds;

  const monsterRef = useRef<Dotlottie>(null);
  const monsterPosition = useSharedValue(monsterInitialPosition);

  const characterRef = useRef<Dotlottie>(null);
  const characterPosition = useSharedValue(characterInitialPosition);
  const characterSpeed = useSharedValue(0);
  const characterCenterX = width / 2 - characterSize / 2;

  const gameState = useSharedValue<GameStateType>("READY");

  useFrameCallback(() => {
    if (gameState.value !== "RUNNING") return;
    if (characterPosition.value >= worldWidth - flagOffset - flagSize) {
      gameState.value = "WON";
      return;
    }
    if (monsterPosition.value >= characterPosition.value - characterSize / 2) {
      gameState.value = "OVER";
      return;
    }
    monsterPosition.value += monsterSpeed * w;
    characterPosition.value += characterSpeed.value * w;
  });

  const pauseLotties = useCallback(() => {
    monsterRef.current?.pause();
    characterRef.current?.pause();
  }, []);

  useAnimatedReaction(
    () => gameState.value,
    (value, previous) => {
      if (value === previous) return;
      if (value === "WON" || value === "OVER") scheduleOnRN(pauseLotties);
    },
  );

  const moveCharacter = useCallback(() => {
    characterSpeed.value = Math.min(characterSpeed.value + 0.5, 2);
    characterRef.current?.setSpeed(characterSpeed.value);
    characterRef.current?.play();
  }, []);

  const onCharacterAnimationLoop = () => {
    const newSpeed = Math.max(characterSpeed.value - 0.5, 0);
    characterSpeed.value = newSpeed;
    if (newSpeed > 0) {
      characterRef.current?.setSpeed(newSpeed);
      characterRef.current?.play();
    } else {
      characterRef.current?.stop();
    }
  };

  const resumeGame = useCallback(() => {
    gameState.value = "RUNNING";
    monsterRef.current?.play();
    if (characterSpeed.value > 0) characterRef.current?.play();
  }, []);

  const restartGame = useCallback(() => {
    characterPosition.value = characterInitialPosition;
    characterSpeed.value = 0;
    monsterPosition.value = monsterInitialPosition;
    gameState.value = "READY";
    monsterRef.current?.stop();
    characterRef.current?.stop();
  }, [characterInitialPosition, monsterInitialPosition]);

  const pauseGame = useCallback(() => {
    gameState.value = "PAUSED";
    pauseLotties();
  }, [pauseLotties]);

  const startGame = useCallback(() => {
    gameState.value = "RUNNING";
    monsterRef.current?.play();
  }, []);

  const worldStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: -Math.max(
          0,
          Math.min(
            characterPosition.value - characterCenterX,
            worldWidth - width,
          ),
        ),
      },
    ],
  }));

  useFocusEffect(() => {
    const onBackPress = () => {
      if (gameState.value === "RUNNING") {
        pauseGame();
        return true;
      }

      if (gameState.value === "PAUSED") {
        resumeGame();
        return true;
      }

      router.navigate("/");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => backHandler.remove();
  });

  const navigateHome = useCallback(() => {
    router.navigate("/");
  }, [router]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const overlayKeymap = {
      R: restartGame,
      r: restartGame,
      Q: navigateHome,
      q: navigateHome,
    };

    const keymap: Record<GameStateType, Record<string, () => void>> = {
      READY: {
        Enter: startGame,
      },
      RUNNING: {
        " ": moveCharacter,
        Escape: pauseGame,
        Backspace: pauseGame,
      },
      PAUSED: {
        Enter: resumeGame,
        ...overlayKeymap,
      },
      WON: overlayKeymap,
      OVER: overlayKeymap,
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      keymap[gameState.value][event.key]?.();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [startGame, moveCharacter, pauseGame, resumeGame, restartGame]);

  const monsterStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: monsterPosition.value }],
  }));

  const flagStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: worldWidth - flagOffset - flagSize }],
  }));

  const characterStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: characterPosition.value }],
  }));

  const pauseButtonStyle = useAnimatedStyle(() => ({
    display: gameState.value === "RUNNING" ? "flex" : "none",
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    display: gameState.value === "RUNNING" ? "none" : "flex",
  }));

  const pauseStyle = useAnimatedStyle(() => ({
    display: gameState.value === "PAUSED" ? "flex" : "none",
  }));

  const winStyle = useAnimatedStyle(() => ({
    display: gameState.value === "WON" ? "flex" : "none",
  }));

  const loseStyle = useAnimatedStyle(() => ({
    display: gameState.value === "OVER" ? "flex" : "none",
  }));

  const notReadyStyle = useAnimatedStyle(() => ({
    display: gameState.value === "READY" ? "none" : "flex",
  }));

  const startStyle = useAnimatedStyle(() => ({
    display: gameState.value === "READY" ? "flex" : "none",
  }));

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <Animated.View
        style={[{ position: "relative", flexDirection: "row" }, worldStyle]}
      >
        {Array.from({ length: nbBackgrounds }).map((_, index) => (
          <Background
            key={index}
            width={backgroundWidth}
            height={backgroundHeight}
          />
        ))}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: groundLevel,
            },
            monsterStyle,
          ]}
        >
          <DotLottie
            ref={monsterRef}
            source={require("../../../assets/monster.lottie")}
            style={{
              width: monsterSize,
              height: monsterSize,
            }}
            speed={monsterSpeed}
            loop
            autoplay={false}
          />
        </Animated.View>
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: groundLevel,
            },
            flagStyle,
          ]}
        >
          <Flag width={flagSize} height={flagSize} />
        </Animated.View>
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: groundLevel,
            },
            characterStyle,
          ]}
        >
          <DotLottie
            ref={characterRef}
            source={require("../../../assets/character.lottie")}
            style={{
              width: characterSize,
              height: characterSize,
            }}
            onLoop={onCharacterAnimationLoop}
            loop
            autoplay={false}
          />
        </Animated.View>
      </Animated.View>
      {Platform.OS === "web" ? (
        <button
          onClick={moveCharacter}
          onKeyDown={(e) => e.preventDefault()}
          onKeyUp={(e) => e.preventDefault()}
          style={{
            position: "absolute",
            inset: 0,
            background: "transparent",
          }}
        />
      ) : (
        <Pressable
          onPress={moveCharacter}
          style={{
            position: "absolute",
            inset: 0,
          }}
        />
      )}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: "50%",
            top: 50 * h,
            transform: [{ translateX: "-50%" }],
            flexDirection: "row",
          },
          pauseButtonStyle,
        ]}
      >
        <FontAwesome5
          name="pause"
          size={40 * h}
          color="yellow"
          onPress={pauseGame}
        />
      </Animated.View>
      <Animated.View
        style={[
          {
            position: "absolute",
            inset: 0,
            backgroundColor: "#00000062",
            alignItems: "center",
            justifyContent: "center",
          },
          overlayStyle,
        ]}
      >
        <Animated.Text
          style={[
            { color: "white", fontSize: 50 * h, fontWeight: 700 },
            pauseStyle,
          ]}
        >
          PAUSE MENU
        </Animated.Text>
        <Animated.Text
          style={[
            { color: "white", fontSize: 50 * h, fontWeight: 700 },
            winStyle,
          ]}
        >
          YOU WON!
        </Animated.Text>
        <Animated.Text
          style={[
            { color: "white", fontSize: 50 * h, fontWeight: 700 },
            loseStyle,
          ]}
        >
          GAME OVER
        </Animated.Text>
        <View
          style={{
            gap: 16 * w,
            flexDirection: "row",
          }}
        >
          <Animated.View style={pauseStyle}>
            <FontAwesome5
              name="play"
              size={40 * h}
              color="yellow"
              onPress={resumeGame}
            />
          </Animated.View>
          <Animated.View style={notReadyStyle}>
            <MaterialIcons
              name="replay"
              size={40 * h}
              color="yellow"
              onPress={restartGame}
            />
          </Animated.View>
          <Animated.View style={notReadyStyle}>
            <Link href="/">
              <MaterialIcons name="home" size={40 * h} color="yellow" />
            </Link>
          </Animated.View>
        </View>
        <Animated.View style={startStyle}>
          <FontAwesome5
            name="play"
            size={160 * h}
            color="yellow"
            onPress={startGame}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
