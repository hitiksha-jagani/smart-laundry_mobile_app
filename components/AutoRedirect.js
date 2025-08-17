import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export default function AutoRedirect() {
  const { isLoggedIn, role, loading } = useAuth();
  const navigation = useNavigation();
useEffect(() => {
  if (loading) return; 

  if (isLoggedIn == null) return;

  if (!isLoggedIn) {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  } else {
    switch (role) {
      case "CUSTOMER":
        navigation.reset({ routes: [{ name: "CustomerDashboard" }] });
        break;
      case "SERVICE_PROVIDER":
        navigation.reset({ routes: [{ name: "ProviderDrawer" }] });
        break;
      case "DELIVERY_AGENT":
        navigation.reset({ routes: [{ name: "DeliveryPage" }] });
        break;
      case "ADMIN":
        navigation.reset({ routes: [{ name: "RevenueSummary" }] });
        break;
      default:
        navigation.reset({ routes: [{ name: "Login" }] });
    }
  }
}, [isLoggedIn, role, loading, navigation]);

  return null;
}