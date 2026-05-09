import { ScrollView, Text, View, Pressable, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

interface StatementData {
  totalTransactions: number;
  totalKES: number;
  selectedCrypto: string;
  exchangeRate: number;
  totalCrypto: number;
  generatedAt: string;
}

const CRYPTO_OPTIONS = ["SOL", "USDC", "USDT"];

export default function StatementsScreen() {
  const colors = useColors();
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-09");
  const [selectedCrypto, setSelectedCrypto] = useState("SOL");
  const [statement, setStatement] = useState<StatementData | null>(null);

  // Mock exchange rates (in real app, fetch from API)
  const EXCHANGE_RATES: Record<string, number> = {
    SOL: 0.0000285,  // 1 KES = 0.0000285 SOL
    USDC: 0.0077,    // 1 KES = 0.0077 USDC
    USDT: 0.0077,    // 1 KES = 0.0077 USDT
  };

  const handleGenerateStatement = () => {
    // Mock data - in real app, fetch from database
    const totalKES = 45000;
    const exchangeRate = EXCHANGE_RATES[selectedCrypto];
    const totalCrypto = totalKES * exchangeRate;

    setStatement({
      totalTransactions: 15,
      totalKES,
      selectedCrypto,
      exchangeRate,
      totalCrypto,
      generatedAt: new Date().toLocaleString(),
    });
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text className="text-2xl font-bold text-foreground mb-6">Statements</Text>

        {/* Date Range Selection */}
        <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">Date Range</Text>

          <View className="gap-3">
            <View>
              <Text className="text-sm text-muted mb-2">Start Date</Text>
              <View className="flex-row items-center bg-background rounded-lg border border-border px-3 py-2">
                <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
                <TextInput
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.muted}
                  className="flex-1 ml-2 text-foreground"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
            </View>

            <View>
              <Text className="text-sm text-muted mb-2">End Date</Text>
              <View className="flex-row items-center bg-background rounded-lg border border-border px-3 py-2">
                <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
                <TextInput
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.muted}
                  className="flex-1 ml-2 text-foreground"
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Crypto Selection */}
        <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">Convert to Crypto</Text>

          <View className="flex-row gap-2">
            {CRYPTO_OPTIONS.map((crypto) => (
              <Pressable
                key={crypto}
                className={`flex-1 py-3 px-4 rounded-lg border-2 items-center ${
                  selectedCrypto === crypto
                    ? "bg-primary border-primary"
                    : "bg-background border-border"
                }`}
                onPress={() => setSelectedCrypto(crypto)}
              >
                <Text
                  className={`font-semibold ${
                    selectedCrypto === crypto ? "text-background" : "text-foreground"
                  }`}
                >
                  {crypto}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <Pressable
          className="bg-primary rounded-lg py-4 px-6 items-center mb-6"
          onPress={handleGenerateStatement}
          style={({ pressed }) => [pressed && { opacity: 0.8 }]}
        >
          <Text className="text-lg font-semibold text-background">Generate Statement</Text>
        </Pressable>

        {/* Statement Preview */}
        {statement && (
          <View className="bg-surface rounded-lg p-6 border border-border mb-6">
            <View className="flex-row items-center mb-4">
              <MaterialIcons name="check-circle" size={24} color={colors.success} />
              <Text className="text-lg font-semibold text-foreground ml-2">
                Statement Generated
              </Text>
            </View>

            <View className="gap-4">
              <View className="flex-row justify-between items-center pb-4 border-b border-border">
                <Text className="text-sm text-muted">Date Range</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {startDate} to {endDate}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pb-4 border-b border-border">
                <Text className="text-sm text-muted">Total Transactions</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {statement.totalTransactions}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pb-4 border-b border-border">
                <Text className="text-sm text-muted">Total Amount (KES)</Text>
                <Text className="text-sm font-semibold text-foreground">
                  KES {statement.totalKES.toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pb-4 border-b border-border">
                <Text className="text-sm text-muted">Exchange Rate</Text>
                <Text className="text-sm font-semibold text-foreground">
                  1 KES = {statement.exchangeRate.toFixed(8)} {statement.selectedCrypto}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pt-2">
                <Text className="text-lg font-semibold text-foreground">
                  Total ({statement.selectedCrypto})
                </Text>
                <Text className="text-lg font-bold text-primary">
                  {statement.totalCrypto.toFixed(6)} {statement.selectedCrypto}
                </Text>
              </View>

              <Text className="text-xs text-muted mt-4">
                Generated: {statement.generatedAt}
              </Text>
            </View>

            {/* Export Options */}
            <View className="flex-row gap-3 mt-6 pt-6 border-t border-border">
              <Pressable
                className="flex-1 bg-secondary rounded-lg py-3 items-center"
                onPress={() => {
                  // TODO: Implement PDF export
                }}
                style={({ pressed }) => [pressed && { opacity: 0.8 }]}
              >
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="picture-as-pdf" size={20} color="#ffffff" />
                  <Text className="font-semibold text-white">Export PDF</Text>
                </View>
              </Pressable>

              <Pressable
                className="flex-1 bg-secondary rounded-lg py-3 items-center"
                onPress={() => {
                  // TODO: Implement share functionality
                }}
                style={({ pressed }) => [pressed && { opacity: 0.8 }]}
              >
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="share" size={20} color="#ffffff" />
                  <Text className="font-semibold text-white">Share</Text>
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
