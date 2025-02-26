import { StatusBar } from "expo-status-bar";
import AppNavigation from "./src/navigation/AppNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" hidden={false}  />
      <AppNavigation />
      </Provider>
  );
}
