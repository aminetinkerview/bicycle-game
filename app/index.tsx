import { Dimensions, Text, View } from "react-native";
import Background from "../assets/Background";
import MenuButton from "../components/menu-button";
import { BACKGROUND_ASPECT_RATIO } from "../consts";

export default function Game() {
  const { height } = Dimensions.get("window");
  const backgroundHeight = height;
  const backgroundWidth = height * BACKGROUND_ASPECT_RATIO;
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <Background
        style={{ position: "absolute", left: 0 }}
        width={backgroundWidth}
        height={backgroundHeight}
      />
      <View
        style={{
          borderRadius: 15,
          padding: 3,
          backgroundColor: "#F2C15A",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
          borderColor: "#C4571B",
          borderWidth: 2,
        }}
      >
        <View
          style={{
            borderRadius: 10,
            backgroundColor: "#C4571B",
            alignItems: "center",
            justifyContent: "center",
            padding: 12,
          }}
        >
          <Text
            style={{
              color: "#FFD35A",
              fontSize: 24,
              fontWeight: "900",
              letterSpacing: 1,
            }}
          >
            BICYCLE
          </Text>
          <Text
            style={{
              color: "#FFF",
              fontSize: 24,
              fontWeight: "900",
              letterSpacing: 1,
            }}
          >
            GAME
          </Text>
        </View>
      </View>
      <MenuButton href="/levels" label="START GAME" width={175} height={50} />
    </View>
  );
}
