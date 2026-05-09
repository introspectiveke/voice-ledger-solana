import { ScrollView, Text, View, Pressable, TextInput, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

export default function SettingsScreen() {
  const colors = useColors();
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [preferredCrypto, setPreferredCrypto] = useState("SOL");

  const handleTestConnection = () => {
    // TODO: Implement API connection test
    alert("Testing ElevenLabs connection...");
  };

  const handleExportData = () => {
    // TODO: Implement data export
    alert("Exporting all transactions...");
  };

  const handleClearCache = () => {
    // TODO: Implement cache clearing
    alert("Cache cleared successfully");
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text className="text-2xl font-bold text-foreground mb-6">Settings</Text>

        {/* Account Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Account</Text>

          <View className="bg-surface rounded-lg p-4 border border-border">
            <View className="flex-row items-center justify-between pb-4 border-b border-border">
              <View className="flex-1">
                <Text className="text-sm text-muted mb-1">Connected Wallet</Text>
                <Text className="text-sm font-semibold text-foreground">
                  7K8...9mQ (Phantom)
                </Text>
              </View>
              <MaterialIcons name="check-circle" size={24} color={colors.success} />
            </View>

            <Pressable
              className="mt-4 py-3 px-4 bg-error rounded-lg items-center"
              onPress={() => {
                // TODO: Implement wallet disconnect
              }}
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            >
              <Text className="font-semibold text-white">Disconnect Wallet</Text>
            </Pressable>
          </View>
        </View>

        {/* API Configuration Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">API Configuration</Text>

          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <View>
              <Text className="text-sm text-muted mb-2">ElevenLabs API Key</Text>
              <View className="flex-row items-center bg-background rounded-lg border border-border px-3 py-2">
                <MaterialIcons
                  name={showApiKey ? "visibility" : "visibility-off"}
                  size={20}
                  color={colors.muted}
                />
                <TextInput
                  placeholder="Enter your API key"
                  placeholderTextColor={colors.muted}
                  className="flex-1 ml-2 text-foreground"
                  value={apiKey}
                  onChangeText={setApiKey}
                  secureTextEntry={!showApiKey}
                />
                <Pressable onPress={() => setShowApiKey(!showApiKey)}>
                  <MaterialIcons
                    name={showApiKey ? "check" : "close"}
                    size={20}
                    color={colors.muted}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              className="py-3 px-4 bg-primary rounded-lg items-center"
              onPress={handleTestConnection}
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            >
              <Text className="font-semibold text-background">Test Connection</Text>
            </Pressable>
          </View>
        </View>

        {/* Preferences Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Preferences</Text>

          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <View className="flex-row items-center justify-between pb-4 border-b border-border">
              <View>
                <Text className="text-sm font-semibold text-foreground">Auto-Sync Transactions</Text>
                <Text className="text-xs text-muted mt-1">
                  Automatically sync online transactions
                </Text>
              </View>
              <Switch value={autoSync} onValueChange={setAutoSync} />
            </View>

            <View>
              <Text className="text-sm text-muted mb-2">Preferred Crypto for Statements</Text>
              <View className="flex-row gap-2">
                {["SOL", "USDC", "USDT"].map((crypto) => (
                  <Pressable
                    key={crypto}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 items-center ${
                      preferredCrypto === crypto
                        ? "bg-primary border-primary"
                        : "bg-background border-border"
                    }`}
                    onPress={() => setPreferredCrypto(crypto)}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        preferredCrypto === crypto ? "text-background" : "text-foreground"
                      }`}
                    >
                      {crypto}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Data Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Data</Text>

          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Pressable
              className="py-3 px-4 bg-secondary rounded-lg flex-row items-center justify-center"
              onPress={handleExportData}
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            >
              <MaterialIcons name="download" size={20} color="#ffffff" />
              <Text className="font-semibold text-white ml-2">Export All Transactions</Text>
            </Pressable>

            <Pressable
              className="py-3 px-4 bg-warning rounded-lg flex-row items-center justify-center"
              onPress={handleClearCache}
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            >
              <MaterialIcons name="delete-sweep" size={20} color="#ffffff" />
              <Text className="font-semibold text-white ml-2">Clear Cache</Text>
            </Pressable>
          </View>
        </View>

        {/* About Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">About</Text>

          <View className="bg-surface rounded-lg p-4 border border-border gap-4">
            <View className="flex-row justify-between items-center pb-4 border-b border-border">
              <Text className="text-sm text-muted">App Version</Text>
              <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
            </View>

            <View className="flex-row justify-between items-center pb-4 border-b border-border">
              <Text className="text-sm text-muted">Build Number</Text>
              <Text className="text-sm font-semibold text-foreground">1</Text>
            </View>

            <Pressable
              className="py-3 px-4 bg-background rounded-lg flex-row items-center justify-center border border-border"
              onPress={() => {
                // TODO: Open privacy policy
              }}
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            >
              <MaterialIcons name="privacy-tip" size={20} color={colors.primary} />
              <Text className="font-semibold text-foreground ml-2">Privacy Policy</Text>
            </Pressable>

            <Pressable
              className="py-3 px-4 bg-background rounded-lg flex-row items-center justify-center border border-border"
              onPress={() => {
                // TODO: Open terms of service
              }}
              style={({ pressed }) => [pressed && { opacity: 0.8 }]}
            >
              <MaterialIcons name="description" size={20} color={colors.primary} />
              <Text className="font-semibold text-foreground ml-2">Terms of Service</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
