import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
}

// Mock data
const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    amount: 5000,
    description: "Inventory purchase",
    timestamp: "14:30",
    status: "confirmed",
  },
  {
    id: "2",
    amount: 12500,
    description: "Customer payment",
    timestamp: "12:15",
    status: "confirmed",
  },
  {
    id: "3",
    amount: 3200,
    description: "Utility bill",
    timestamp: "10:45",
    status: "pending",
  },
];

export default function HomeScreen() {
  const colors = useColors();
  const [transactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);

  // Mock summary data
  const todayTransactions = 8;
  const todayAmount = 45000;
  const todayEquivalentCrypto = 1.28; // SOL equivalent

  const renderRecentTransaction = ({ item }: { item: Transaction }) => (
    <Pressable
      className="bg-surface rounded-lg p-3 mb-2 border border-border flex-row justify-between items-center"
      onPress={() => {
        // TODO: Navigate to transaction detail
      }}
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">
          KES {item.amount.toLocaleString()}
        </Text>
        <Text className="text-xs text-muted mt-1">{item.description}</Text>
      </View>
      <View className="items-center ml-3">
        <Text className="text-xs text-muted">{item.timestamp}</Text>
        <MaterialIcons
          name={item.status === "confirmed" ? "check-circle" : "schedule"}
          size={16}
          color={item.status === "confirmed" ? colors.success : colors.warning}
          style={{ marginTop: 4 }}
        />
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">VoiceLedger</Text>
          <Text className="text-sm text-muted mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Summary Cards */}
        <View className="gap-3 mb-6">
          {/* Transactions Today Card */}
          <View className="bg-primary rounded-xl p-4 border border-primary">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-background opacity-80">Transactions Today</Text>
                <Text className="text-3xl font-bold text-background mt-2">{todayTransactions}</Text>
              </View>
              <MaterialIcons name="trending-up" size={32} color="#ffffff" opacity={0.3} />
            </View>
          </View>

          {/* Amount Card */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm text-muted">Total Amount (Today)</Text>
              <MaterialIcons name="attach-money" size={20} color={colors.primary} />
            </View>
            <Text className="text-2xl font-bold text-foreground">
              KES {todayAmount.toLocaleString()}
            </Text>
            <Text className="text-xs text-muted mt-2">
              ≈ {todayEquivalentCrypto.toFixed(4)} SOL
            </Text>
          </View>
        </View>

        {/* Quick Action Button */}
        <Pressable
          className="bg-primary rounded-xl py-4 px-6 flex-row items-center justify-center mb-6 shadow-lg"
          onPress={() => {
            // TODO: Navigate to record transaction screen
          }}
          style={({ pressed }) => [
            pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
          ]}
        >
          <MaterialIcons name="mic" size={24} color="#000000" />
          <Text className="text-lg font-bold text-background ml-3">Record Transaction</Text>
        </Pressable>

        {/* Recent Transactions Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-foreground">Recent Transactions</Text>
            <Pressable
              onPress={() => {
                // TODO: Navigate to transactions tab
              }}
            >
              <Text className="text-sm font-semibold text-primary">View All</Text>
            </Pressable>
          </View>

          {transactions.length > 0 ? (
            <FlatList
              data={transactions}
              renderItem={renderRecentTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              nestedScrollEnabled={false}
            />
          ) : (
            <View className="bg-surface rounded-lg p-6 items-center border border-border">
              <MaterialIcons name="inbox" size={32} color={colors.muted} />
              <Text className="text-sm text-muted mt-2">No transactions yet</Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View className="bg-surface rounded-xl p-4 border border-border mb-6">
          <Text className="text-sm font-semibold text-foreground mb-4">Quick Stats</Text>

          <View className="gap-3">
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="check-circle" size={20} color={colors.success} />
                <Text className="text-sm text-muted">Confirmed</Text>
              </View>
              <Text className="text-sm font-semibold text-foreground">6 transactions</Text>
            </View>

            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="schedule" size={20} color={colors.warning} />
                <Text className="text-sm text-muted">Pending</Text>
              </View>
              <Text className="text-sm font-semibold text-foreground">2 transactions</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="verified" size={20} color={colors.primary} />
                <Text className="text-sm text-muted">On Blockchain</Text>
              </View>
              <Text className="text-sm font-semibold text-foreground">6 transactions</Text>
            </View>
          </View>
        </View>

        {/* Helpful Tips */}
        <View className="bg-secondary bg-opacity-10 rounded-xl p-4 border border-secondary border-opacity-30">
          <View className="flex-row items-start gap-3">
            <MaterialIcons name="info" size={20} color={colors.primary} />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">Tip</Text>
              <Text className="text-xs text-muted mt-1">
                Use voice recording for faster transaction entry. Your data is securely stored on
                the Solana blockchain.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
