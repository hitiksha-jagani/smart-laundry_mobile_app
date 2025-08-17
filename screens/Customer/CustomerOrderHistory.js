import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function CustomerOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get("/orders/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredOrders = response.data.filter(
          (order) => order.status !== "PENDING"
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error("Failed to fetch order history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No past orders found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Order History</Text>

      {orders.map((order) => (
        <View key={order.orderId} style={styles.card}>
          {/* Order Info */}
          <View style={styles.row}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.value}>{order.orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pickup:</Text>
            <Text style={styles.value}>
              {order.pickupDate} at {order.pickupTime}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery:</Text>
            <Text style={styles.value}>
              {order.deliveryDate
                ? `${order.deliveryDate} at ${order.deliveryTime}`
                : "Pending"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, styles.status]}>{order.status}</Text>
          </View>

          {/* Contact Info */}
          <View style={styles.contactBox}>
            <Text style={styles.contactText}>
              <Text style={styles.bold}>Contact:</Text> {order.contactName} (
              {order.contactPhone})
            </Text>
            <Text style={styles.contactText}>
              <Text style={styles.bold}>Address:</Text> {order.contactAddress}
            </Text>
          </View>

          <Text style={styles.timestamp}>
            Created at: {new Date(order.createdAt).toLocaleString()}
          </Text>

          {/* Promotion Button */}
          <View style={styles.centerBtn}>
            <TouchableOpacity
              onPress={() => {
                if (order.isPromotionApplied) {
                  Alert.alert(
                    "Info",
                    "A promotion is already applied to this order."
                  );
                } else {
                  navigation.navigate("AvailablePromotions", {
                    orderId: order.orderId,
                  });
                }
              }}
              disabled={order.isPromotionApplied}
              style={[
                styles.baseBtn,
                order.isPromotionApplied ? styles.disabledBtn : styles.greenBtn,
              ]}
            >
              <Text style={styles.btnText}>
                {order.isPromotionApplied
                  ? `Promotion Applied (${order.appliedPromoCode})`
                  : "Apply Promotion"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Summary Button */}
          <View style={styles.rightBtn}>
            <TouchableOpacity
              style={[styles.baseBtn, styles.blueBtn]}
              onPress={() =>
                navigation.navigate("OrderSummary", { orderId: order.orderId })
              }
            >
              <Text style={styles.btnText}>View Summary</Text>
            </TouchableOpacity>
          </View>

          {/* Bill Button */}
          <View style={styles.rightBtn}>
            <TouchableOpacity
              style={[styles.baseBtn, styles.purpleBtn]}
              onPress={() =>
                navigation.navigate("OrderBill", { orderId: order.orderId })
              }
            >
              <Text style={styles.btnText}>View Bill</Text>
            </TouchableOpacity>
          </View>

          {/* Track Button (if not delivered) */}
          {order.status !== "DELIVERED" && (
            <View style={styles.rightBtn}>
              <TouchableOpacity
                style={[styles.baseBtn, styles.orangeBtn]}
                onPress={() =>
                  navigation.navigate("TrackOrder", { orderId: order.orderId })
                }
              >
                <Text style={styles.btnText}>Track Order</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cancel Button */}
          <TouchableOpacity
            style={[styles.baseBtn, styles.redBtn, { marginTop: 12 }]}
            onPress={() =>
              navigation.navigate("CancelOrder", { orderId: order.orderId })
            }
          >
            <Text style={styles.btnText}>Cancel Order</Text>
          </TouchableOpacity>

          {/* Reschedule Button */}
          <TouchableOpacity
            style={[styles.baseBtn, styles.yellowBtn, { marginTop: 12 }]}
            onPress={() =>
              navigation.navigate("RescheduleOrder", { orderId: order.orderId })
            }
          >
            <Text style={styles.btnText}>Reschedule Order</Text>
          </TouchableOpacity>

          {/* Feedback Button */}
          {order.status === "DELIVERED" && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Feedback", { orderId: order.orderId })
              }
            >
              <Text style={styles.link}>Give Feedback</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2563EB",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontWeight: "500", color: "#555" },
  value: { color: "#111" },
  status: { fontWeight: "600", color: "#2563EB" },
  contactBox: { marginTop: 8 },
  contactText: { fontSize: 14, color: "#333", marginBottom: 2 },
  bold: { fontWeight: "bold" },
  timestamp: { fontSize: 12, color: "#888", marginTop: 6 },
  baseBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  centerBtn: { marginTop: 14, alignItems: "center" },
  rightBtn: { marginTop: 12, alignItems: "flex-end" },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  greenBtn: { backgroundColor: "#16A34A" },
  disabledBtn: { backgroundColor: "#A1A1AA" },
  blueBtn: { backgroundColor: "#2563EB" },
  purpleBtn: { backgroundColor: "#7C3AED" },
  orangeBtn: { backgroundColor: "#F97316" },
  redBtn: { backgroundColor: "#DC2626" },
  yellowBtn: { backgroundColor: "#FACC15" },
  link: {
    color: "#2563EB",
    textAlign: "center",
    marginTop: 14,
    textDecorationLine: "underline",
  },
});