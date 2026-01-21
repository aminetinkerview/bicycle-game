import { Link, LinkProps } from "expo-router";
import { Text, View } from "react-native";

type MenuButtonProps = {
  label: string;
  href: LinkProps["href"];
  width: number;
  height: number;
};

export default function MenuButton({
  label,
  href,
  width,
  height,
}: MenuButtonProps) {
  return (
    <Link
      href={href}
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
          backgroundColor: "#E7772A",
          alignItems: "center",
          justifyContent: "center",
          width,
          height,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 20,
            fontWeight: "900",
            letterSpacing: 1,
          }}
        >
          {label}
        </Text>
      </View>
    </Link>
  );
}
