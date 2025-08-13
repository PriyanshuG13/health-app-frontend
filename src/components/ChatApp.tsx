import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Send, Person, SmartToy } from '@mui/icons-material';
import { api } from '../lib/api/client';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function ChatApp() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await api.post<{ response: string }>('/api/v1/ai/chat', {
                message: userMessage.content,
                history: messages.map(m => ({ role: m.role, content: m.content })),
            });

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {messages.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <SmartToy sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                Start a conversation with AI
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ask questions about medical topics, patient care, or get assistance
                                with your healthcare tasks.
                            </Typography>
                        </Box>
                    )}

                    {messages.map(message => (
                        <Box
                            key={message.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            {message.role === 'assistant' && (
                                <SmartToy sx={{ color: 'primary.main', mt: 0.5 }} />
                            )}
                            <Paper
                                sx={{
                                    p: 2,
                                    maxWidth: '70%',
                                    bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                                    color: message.role === 'user' ? 'white' : 'text.primary',
                                }}
                            >
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {message.content}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        mt: 1,
                                        opacity: 0.8,
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {message.timestamp.toLocaleTimeString()}
                                </Typography>
                            </Paper>
                            {message.role === 'user' && (
                                <Person sx={{ color: 'text.secondary', mt: 0.5 }} />
                            )}
                        </Box>
                    ))}

                    {loading && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SmartToy sx={{ color: 'primary.main' }} />
                            <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2" sx={{ ml: 1, display: 'inline' }}>
                                    AI is thinking...
                                </Typography>
                            </Paper>
                        </Box>
                    )}

                    <div ref={messagesEndRef} />
                </Box>

                {error && (
                    <Alert severity="error" sx={{ m: 2, mb: 0 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={3}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message... (Press Enter to send)"
                            disabled={loading}
                            variant="outlined"
                            size="small"
                        />
                        <Button
                            variant="contained"
                            onClick={handleSendMessage}
                            disabled={!input.trim() || loading}
                            sx={{ minWidth: 'auto', px: 2 }}
                        >
                            <Send />
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
