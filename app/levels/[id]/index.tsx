import { Dotlottie, DotLottie } from "@lottiefiles/dotlottie-react-native";
import { BackHandler, Dimensions, Pressable, View } from "react-native";
import Background from "../../../assets/Background";
import Flag from "../../../assets/Flag";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { useRef } from "react";
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

  const { height, width } = Dimensions.get("window");

  const backgroundHeight = height;
  const backgroundWidth = height * BACKGROUND_ASPECT_RATIO;

  const worldWidth = backgroundWidth * nbBackgrounds;

  const monsterRef = useRef<Dotlottie>(null);
  const monsterPosition = useSharedValue(MONSTER_INITIAL_POSITION);

  const characterRef = useRef<Dotlottie>(null);
  const characterPosition = useSharedValue(CHARACTER_INITIAL_POSITION);
  const characterSpeed = useSharedValue(0);
  const characterCenterX = width / 2 - CHARACTER_SIZE / 2;

  const gameState = useSharedValue<GameStateType>("READY");

  useFrameCallback(() => {
    if (gameState.value !== "RUNNING") return;
    if (characterPosition.value >= worldWidth - FLAG_OFFSET - FLAG_SIZE) {
      gameState.value = "WON";
      return;
    }
    if (monsterPosition.value >= characterPosition.value - CHARACTER_SIZE / 2) {
      gameState.value = "OVER";
      return;
    }
    monsterPosition.value += monsterSpeed;
    characterPosition.value += characterSpeed.value;
  });

  const pauseLotties = () => {
    monsterRef.current?.pause();
    characterRef.current?.pause();
  };

  useAnimatedReaction(
    () => gameState.value,
    (value, previous) => {
      if (value === previous) return;
      if (value === "WON" || value === "OVER") scheduleOnRN(pauseLotties);
    },
  );

  const moveCharacter = () => {
    characterSpeed.value = Math.min(characterSpeed.value + 0.5, 2);
    characterRef.current?.setSpeed(characterSpeed.value);
    characterRef.current?.play();
  };

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

  const resumeGame = () => {
    gameState.value = "RUNNING";
    monsterRef.current?.play();
    if (characterSpeed.value > 0) characterRef.current?.play();
  };

  const restartGame = () => {
    characterPosition.value = CHARACTER_INITIAL_POSITION;
    characterSpeed.value = 0;
    monsterPosition.value = MONSTER_INITIAL_POSITION;
    gameState.value = "READY";
    monsterRef.current?.stop();
    characterRef.current?.stop();
  };

  const pauseGame = () => {
    gameState.value = "PAUSED";
    pauseLotties();
  };

  const startGame = () => {
    gameState.value = "RUNNING";
    monsterRef.current?.play();
  };

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

  const monsterStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: monsterPosition.value }],
  }));

  const flagStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: worldWidth - FLAG_OFFSET - FLAG_SIZE }],
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
              bottom: GROUND_LEVEL,
            },
            monsterStyle,
          ]}
        >
          <DotLottie
            ref={monsterRef}
            source={require("../../../assets/monster.lottie")}
            style={{
              width: MONSTER_SIZE,
              height: MONSTER_SIZE,
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
              bottom: GROUND_LEVEL,
            },
            flagStyle,
          ]}
        >
          <Flag width={FLAG_SIZE} height={FLAG_SIZE} />
        </Animated.View>
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: GROUND_LEVEL,
            },
            characterStyle,
          ]}
        >
          <DotLottie
            ref={characterRef}
            source={require("../../../assets/character.lottie")}
            style={{
              width: CHARACTER_SIZE,
              height: CHARACTER_SIZE,
            }}
            onLoop={onCharacterAnimationLoop}
            loop
            autoplay={false}
          />
        </Animated.View>
      </Animated.View>
      <Pressable
        onPress={moveCharacter}
        style={{
          position: "absolute",
          inset: 0,
        }}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            left: "50%",
            top: 50,
            transform: [{ translateX: "-50%" }],
            flexDirection: "row",
          },
          pauseButtonStyle,
        ]}
      >
        <FontAwesome5
          name="pause"
          size={40}
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
            { color: "white", fontSize: 50, fontWeight: 700 },
            pauseStyle,
          ]}
        >
          PAUSE MENU
        </Animated.Text>
        <Animated.Text
          style={[{ color: "white", fontSize: 50, fontWeight: 700 }, winStyle]}
        >
          YOU WON!
        </Animated.Text>
        <Animated.Text
          style={[{ color: "white", fontSize: 50, fontWeight: 700 }, loseStyle]}
        >
          GAME OVER
        </Animated.Text>
        <View style={{ gap: 16, flexDirection: "row" }}>
          <Animated.View style={pauseStyle}>
            <FontAwesome5
              name="play"
              size={40}
              color="yellow"
              onPress={resumeGame}
            />
          </Animated.View>
          <Animated.View style={notReadyStyle}>
            <MaterialIcons
              name="replay"
              size={40}
              color="yellow"
              onPress={restartGame}
            />
          </Animated.View>
          <Animated.View style={notReadyStyle}>
            <Link href="/">
              <MaterialIcons name="home" size={40} color="yellow" />
            </Link>
          </Animated.View>
        </View>
        <Animated.View style={startStyle}>
          <FontAwesome5
            name="play"
            size={160}
            color="yellow"
            onPress={startGame}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
