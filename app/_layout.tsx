import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name= "settings" />
      <Stack.Screen name= "fase1" />
    </Stack>
  );
}
