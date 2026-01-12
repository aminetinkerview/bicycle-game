import { Dotlottie, DotLottie } from "@lottiefiles/dotlottie-react-native";
import { Dimensions, Pressable, View } from "react-native";
import Background from "./assets/Background";
import Flag from "./assets/Flag";
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { useRef } from "react";

const BACKGROUND_ASPECT_RATIO = 665 / 241;
const GROUND_LEVEL = 10;
const MONSTER_SIZE = 100;
const MONSTER_INITIAL_POSITION = 25;
const FLAG_SIZE = 75;
const FLAG_OFFSET = 50;
const CHARACTER_SIZE = 75;
const CHARACTER_INITIAL_POSITION = 225;

export default function App() {
  const { height, width } = Dimensions.get("window");

  const backgroundHeight = height;
  const backgroundWidth = height * BACKGROUND_ASPECT_RATIO;

  const worldWidth = backgroundWidth * 2;

  const monsterPosition = useSharedValue(MONSTER_INITIAL_POSITION);

  const characterRef = useRef<Dotlottie>(null);
  const characterPosition = useSharedValue(CHARACTER_INITIAL_POSITION);
  const characterSpeed = useSharedValue(0);
  const characterCenterX = width / 2 - CHARACTER_SIZE / 2;

  useFrameCallback(() => {
    monsterPosition.value++;
    characterPosition.value += characterSpeed.value;
  });

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

  const monsterStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: monsterPosition.value }],
  }));

  const flagStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: worldWidth - FLAG_OFFSET - FLAG_SIZE }],
  }));

  const characterStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: characterPosition.value }],
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
        <Background width={backgroundWidth} height={backgroundHeight} />
        <Background width={backgroundWidth} height={backgroundHeight} />
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
            source={require("./assets/monster.lottie")}
            style={{
              width: MONSTER_SIZE,
              height: MONSTER_SIZE,
            }}
            loop
            autoplay
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
            source={require("./assets/character.lottie")}
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
        style={{ position: "absolute", inset: 0 }}
      />
    </View>
  );
}
