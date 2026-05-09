import { ScrollView, Text, View, Pressable, TextInput, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { parseTranscript as parseTranscriptUtil } from "@/lib/transaction-parser";

interface ParsedTransaction {
  amount: number | null;
  description: string;
  category: string;
}

const TRANSACTION_CATEGORIES = ["Sales", "Expenses", "Payments", "Returns", "Other"];

export default function RecordTransactionScreen() {
  const colors = useColors();
  const [mode, setMode] = useState<"voice" | "manual">("voice");
  const [parsedData, setParsedData] = useState<ParsedTransaction>({
    amount: null,
    description: "",
    category: "Other",
  });
  const [manualAmount, setManualAmount] = useState("");
  const [manualDescription, setManualDescription] = useState("");

  const { isRecording, transcript, partialTranscript, error, audioLevel, startRecording, stopRecording, cancelRecording } = useSpeechToText({
    onTranscriptComplete: (text) => {
      handleParseTranscript(text);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onPartialTranscript: (text) => {
      // Update UI with partial transcript
    },
  });

  // Parse transcript using utility function
  const handleParseTranscript = (text: string) => {
    const parsed = parseTranscriptUtil(text);
    setParsedData(parsed);
  };

  const handleSaveTransaction = async () => {
    try {
      const finalAmount = mode === "voice" ? parsedData.amount : parseInt(manualAmount);
      const finalDescription = mode === "voice" ? parsedData.description : manualDescription;
      const finalCategory = parsedData.category;

      if (!finalAmount || finalAmount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      if (!finalDescription.trim()) {
        alert("Please enter a description");
        return;
      }

      // TODO: Save transaction to database and blockchain
      console.log("Saving transaction:", {
        amount: finalAmount,
        description: finalDescription,
        category: finalCategory,
        timestamp: new Date().toISOString(),
      });

      alert("Transaction saved successfully!");
      resetForm();
    } catch (err) {
      alert("Failed to save transaction");
    }
  };

  const resetForm = () => {
    setParsedData({ amount: null, description: "", category: "Other" });
    setManualAmount("");
    setManualDescription("");
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err) {
      alert("Failed to start recording");
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
    } catch (err) {
      alert("Failed to stop recording");
    }
  };

  const waveformBars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    height: isRecording ? Math.random() * 100 : 10,
  }));

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-2">Record Transaction</Text>
          <Text className="text-sm text-muted">Speak or manually enter your transaction details</Text>
        </View>

        {/* Mode Selector */}
        <View className="flex-row gap-2 mb-6">
          <Pressable
            className={`flex-1 py-3 px-4 rounded-lg border-2 items-center ${
              mode === "voice" ? "bg-primary border-primary" : "bg-surface border-border"
            }`}
            onPress={() => setMode("voice")}
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="mic"
                size={20}
                color={mode === "voice" ? "#000000" : colors.foreground}
              />
              <Text
                className={`font-semibold ${
                  mode === "voice" ? "text-background" : "text-foreground"
                }`}
              >
                Voice
              </Text>
            </View>
          </Pressable>

          <Pressable
            className={`flex-1 py-3 px-4 rounded-lg border-2 items-center ${
              mode === "manual" ? "bg-primary border-primary" : "bg-surface border-border"
            }`}
            onPress={() => setMode("manual")}
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="edit"
                size={20}
                color={mode === "manual" ? "#000000" : colors.foreground}
              />
              <Text
                className={`font-semibold ${
                  mode === "manual" ? "text-background" : "text-foreground"
                }`}
              >
                Manual
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Voice Recording Section */}
        {mode === "voice" && (
          <View className="bg-surface rounded-lg p-6 mb-6 border border-border items-center">
            {/* Waveform Visualization */}
            {isRecording && (
              <View className="flex-row items-end justify-center gap-1 mb-6 h-16">
                {waveformBars.map((bar) => (
                  <View
                    key={bar.id}
                    className="bg-primary rounded-full"
                    style={{
                      width: 4,
                      height: `${bar.height}%`,
                    }}
                  />
                ))}
              </View>
            )}

            {/* Record Button */}
            <Pressable
              className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${
                isRecording ? "bg-error" : "bg-primary"
              }`}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
              style={({ pressed }) => [
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              <MaterialIcons
                name={isRecording ? "stop" : "mic"}
                size={40}
                color={isRecording ? "#ffffff" : "#000000"}
              />
            </Pressable>

            {/* Status Text */}
            <Text className="text-sm text-muted mb-4">
              {isRecording ? "Recording... Tap to stop" : "Tap to start recording"}
            </Text>

            {/* Transcript Display */}
            {(transcript || partialTranscript) && (
              <View className="w-full bg-background rounded-lg p-4 mb-4 border border-border">
                {partialTranscript && !transcript && (
                  <View>
                    <Text className="text-xs text-muted mb-2">Listening...</Text>
                    <Text className="text-sm text-foreground italic">{partialTranscript}</Text>
                  </View>
                )}
                {transcript && (
                  <View>
                    <Text className="text-xs text-muted mb-2">Transcript</Text>
                    <Text className="text-sm text-foreground">{transcript}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Error Display */}
            {error && (
              <View className="w-full bg-error bg-opacity-10 rounded-lg p-4 mb-4 border border-error flex-row gap-3">
                <MaterialIcons name="error" size={20} color={colors.error} />
                <Text className="text-sm text-error flex-1">{error}</Text>
              </View>
            )}

            {/* Cancel Button */}
            {isRecording && (
              <Pressable
                className="py-2 px-4 bg-error rounded-lg"
                onPress={cancelRecording}
              >
                <Text className="text-sm font-semibold text-white">Cancel</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Manual Entry Section */}
        {mode === "manual" && (
          <View className="bg-surface rounded-lg p-4 mb-6 border border-border gap-4">
            <View>
              <Text className="text-sm text-muted mb-2">Amount (KES)</Text>
              <View className="flex-row items-center bg-background rounded-lg border border-border px-3 py-2">
                <MaterialIcons name="attach-money" size={20} color={colors.primary} />
                <TextInput
                  placeholder="Enter amount"
                  placeholderTextColor={colors.muted}
                  className="flex-1 ml-2 text-foreground"
                  value={manualAmount}
                  onChangeText={setManualAmount}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View>
              <Text className="text-sm text-muted mb-2">Description</Text>
              <TextInput
                placeholder="What is this transaction for?"
                placeholderTextColor={colors.muted}
                className="bg-background rounded-lg border border-border px-3 py-2 text-foreground"
                value={manualDescription}
                onChangeText={setManualDescription}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        )}

        {/* Parsed Data / Preview */}
        {(parsedData.amount !== null || manualAmount) && (
          <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-4">Transaction Preview</Text>

            <View className="gap-3">
              <View className="flex-row justify-between items-center pb-3 border-b border-border">
                <Text className="text-sm text-muted">Amount</Text>
                <Text className="text-lg font-bold text-primary">
                  KES {(mode === "voice" ? (parsedData.amount || 0) : (parseInt(manualAmount) || 0)).toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pb-3 border-b border-border">
                <Text className="text-sm text-muted">Description</Text>
                <Text className="text-sm font-semibold text-foreground flex-1 text-right ml-2">
                  {mode === "voice" ? parsedData.description : manualDescription}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Category</Text>
                <View className="flex-row gap-2">
                  {TRANSACTION_CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      className={`px-3 py-1 rounded-full border ${
                        parsedData.category === cat
                          ? "bg-primary border-primary"
                          : "bg-background border-border"
                      }`}
                      onPress={() =>
                        setParsedData((prev) => ({ ...prev, category: cat }))
                      }
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          parsedData.category === cat
                            ? "text-background"
                            : "text-foreground"
                        }`}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-6">
          <Pressable
            className="flex-1 bg-primary rounded-lg py-4 items-center"
            onPress={handleSaveTransaction}
            disabled={!((mode === "voice" && parsedData.amount) || (mode === "manual" && manualAmount))}
            style={({ pressed }) => [
              pressed && { opacity: 0.8 },
              !((mode === "voice" && parsedData.amount) || (mode === "manual" && manualAmount)) && {
                opacity: 0.5,
              },
            ]}
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="check" size={20} color="#000000" />
              <Text className="font-semibold text-background">Save Transaction</Text>
            </View>
          </Pressable>

          <Pressable
            className="flex-1 bg-error rounded-lg py-4 items-center"
            onPress={resetForm}
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="close" size={20} color="#ffffff" />
              <Text className="font-semibold text-white">Clear</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
