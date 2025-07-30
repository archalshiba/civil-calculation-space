import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useI18n } from '../../contexts/I18nContext';
import { useToaster } from '../../contexts/ToasterContext';
import { PaperAirplaneIcon, UserCircleIcon, LogoIcon, SpinnerIcon } from '../icons/Icons';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const HelpAssistant: React.FC = () => {
    const { t } = useI18n();
    const toaster = useToaster();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const systemInstruction = "You are a helpful civil engineering assistant for the 'Civil Calculation World' app. Your defining trait is providing smart and short answers. All responses must be concise and to the point. Do not exceed three sentences. Omit all conversational filler like 'Of course!' or 'Certainly!'. If asked about the app, be helpful. If asked a civil engineering question, provide a clear, simple explanation. Your goal is maximum information in minimum words.";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;
        
        const newMessages: Message[] = [...messages, { sender: 'user', text: prompt }];
        setMessages(newMessages);
        const currentPrompt = prompt;
        setPrompt('');
        setIsLoading(true);

        if (!process.env.API_KEY) {
            toaster.showError("API key is not configured.");
            setIsLoading(false);
            setMessages([...newMessages, { sender: 'ai', text: "Sorry, the AI Assistant is not configured correctly. An API Key is missing." }]);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: currentPrompt,
                config: { systemInstruction },
            });

            const aiText = response.text;
            setMessages([...newMessages, { sender: 'ai', text: aiText }]);
        } catch (error) {
            console.error("Help Assistant Error:", error);
            const errorMessage = t('aiAssistant.failure');
            toaster.showError(errorMessage);
            setMessages([...newMessages, { sender: 'ai', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[60vh] max-h-[700px]">
            <header className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary text-center">{t('help.assistant.title')}</h2>
            </header>

            <div className="flex-grow p-4 overflow-y-auto space-y-6">
                {messages.length === 0 && (
                     <div className="text-center text-text-secondary mt-8">
                        <LogoIcon className="h-12 w-12 mx-auto text-text-secondary/50" />
                        <p className="mt-2 text-sm">{t('help.assistant.placeholder')}</p>
                    </div>
                )}
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                        {message.sender === 'ai' && <LogoIcon className="h-8 w-8 text-accent flex-shrink-0 mt-1" />}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 text-sm shadow-sm ${
                            message.sender === 'user' 
                            ? 'bg-accent text-white rounded-br-none' 
                            : 'bg-surface-tertiary text-text-primary rounded-bl-none'
                        }`}>
                            <p className="leading-relaxed">{message.text}</p>
                        </div>
                         {message.sender === 'user' && <UserCircleIcon className="h-8 w-8 text-text-secondary flex-shrink-0 mt-1" />}
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center space-x-2 border-t border-border p-3 bg-surface/50">
                <input 
                    type="text" 
                    className="flex-grow bg-surface-secondary/50 border border-border rounded-full py-2 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-colors disabled:opacity-50"
                    placeholder={t('help.assistant.placeholder')}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    aria-label="Ask the AI assistant"
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="bg-accent text-white rounded-full p-3 flex-shrink-0 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-accent transition-all"
                    aria-label={t('help.assistant.sendButton')}
                >
                    {isLoading ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : <PaperAirplaneIcon className="h-5 w-5" />}
                </button>
            </form>
        </div>
    );
};

export default HelpAssistant;
