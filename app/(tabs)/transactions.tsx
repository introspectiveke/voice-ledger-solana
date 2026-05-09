import { FlatList, Text, View, TextInput, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
}

// Mock data for now
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    amount: 5000,
    description: "Inventory purchase",
    category: "Expenses",
    timestamp: "2026-05-09 14:30",
    status: "confirmed",
  },
  {
    id: "2",
    amount: 12500,
    description: "Customer payment received",
    category: "Sales",
    timestamp: "2026-05-09 12:15",
    status: "confirmed",
  },
  {
    id: "3",
    amount: 3200,
    description: "Utility bill payment",
    category: "Expenses",
    timestamp: "2026-05-09 10:45",
    status: "pending",
  },
];

export default function TransactionsScreen() {
  const colors = useColors();
  const [searchText, setSearchText] = useState("");
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const filteredTransactions = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchText.toLowerCase()) ||
      t.amount.toString().includes(searchText)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return colors.success;
      case "pending":
        return colors.warning;
      case "failed":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "check-circle";
      case "pending":
        return "schedule";
      case "failed":
        return "error";
      default:
        return "help";
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Pressable
      className="bg-surface rounded-lg p-4 mb-3 border border-border flex-row justify-between items-center"
      onPress={() => {
        // TODO: Navigate to transaction detail
      }}
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      <View className="flex-1">
        <Text className="text-lg font-semibold text-foreground">
          KES {item.amount.toLocaleString()}
        </Text>
        <Text className="text-sm text-muted mt-1">{item.description}</Text>
        <Text className="text-xs text-muted mt-2">{item.timestamp}</Text>
      </View>
      <View className="items-center ml-4">
        <MaterialIcons
          name={getStatusIcon(item.status) as any}
          size={24}
          color={getStatusColor(item.status)}
        />
        <Text className="text-xs text-muted mt-1 capitalize">{item.status}</Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-4">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-foreground mb-4">Transactions</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-surface rounded-lg border border-border px-3 py-2">
          <MaterialIcons name="search" size={20} color={colors.muted} />
          <TextInput
            placeholder="Search transactions..."
            placeholderTextColor={colors.muted}
            className="flex-1 ml-2 text-foreground"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText("")}>
              <MaterialIcons name="close" size={20} color={colors.muted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Transactions List */}
      {filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="inbox" size={48} color={colors.muted} />
          <Text className="text-lg text-muted mt-4">
            {searchText ? "No transactions found" : "No transactions yet"}
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
