import { Text, useWindowDimensions, View } from "react-native";
import Background from "../assets/Background";
import MenuButton from "../components/menu-button";
import { BACKGROUND_ASPECT_RATIO } from "../consts";

export default function Game() {
  const { height } = useWindowDimensions();
  const backgroundHeight = height;
  const backgroundWidth = height * BACKGROUND_ASPECT_RATIO;

  const h = height / 384;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16 * h,
      }}
    >
      <Background
        style={{ position: "absolute", left: 0 }}
        width={backgroundWidth}
        height={backgroundHeight}
      />
      <View
        style={{
          borderRadius: 15 * h,
          padding: 3 * h,
          backgroundColor: "#F2C15A",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 8 * h,
          shadowOffset: { width: 0, height: 6 * h },
          elevation: 6,
          borderColor: "#C4571B",
          borderWidth: 2 * h,
        }}
      >
        <View
          style={{
            borderRadius: 10 * h,
            backgroundColor: "#C4571B",
            alignItems: "center",
            justifyContent: "center",
            padding: 12 * h,
          }}
        >
          <Text
            style={{
              color: "#FFD35A",
              fontSize: 24 * h,
              fontWeight: "900",
              letterSpacing: 1 * h,
            }}
          >
            BICYCLE
          </Text>
          <Text
            style={{
              color: "#FFF",
              fontSize: 24 * h,
              fontWeight: "900",
              letterSpacing: 1 * h,
            }}
          >
            GAME
          </Text>
        </View>
      </View>
      <MenuButton
        href="/levels"
        label="START GAME"
        width={175 * h}
        height={50 * h}
        h={h}
      />
    </View>
  );
}
