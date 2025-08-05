import React, { useState, useEffect, useRef } from "react";

const VoiceToText = ({
  onTextChange,
  placeholder = "Click microphone to start recording...",
  showControls = true,
  autoFill = false,
  className = "",
  buttonSize = "default", // "small", "default", "large"
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState("unknown");
  const [transcribedText, setTranscribedText] = useState("");
  const recognitionRef = useRef(null);

  // Check if voice recognition is supported
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setVoiceSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          const newText = transcribedText + finalTranscript;
          setTranscribedText(newText);
          if (onTextChange) {
            onTextChange(newText);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        setIsListening(false);

        if (event.error === "audio-capture") {
          setMicrophonePermission("denied");
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsListening(false);
      };
    }
  }, [transcribedText, onTextChange]);

  // Test microphone access
  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophonePermission("granted");
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone test failed:", error);
      setMicrophonePermission("denied");
      return false;
    }
  };

  const startVoiceRecording = async () => {
    if (recognitionRef.current && voiceSupported) {
      try {
        // Test microphone access first
        const microphoneAccess = await testMicrophone();

        if (!microphoneAccess) {
          alert("Please allow microphone access to use voice recording");
          return;
        }

        recognitionRef.current.start();
        setIsRecording(true);
        setIsListening(true);
      } catch (error) {
        console.error("Error starting voice recognition:", error);
      }
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const clearTranscribedText = () => {
    setTranscribedText("");
    if (onTextChange) {
      onTextChange("");
    }
  };

  const copyTranscribedText = () => {
    if (transcribedText) {
      navigator.clipboard.writeText(transcribedText);
    }
  };

  const getButtonSizeClasses = () => {
    switch (buttonSize) {
      case "small":
        return "p-2 text-sm";
      case "large":
        return "p-4 text-lg";
      default:
        return "p-3 text-base";
    }
  };

  if (!voiceSupported) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Voice recognition not supported in this browser
      </div>
    );
  }

  if (microphonePermission === "denied") {
    return (
      <div className={`text-sm text-red-500 ${className}`}>
        ❌ Microphone access denied. Please allow microphone access in your
        browser settings.
        <button
          onClick={testMicrophone}
          className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          Test Access
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Voice Input Display */}
      <div className="relative">
        <textarea
          value={transcribedText}
          onChange={(e) => {
            setTranscribedText(e.target.value);
            if (onTextChange) {
              onTextChange(e.target.value);
            }
          }}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />

        {/* Microphone Button */}
        <button
          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
          className={`absolute right-2 top-2 ${getButtonSizeClasses()} rounded-full focus:ring-2 focus:ring-blue-500 transition-all ${
            isRecording
              ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? "⏹️" : "🎤"}
        </button>

        {/* Listening Indicator */}
        {isListening && (
          <div className="absolute left-2 top-2 flex items-center text-blue-600 text-sm">
            <div className="animate-pulse mr-1">🔴</div>
            Listening...
          </div>
        )}
      </div>

      {/* Additional Controls */}
      {showControls && transcribedText && (
        <div className="flex gap-2">
          <button
            onClick={copyTranscribedText}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
            aria-label="Copy transcribed text"
          >
            📋 Copy
          </button>
          <button
            onClick={clearTranscribedText}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
            aria-label="Clear transcribed text"
          >
            🗑️ Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceToText;
