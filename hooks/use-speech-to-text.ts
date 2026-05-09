import { useState, useCallback, useRef, useEffect } from "react";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";

interface TranscriptionState {
  isRecording: boolean;
  transcript: string;
  partialTranscript: string;
  error: string | null;
  isProcessing: boolean;
  audioLevel: number;
}

interface UseSTTOptions {
  apiKey?: string;
  language?: string;
  onTranscriptComplete?: (text: string) => void;
  onPartialTranscript?: (text: string) => void;
}

/**
 * Hook for managing speech-to-text transcription
 * Uses expo-audio for recording and provides mock transcription
 * In production, integrate with ElevenLabs WebSocket API
 */
export function useSpeechToText(options: UseSTTOptions = {}) {
  const { apiKey, language = "en", onTranscriptComplete, onPartialTranscript } = options;
  // useAudioPlayer is imported but not used in this hook
  void useAudioPlayer;

  const [state, setState] = useState<TranscriptionState>({
    isRecording: false,
    transcript: "",
    partialTranscript: "",
    error: null,
    isProcessing: false,
    audioLevel: 0,
  });

  const recordingUriRef = useRef<string | null>(null);
  const audioLevelIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mockTranscriptTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRecordingRef = useRef(false);

  // Initialize audio mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      } catch (err) {
        console.error("Failed to setup audio mode:", err);
      }
    };

    setupAudio();

    return () => {
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
      }
      if (mockTranscriptTimeoutRef.current) {
        clearTimeout(mockTranscriptTimeoutRef.current);
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setState((prev) => ({
        ...prev,
        error: null,
        isRecording: true,
        transcript: "",
        partialTranscript: "",
      }));

      isRecordingRef.current = true;

      // Create recording URI
      const recordingUri = `${FileSystem.documentDirectory}recording-${Date.now()}.m4a`;
      recordingUriRef.current = recordingUri;

      // Note: In a real implementation, you would use expo-audio's recording API
      // For now, we simulate recording with mock transcription

      // Simulate audio level monitoring
      audioLevelIntervalRef.current = setInterval(() => {
        if (isRecordingRef.current) {
          setState((prev) => ({
            ...prev,
            audioLevel: Math.random() * 100,
          }));
        }
      }, 100);

      // Simulate partial transcripts for demo
      mockTranscriptTimeoutRef.current = setTimeout(() => {
        if (isRecordingRef.current) {
          onPartialTranscript?.("Received payment of");
          setState((prev) => ({ ...prev, partialTranscript: "Received payment of" }));
        }
      }, 1000);

      // Simulate more partial transcripts
      setTimeout(() => {
        if (isRecordingRef.current) {
          onPartialTranscript?.("Received payment of five thousand");
          setState((prev) => ({
            ...prev,
            partialTranscript: "Received payment of five thousand",
          }));
        }
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start recording";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isRecording: false,
      }));
      isRecordingRef.current = false;
    }
  }, [onPartialTranscript]);

  const stopRecording = useCallback(async () => {
    try {
      isRecordingRef.current = false;

      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
      }

      if (mockTranscriptTimeoutRef.current) {
        clearTimeout(mockTranscriptTimeoutRef.current);
      }

      // Mock transcription result
      const finalTranscript = "Received payment of five thousand Kenyan shillings";

      setState((prev) => ({
        ...prev,
        isRecording: false,
        transcript: finalTranscript,
        partialTranscript: "",
        audioLevel: 0,
      }));

      onTranscriptComplete?.(finalTranscript);

      // Clean up recording file
      if (recordingUriRef.current) {
        try {
          await FileSystem.deleteAsync(recordingUriRef.current, { idempotent: true });
        } catch (err) {
          console.error("Failed to delete recording file:", err);
        }
        recordingUriRef.current = null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to stop recording";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isRecording: false,
      }));
      isRecordingRef.current = false;
    }
  }, [onTranscriptComplete]);

  const cancelRecording = useCallback(async () => {
    try {
      isRecordingRef.current = false;

      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
      }

      if (mockTranscriptTimeoutRef.current) {
        clearTimeout(mockTranscriptTimeoutRef.current);
      }

      setState((prev) => ({
        ...prev,
        isRecording: false,
        transcript: "",
        partialTranscript: "",
        audioLevel: 0,
      }));

      // Clean up recording file
      if (recordingUriRef.current) {
        try {
          await FileSystem.deleteAsync(recordingUriRef.current, { idempotent: true });
        } catch (err) {
          console.error("Failed to delete recording file:", err);
        }
        recordingUriRef.current = null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cancel recording";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcript: "",
      partialTranscript: "",
      error: null,
    }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording,
    clearTranscript,
  };
}
