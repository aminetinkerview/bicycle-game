import { Dimensions, View } from "react-native";
import Background from "../../assets/Background";
import MenuButton from "../../components/menu-button";
import { BACKGROUND_ASPECT_RATIO } from "../../consts";
import { levels } from "../../data";

export default function Levels() {
  const { height } = Dimensions.get("window");
  const backgroundHeight = height;
  const backgroundWidth = height * BACKGROUND_ASPECT_RATIO;
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
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
      {levels.map(({ id, nbBackgrounds, monsterSpeed }) => (
        <MenuButton
          key={id}
          href={{
            pathname: "/levels/[id]",
            params: { id, nbBackgrounds, monsterSpeed },
          }}
          label={id}
          width={50}
          height={50}
        />
      ))}
    </View>
  );
}
