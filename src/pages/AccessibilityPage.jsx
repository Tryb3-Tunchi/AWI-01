import React, { useState, useEffect, useRef } from "react";

const AccessibilityPage = () => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [focusIndicator, setFocusIndicator] = useState(true);
  const [lineSpacing, setLineSpacing] = useState(1.5);

  // Voice-to-text states
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const mediaRecorderRef = useRef(null);
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
          setTranscribedText((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        setIsListening(false);
        announceToScreenReader(`Voice recognition error: ${event.error}`);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsListening(false);
      };
    }
  }, []);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.style.fontSize = `${fontSize}px`;

    // High contrast
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Reduced motion
    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }

    // Focus indicator
    if (focusIndicator) {
      root.classList.add("focus-visible");
    } else {
      root.classList.remove("focus-visible");
    }

    // Line spacing
    root.style.lineHeight = lineSpacing.toString();
  }, [fontSize, highContrast, reducedMotion, focusIndicator, lineSpacing]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl + V for voice recording
      if (event.ctrlKey && event.key === "v" && voiceSupported) {
        event.preventDefault();
        if (isRecording) {
          stopVoiceRecording();
        } else {
          startVoiceRecording();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isRecording, voiceSupported]);

  // Voice-to-text functions
  const startVoiceRecording = () => {
    if (recognitionRef.current && voiceSupported) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setIsListening(true);
        announceToScreenReader("Voice recording started. Speak now.");
      } catch (error) {
        console.error("Error starting voice recognition:", error);
        announceToScreenReader("Error starting voice recording");
      }
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
      announceToScreenReader("Voice recording stopped");
    }
  };

  const clearTranscribedText = () => {
    setTranscribedText("");
    announceToScreenReader("Transcribed text cleared");
  };

  const copyTranscribedText = () => {
    if (transcribedText) {
      navigator.clipboard.writeText(transcribedText);
      announceToScreenReader("Transcribed text copied to clipboard");
    }
  };

  // Screen reader announcements
  const announceToScreenReader = (message) => {
    if (screenReader) {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = message;
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    announceToScreenReader(`Font size changed to ${newSize} pixels`);
  };

  const handleHighContrastToggle = () => {
    setHighContrast(!highContrast);
    announceToScreenReader(
      highContrast
        ? "High contrast mode disabled"
        : "High contrast mode enabled"
    );
  };

  const handleReducedMotionToggle = () => {
    setReducedMotion(!reducedMotion);
    announceToScreenReader(
      reducedMotion ? "Reduced motion disabled" : "Reduced motion enabled"
    );
  };

  const handleScreenReaderToggle = () => {
    setScreenReader(!screenReader);
    if (!screenReader) {
      announceToScreenReader("Screen reader mode enabled");
    }
  };

  const accessibilityFeatures = [
    {
      title: "Voice-to-Text",
      description: "Convert speech to text for form filling and navigation",
      icon: "🎤",
      status: voiceSupported
        ? isRecording
          ? "Recording"
          : "Available"
        : "Not Supported",
    },
    {
      title: "Keyboard Navigation",
      description: "Navigate through all content using only your keyboard",
      icon: "⌨️",
      status: "Available",
    },
    {
      title: "Screen Reader Support",
      description:
        "Full compatibility with screen readers like JAWS, NVDA, and VoiceOver",
      icon: "🔊",
      status: "Available",
    },
    {
      title: "High Contrast Mode",
      description: "Enhanced contrast for better visibility",
      icon: "🎨",
      status: highContrast ? "Enabled" : "Available",
    },
    {
      title: "Font Size Adjustment",
      description: "Increase or decrease text size for better readability",
      icon: "📝",
      status: "Available",
    },
    {
      title: "Focus Indicators",
      description: "Clear visual indicators for keyboard navigation",
      icon: "🎯",
      status: focusIndicator ? "Enabled" : "Available",
    },
    {
      title: "Reduced Motion",
      description: "Minimize animations and transitions",
      icon: "🎬",
      status: reducedMotion ? "Enabled" : "Available",
    },
    {
      title: "Alternative Text",
      description: "Descriptive text for all images and media",
      icon: "🖼️",
      status: "Available",
    },
    {
      title: "Semantic HTML",
      description: "Proper heading structure and landmarks",
      icon: "🏗️",
      status: "Available",
    },
  ];

  const keyboardShortcuts = [
    { key: "Tab", description: "Navigate between interactive elements" },
    { key: "Shift + Tab", description: "Navigate backwards" },
    { key: "Enter/Space", description: "Activate buttons and links" },
    { key: "Arrow Keys", description: "Navigate within components" },
    { key: "Escape", description: "Close modals and menus" },
    { key: "Ctrl + +", description: "Zoom in" },
    { key: "Ctrl + -", description: "Zoom out" },
    { key: "Ctrl + 0", description: "Reset zoom" },
    { key: "Ctrl + V", description: "Start/Stop voice recording" },
  ];

  return (
    <main className="min-h-screen" role="main">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Accessibility Features
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We are committed to making our website accessible to everyone. Use
            the controls below to customize your experience.
          </p>
        </div>
      </section>

      {/* Quick Access Controls */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Access Controls</h2>
            <p className="text-lg text-gray-600">
              Customize your browsing experience with these accessibility tools
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Font Size Control */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Font Size: {fontSize}px
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleFontSizeChange(Math.max(12, fontSize - 2))
                    }
                    className="flex-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                    aria-label="Decrease font size"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => handleFontSizeChange(16)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
                    aria-label="Reset font size"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() =>
                      handleFontSizeChange(Math.min(32, fontSize + 2))
                    }
                    className="flex-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                    aria-label="Increase font size"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* High Contrast Toggle */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">High Contrast</h3>
                <button
                  onClick={handleHighContrastToggle}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    highContrast
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-pressed={highContrast}
                >
                  {highContrast ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Reduced Motion</h3>
                <button
                  onClick={handleReducedMotionToggle}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    reducedMotion
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-pressed={reducedMotion}
                >
                  {reducedMotion ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* Screen Reader Toggle */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Screen Reader Mode
                </h3>
                <button
                  onClick={handleScreenReaderToggle}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    screenReader
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-pressed={screenReader}
                >
                  {screenReader ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>

            {/* Voice-to-Text Control */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🎤</span>
                Voice-to-Text Assistant
              </h3>
              <p className="text-gray-600 mb-4">
                Use your voice to fill forms and navigate. Perfect for
                appointment booking and other text input.
              </p>

              {!voiceSupported ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    Voice recognition is not supported in your browser. Please
                    use Chrome, Edge, or Safari for this feature.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Recording Controls */}
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={
                        isRecording ? stopVoiceRecording : startVoiceRecording
                      }
                      className={`flex items-center px-6 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${
                        isRecording
                          ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      disabled={!voiceSupported}
                      aria-label={
                        isRecording ? "Stop recording" : "Start recording"
                      }
                    >
                      <span className="mr-2">{isRecording ? "⏹️" : "🎤"}</span>
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </button>

                    {isListening && (
                      <div className="flex items-center text-blue-600">
                        <div className="animate-pulse mr-2">🔴</div>
                        Listening...
                      </div>
                    )}
                  </div>

                  {/* Transcribed Text Display */}
                  {transcribedText && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Transcribed Text:</h4>
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
                      </div>
                      <div className="bg-gray-50 border rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {transcribedText}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        💡 Tip: You can copy this text and paste it into forms
                        like appointment booking.
                      </p>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      How to use:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Click "Start Recording" and speak clearly</li>
                      <li>
                        • Say appointment details like "I need an appointment
                        for next Tuesday at 2 PM"
                      </li>
                      <li>• Click "Stop Recording" when finished</li>
                      <li>• Copy the text and paste it into forms</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Controls */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Line Spacing: {lineSpacing}
                </h3>
                <input
                  type="range"
                  min="1.2"
                  max="2.5"
                  step="0.1"
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(parseFloat(e.target.value))}
                  className="w-full"
                  aria-label="Adjust line spacing"
                />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Focus Indicators</h3>
                <button
                  onClick={() => setFocusIndicator(!focusIndicator)}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    focusIndicator
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-pressed={focusIndicator}
                >
                  {focusIndicator ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Available Features</h2>
            <p className="text-lg text-gray-600">
              Explore all the accessibility features we offer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accessibilityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {feature.description}
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    feature.status === "Enabled"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {feature.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Keyboard Shortcuts</h2>
            <p className="text-lg text-gray-600">
              Navigate efficiently using these keyboard shortcuts
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {keyboardShortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <kbd className="px-3 py-2 bg-gray-200 rounded text-sm font-mono">
                    {shortcut.key}
                  </kbd>
                  <span className="text-gray-600">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Statement */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">
              Accessibility Statement
            </h2>
            <p className="text-lg text-blue-800">
              Our commitment to digital accessibility
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                We are committed to ensuring digital accessibility for people
                with disabilities. We are continually improving the user
                experience for everyone and applying the relevant accessibility
                standards.
              </p>
              <p className="mb-4">
                This website conforms to the Web Content Accessibility
                Guidelines (WCAG) 2.1 Level AA standards. These guidelines
                explain how to make web content more accessible for people with
                disabilities and more user-friendly for everyone.
              </p>
              <p>
                If you experience any accessibility issues or have suggestions
                for improvement, please contact us at{" "}
                <a
                  href="mailto:accessibility@medicare.com"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  accessibility@medicare.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-lg text-gray-600">
              Contact our accessibility team for assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Contact Our Accessibility Team
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center">
                  <span className="mr-3">📧</span>
                  Email: accessibility@medicare.com
                </p>
                <p className="flex items-center">
                  <span className="mr-3">📞</span>
                  Phone: 1-800-ACCESS (1-800-222-3777)
                </p>
                <p className="flex items-center">
                  <span className="mr-3">🕒</span>
                  Hours: Monday - Friday, 9 AM - 5 PM EST
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Additional Resources
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="mr-3">•</span>
                  <a href="#" className="underline hover:text-blue-600">
                    Accessibility Guidelines
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">•</span>
                  <a href="#" className="underline hover:text-blue-600">
                    Screen Reader Setup
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">•</span>
                  <a href="#" className="underline hover:text-blue-600">
                    Keyboard Navigation Guide
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">•</span>
                  <a href="#" className="underline hover:text-blue-600">
                    Feedback Form
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Screen reader only content */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Accessibility page loaded. Use the controls to customize your
        experience.
      </div>
    </main>
  );
};

export default AccessibilityPage;
