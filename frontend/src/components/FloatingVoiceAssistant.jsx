import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    X,
    Send,
    Sparkles,
    RotateCcw,
    Minus,
    Compass,
    AlertCircle,
    Square
} from 'lucide-react';
import { askVoiceAssistant } from '../api';

const QUICK_PROMPTS = [
    "🌴 Best beach in Mirissa?",
    "🚂 Ella to Kandy train tips?",
    "🍛 Must-try Sri Lankan foods?",
    "🦁 Best safari for elephants?",
];

const FloatingVoiceAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: "Ayubowan! 🇱🇰 I'm CeylonVoice, your AI travel companion for Sri Lanka. Ask me anything about attractions, trains, local food, or cultural tips!",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const [isThinking, setIsThinking] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [speechSupported, setSpeechSupported] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [availableVoices, setAvailableVoices] = useState([]);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const errorTimeoutRef = useRef(null);

    const showError = (msg) => {
        setErrorMessage(msg);
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = setTimeout(() => {
            setErrorMessage('');
        }, 6000);
    };

    // Load available speech synthesis voices
    useEffect(() => {
        if (!('speechSynthesis' in window)) {
            setSpeechSupported(false);
        } else {
            const updateVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                if (voices && voices.length > 0) {
                    setAvailableVoices(voices);
                }
            };
            updateVoices();
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }

        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            stopRecordingMedia();
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        };
    }, []);

    // Auto scroll to bottom of messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isThinking, isRecording]);

    // Handle Speech Synthesis (Text-to-Speech)
    const speakText = (text) => {
        if (!('speechSynthesis' in window) || isMuted || !text) {
            return;
        }

        try {
            window.speechSynthesis.cancel(); // Stop previous utterance

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.lang = 'en-US';

            // Pick preferred natural English voice
            const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(
                (v) => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Female'))
            ) || voices.find((v) => v.lang.includes('en'));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = (e) => {
                console.warn('SpeechSynthesis error:', e);
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
        } catch (err) {
            console.error('Speech synthesis error:', err);
            setIsSpeaking(false);
        }
    };

    // Stop current speech playback
    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
    };

    // Toggle Mute
    const toggleMute = () => {
        if (!isMuted && isSpeaking) {
            stopSpeaking();
        }
        setIsMuted(!isMuted);
    };

    // Stop recording stream & cleanup
    const stopRecordingMedia = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            try {
                mediaRecorderRef.current.stop();
            } catch (e) {
                // ignore
            }
        }
        if (streamRef.current) {
            try {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            } catch (e) {
                // ignore
            }
        }
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        setIsRecording(false);
        setRecordingSeconds(0);
    };

    // Start voice recording with MediaRecorder
    const startRecording = async () => {
        if (isSpeaking) {
            stopSpeaking();
        }
        setErrorMessage('');

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showError("Audio recording is not supported in this browser environment. You can type below!");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                ? 'audio/webm'
                : MediaRecorder.isTypeSupported('audio/mp4')
                    ? 'audio/mp4'
                    : 'audio/wav';

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                if (audioBlob.size > 200) {
                    await handleSendAudio(audioBlob, mimeType);
                }
                // Cleanup stream
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(t => t.stop());
                    streamRef.current = null;
                }
            };

            mediaRecorder.start(200); // Collect data chunks every 200ms
            setIsRecording(true);
            setRecordingSeconds(0);

            // Start recording timer
            timerIntervalRef.current = setInterval(() => {
                setRecordingSeconds(prev => {
                    if (prev >= 25) { // Auto stop after 25s
                        stopRecordingMedia();
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (err) {
            console.error("Microphone access error:", err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                showError("Microphone permission denied. Click the lock/settings icon next to the URL to allow microphone access.");
            } else if (err.name === 'NotFoundError') {
                showError("No microphone found on your device.");
            } else {
                showError("Could not access microphone. Please type your question below.");
            }
            setIsRecording(false);
        }
    };

    // Convert blob to base64 & send to Gemini backend
    const handleSendAudio = async (audioBlob, mimeType) => {
        setHasInteracted(true);
        setErrorMessage('');
        setIsThinking(true);

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: "🎙️ [Spoken Voice Question]",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);

        try {
            // Convert Blob to base64 string
            const reader = new FileReader();
            const base64Promise = new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    const base64Data = reader.result.split(',')[1];
                    resolve(base64Data);
                };
                reader.onerror = reject;
            });
            reader.readAsDataURL(audioBlob);
            const base64Audio = await base64Promise;

            const historyContext = updatedMessages.slice(-5).map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await askVoiceAssistant({
                audio: base64Audio,
                mimeType: mimeType || 'audio/webm',
                history: historyContext
            });

            const replyText = res.data?.reply || "I'm happy to help you explore Sri Lanka! What else would you like to know?";

            const assistantMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: replyText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages((prev) => [...prev, assistantMsg]);
            setIsThinking(false);
            speakText(replyText);
        } catch (err) {
            console.error("Audio processing error:", err);
            setIsThinking(false);
            const fallbackMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: "Ayubowan! I heard your question. Sri Lanka is filled with wonderful destinations — please ask again or type below!",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, fallbackMsg]);
            speakText(fallbackMsg.content);
        }
    };

    // Send typed message to backend Gemini assistant
    const handleSendMessage = async (textToSend) => {
        const query = (textToSend || inputText).trim();
        if (!query || isThinking) return;

        setHasInteracted(true);
        setInputText('');
        setErrorMessage('');

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: query,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setIsThinking(true);

        try {
            const historyContext = updatedMessages.slice(-5).map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await askVoiceAssistant(query, historyContext);
            const replyText = res.data?.reply || "I'm happy to help you explore Sri Lanka! What else would you like to know?";

            const assistantMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: replyText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages((prev) => [...prev, assistantMsg]);
            setIsThinking(false);
            speakText(replyText);
        } catch (error) {
            console.error("Voice Assistant request error:", error);
            const fallbackMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: "Ayubowan! I ran into a quick network hiccup. Sri Lanka has so much to discover — please try asking me again!",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, fallbackMsg]);
            setIsThinking(false);
            speakText(fallbackMsg.content);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        stopSpeaking();
        stopRecordingMedia();
        setErrorMessage('');
        setMessages([
            {
                id: Date.now(),
                role: 'assistant',
                content: "Ayubowan! 🇱🇰 Chat history cleared. How can I help you explore Sri Lanka today?",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Expanded Chat Card */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.92 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-[340px] sm:w-[360px] h-[530px] max-h-[82vh] mb-4 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden pointer-events-auto"
                        style={{
                            boxShadow: '0 20px 40px -15px rgba(13, 92, 83, 0.25), 0 0 15px rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white p-4 flex items-center justify-between shadow-md relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

                            <div className="flex items-center space-x-3 z-10">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/30 border border-emerald-300/40 flex items-center justify-center text-xl shadow-inner">
                                        🇱🇰
                                    </div>
                                    {/* Status Indicator Dot */}
                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-emerald-900 ${isRecording ? 'bg-red-500 animate-ping' : isSpeaking ? 'bg-cyan-400 animate-pulse' : isThinking ? 'bg-purple-400 animate-bounce' : 'bg-emerald-400'
                                        }`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-semibold text-sm tracking-wide text-white">CeylonVoice</h3>
                                        <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded-full font-medium border border-emerald-400/30">
                                            AI
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-emerald-100/80">
                                        {isRecording ? `🔴 Recording 0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}...` : isThinking ? '✨ Thinking...' : isSpeaking ? '🔊 Speaking...' : 'Online • Sri Lanka Expert'}
                                    </p>
                                </div>
                            </div>

                            {/* Action Controls */}
                            <div className="flex items-center space-x-1 z-10">
                                <button
                                    onClick={toggleMute}
                                    title={isMuted ? "Unmute voice response" : "Mute voice response"}
                                    className="p-1.5 rounded-full hover:bg-white/15 transition-colors text-emerald-100 hover:text-white"
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={clearChat}
                                    title="Clear conversation"
                                    className="p-1.5 rounded-full hover:bg-white/15 transition-colors text-emerald-100 hover:text-white"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => {
                                        stopRecordingMedia();
                                        stopSpeaking();
                                        setIsOpen(false);
                                    }}
                                    title="Minimize"
                                    className="p-1.5 rounded-full hover:bg-white/15 transition-colors text-emerald-100 hover:text-white"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Error / Alert Banner */}
                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-amber-50 border-b border-amber-200 px-3 py-2 flex items-start gap-2 text-[11px] text-amber-900 shadow-inner"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                                <div className="flex-1 leading-tight">{errorMessage}</div>
                                <button
                                    onClick={() => setErrorMessage('')}
                                    className="text-amber-600 hover:text-amber-800 font-bold text-xs"
                                >
                                    ✕
                                </button>
                            </motion.div>
                        )}

                        {/* Chat Messages Body */}
                        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 scroll-smooth bg-slate-50/50">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.role === 'user'
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1 px-1">
                                        <span className="text-[10px] text-slate-400">{msg.time}</span>
                                        {msg.role === 'assistant' && (
                                            <button
                                                onClick={() => speakText(msg.content)}
                                                className="text-slate-400 hover:text-emerald-700 transition-colors"
                                                title="Replay audio"
                                            >
                                                <Volume2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Thinking Indicator */}
                            {isThinking && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-slate-500 text-xs bg-white px-3 py-2 rounded-2xl rounded-tl-none border border-slate-100 w-fit shadow-sm"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                                    <span className="text-slate-600 font-medium">CeylonVoice is thinking...</span>
                                </motion.div>
                            )}

                            {/* Quick Suggestions (Shown before extensive interaction) */}
                            {!hasInteracted && messages.length <= 2 && (
                                <div className="pt-2">
                                    <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                                        <Compass className="w-3 h-3 text-emerald-600" />
                                        Quick Questions:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {QUICK_PROMPTS.map((prompt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSendMessage(prompt)}
                                                className="text-[11px] text-left bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2.5 py-1.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all shadow-xs"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Audio Wave & Status Visualizer (When Recording or Speaking) */}
                        <AnimatePresence>
                            {(isRecording || isSpeaking) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`border-t px-3 py-2 flex items-center justify-between transition-colors ${isRecording ? 'bg-red-50/90 border-red-200' : 'bg-emerald-50/90 border-emerald-100'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center gap-0.5 h-4">
                                            {[...Array(5)].map((_, i) => (
                                                <motion.span
                                                    key={i}
                                                    animate={{
                                                        height: isRecording ? [4, 18, 8, 16, 4] : [3, 12, 6, 10, 3],
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 0.6,
                                                        delay: i * 0.1,
                                                        ease: 'easeInOut',
                                                    }}
                                                    className={`w-1 rounded-full ${isRecording ? 'bg-red-600' : 'bg-teal-600'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className={`text-[11px] font-medium ${isRecording ? 'text-red-700' : 'text-emerald-800'}`}>
                                            {isRecording ? `Recording... Speak now (0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds})` : 'Playing voice response...'}
                                        </span>
                                    </div>

                                    {isSpeaking && (
                                        <button
                                            onClick={stopSpeaking}
                                            className="text-[11px] bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-0.5 rounded-md font-medium transition-colors"
                                        >
                                            Stop
                                        </button>
                                    )}

                                    {isRecording && (
                                        <button
                                            onClick={stopRecordingMedia}
                                            className="text-[11px] bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 shadow-xs"
                                        >
                                            <Square className="w-2.5 h-2.5 fill-current" />
                                            Done
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input Footer */}
                        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                            {/* Mic Action Button */}
                            <button
                                type="button"
                                onClick={isRecording ? stopRecordingMedia : startRecording}
                                className={`p-2.5 rounded-full transition-all flex items-center justify-center flex-shrink-0 shadow-sm ${isRecording
                                        ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    }`}
                                title={isRecording ? "Click to finish and send recording" : "Click to speak with voice"}
                            >
                                {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                            </button>

                            {/* Text Input */}
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={isRecording ? "Recording your voice... Click Done" : "Ask about Sri Lanka..."}
                                disabled={isThinking || isRecording}
                                className="flex-1 bg-slate-100 text-slate-800 placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none transition-all disabled:opacity-60"
                            />

                            {/* Send Button */}
                            <button
                                type="button"
                                onClick={() => handleSendMessage()}
                                disabled={!inputText.trim() || isThinking || isRecording}
                                className="p-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-40 disabled:hover:bg-emerald-700 transition-colors flex items-center justify-center flex-shrink-0 shadow-sm"
                                title="Send message"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Bubble Button */}
            <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="relative pointer-events-auto"
            >
                {/* Animated outer pulse rings when recording or speaking */}
                {(isRecording || isSpeaking) && (
                    <span className={`absolute inset-0 rounded-full animate-ping pointer-events-none ${isRecording ? 'bg-red-400/40' : 'bg-emerald-400/40'}`} />
                )}
                {(isRecording || isSpeaking) && (
                    <span className={`absolute -inset-1.5 rounded-full border-2 animate-pulse pointer-events-none ${isRecording ? 'border-red-500/60' : 'border-emerald-500/60'}`} />
                )}

                <button
                    onClick={() => {
                        if (isOpen) {
                            stopRecordingMedia();
                            stopSpeaking();
                        }
                        setIsOpen(!isOpen);
                    }}
                    className={`relative group flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${isOpen
                            ? 'bg-slate-800 text-white hover:bg-slate-900 ring-4 ring-slate-200'
                            : 'bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-600 text-white hover:shadow-emerald-900/30 hover:shadow-xl ring-4 ring-emerald-100'
                        }`}
                    aria-label="Toggle CeylonVoice AI Assistant"
                >
                    {isOpen ? (
                        <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
                    ) : (
                        <div className="relative flex items-center justify-center">
                            <Mic className="w-6 h-6 text-white" />
                            <span className="absolute -top-1.5 -right-1.5 text-[10px]">🇱🇰</span>
                        </div>
                    )}

                    {/* Tooltip on Hover when collapsed */}
                    {!isOpen && (
                        <div className="absolute right-16 px-3 py-1.5 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-medium rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Ask CeylonVoice AI 🎙️
                        </div>
                    )}
                </button>
            </motion.div>
        </div>
    );
};

export default FloatingVoiceAssistant;
