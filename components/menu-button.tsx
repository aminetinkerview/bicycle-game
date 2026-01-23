import { Link, LinkProps } from "expo-router";
import { Text, View } from "react-native";

type MenuButtonProps = {
  label: string;
  href: LinkProps["href"];
  width: number;
  height: number;
  h: number;
};

export default function MenuButton({
  label,
  href,
  width,
  height,
  h,
}: MenuButtonProps) {
  return (
    <Link
      href={href}
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
            fontSize: 20 * h,
            fontWeight: "900",
            letterSpacing: 1 * h,
          }}
        >
          {label}
        </Text>
      </View>
    </Link>
  );
}
