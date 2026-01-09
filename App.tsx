import { DotLottie } from "@lottiefiles/dotlottie-react-native";
import { Dimensions, View } from "react-native";
import Background from "./assets/Background";
import Flag from "./assets/Flag";

const BACKGROUND_ASPECT_RATIO = 665 / 241;
const GROUND_LEVEL = 10;
const MONSTER_SIZE = 100;
const MONSTER_INITIAL_POSITION = 25;
const FLAG_SIZE = 75;
const FLAG_OFFSET = 50;
const CHARACTER_SIZE = 75;
const CHARACTER_INITIAL_POSITION = 225;

export default function App() {
  const { height } = Dimensions.get("window");

  const backgroundHeight = height;
  const backgroundWidth = height * BACKGROUND_ASPECT_RATIO;

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <Background width={backgroundWidth} height={backgroundHeight} />
      <View
        style={{
          position: "absolute",
          bottom: GROUND_LEVEL,
          left: MONSTER_INITIAL_POSITION,
        }}
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
      </View>
      <View
        style={{
          position: "absolute",
          bottom: GROUND_LEVEL,
          right: FLAG_OFFSET,
        }}
      >
        <Flag width={FLAG_SIZE} height={FLAG_SIZE} />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: GROUND_LEVEL,
          left: CHARACTER_INITIAL_POSITION,
        }}
      >
        <DotLottie
          source={require("./assets/character.lottie")}
          style={{
            width: CHARACTER_SIZE,
            height: CHARACTER_SIZE,
          }}
          loop
          autoplay
        />
      </View>
    </View>
  );
}
