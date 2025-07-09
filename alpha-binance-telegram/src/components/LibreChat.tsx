import React, { useState, useRef, useEffect } from 'react';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

interface LibreChatProps {
    isOpen: boolean;
    onToggle: () => void;
}

const DEFAULT_MODEL = 'gemini-1.5-flash';
const MODELS = [
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
];

const LibreChat: React.FC<LibreChatProps> = ({ isOpen, onToggle }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Xin chào, ta là Gia Cát Lượng, muốn hỏi gì hỏi đi?',
            role: 'assistant',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setTimeout(() => {
                inputRef.current && inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            role: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const chatMessages = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));

            // Call Gemini API directly from frontend
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: chatMessages.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    })),
                    generationConfig: {
                        maxOutputTokens: 1000,
                        temperature: 0.7,
                    },
                })
            });

            if (!response.ok) throw new Error('Gemini API request failed');
            const data = await response.json();
            const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Muốn hỏi gì thì nạp tiền vào donate cho ta.';

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: aiContent,
                role: 'assistant',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat API Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Muốn hỏi gì thì nạp tiền vào donate cho ta.',
                role: 'assistant',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) {
        // Inline button for header
        return (
            <button
                onClick={onToggle}
                className="ai-chat-fab ai-chat-fab-inline"
                title="Open AI Chat"
                type="button"
                style={{ position: 'static', marginLeft: 8 }}
            >
                <span className="ai-chat-fab-icon">🤖</span>
                <span className="ai-chat-fab-label">AI Chat</span>
            </button>
        );
    }

    // Fixed chat container as before
    return (
        <div className="ai-chat-container">
            {/* Header */}
            <div className="ai-chat-header">
                <div className="ai-chat-header-title">
                    <span className="ai-chat-header-icon">🤖</span>
                    <span className="ai-chat-header-text">Mr.Gia cát</span>
                </div>
                <div className="ai-chat-header-actions" style={{ gap: 8 }}>
                    <select
                        className="ai-chat-model-select"
                        value={selectedModel}
                        onChange={e => setSelectedModel(e.target.value)}
                        disabled={isLoading}
                        style={{ borderRadius: 6, padding: '0.2rem 0.5rem', fontSize: '0.95rem', marginRight: 8 }}
                        title="Choose AI Model"
                    >
                        {MODELS.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={onToggle}
                        className="ai-chat-header-btn ai-chat-header-minimize"
                        title="Minimize"
                    >
                        <span>−</span>
                    </button>
                    <button
                        onClick={onToggle}
                        className="ai-chat-header-btn ai-chat-header-close"
                        title="Close"
                    >
                        <span>×</span>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="ai-chat-messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`ai-chat-message-row ${message.role === 'user' ? 'ai-chat-message-user' : 'ai-chat-message-assistant'}`}
                    >
                        <div className={`ai-chat-message-bubble ${message.role === 'user' ? 'ai-chat-message-bubble-user' : 'ai-chat-message-bubble-assistant'}`}>
                            <div className="ai-chat-message-content">
                                {message.role === 'assistant' && (
                                    <span className="ai-chat-message-icon">🤖</span>
                                )}
                                <span className="ai-chat-message-text">{message.content}</span>
                                {message.role === 'user' && (
                                    <span className="ai-chat-message-icon">👤</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="ai-chat-message-row ai-chat-message-assistant">
                        <div className="ai-chat-message-bubble ai-chat-message-bubble-assistant">
                            <div className="ai-chat-message-content">
                                <span className="ai-chat-message-icon">🤖</span>
                                <span className="ai-chat-message-typing">
                                    <span className="ai-chat-dot" />
                                    <span className="ai-chat-dot" />
                                    <span className="ai-chat-dot" />
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="ai-chat-input-bar">
                <form className="ai-chat-input-form" onSubmit={e => { e.preventDefault(); handleSendMessage(); }}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isLoading ? 'Chờ xíu...' : 'Hỏi bất kỳ thứ gì...'}
                        className="ai-chat-input"
                        disabled={isLoading}
                        autoFocus
                        inputMode="text"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="ai-chat-send-btn"
                    >
                        <span>📤</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LibreChat; 