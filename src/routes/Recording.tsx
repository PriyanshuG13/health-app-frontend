import React, { useState, useRef, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Alert,
    CircularProgress,
    LinearProgress,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import { Mic, Stop, PlayArrow, Pause, Upload, Description, VolumeUp } from '@mui/icons-material';
import { api } from '../lib/api';

interface RecordingState {
    isRecording: boolean;
    isPlaying: boolean;
    audioBlob: Blob | null;
    audioUrl: string | null;
    transcription: string | null;
}

export function Recording() {
    const [state, setState] = useState<RecordingState>({
        isRecording: false,
        isPlaying: false,
        audioBlob: null,
        audioUrl: null,
        transcription: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);

                setState(prev => ({
                    ...prev,
                    audioBlob: blob,
                    audioUrl: url,
                    isRecording: false,
                }));

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setState(prev => ({ ...prev, isRecording: true }));
        } catch (err) {
            setError('Failed to access microphone. Please check permissions.');
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    }, []);

    const playAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play();
            setState(prev => ({ ...prev, isPlaying: true }));
        }
    }, []);

    const pauseAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setState(prev => ({ ...prev, isPlaying: false }));
        }
    }, []);

    const uploadAndTranscribe = useCallback(async () => {
        if (!state.audioBlob) return;

        try {
            setLoading(true);
            setError(null);
            setUploadProgress(0);

            // Convert to WAV 16kHz (simplified - in production you'd use a proper audio processing library)
            const audioFile = new File([state.audioBlob], 'recording.wav', { type: 'audio/wav' });

            // Upload file
            setUploadProgress(25);
            const uploadResponse = await api.uploadFile<{ blobUrl: string }>(
                '/api/v1/upload/audio/file',
                audioFile
            );

            setUploadProgress(50);

            // Transcribe
            const transcriptionResponse = await api.post<{ text: string }>(
                '/api/v1/audio/transcribe',
                { url: uploadResponse.blobUrl }
            );

            setUploadProgress(100);
            setState(prev => ({ ...prev, transcription: transcriptionResponse.text }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to transcribe audio');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    }, [state.audioBlob]);

    const reset = useCallback(() => {
        if (state.audioUrl) {
            URL.revokeObjectURL(state.audioUrl);
        }
        setState({
            isRecording: false,
            isPlaying: false,
            audioBlob: null,
            audioUrl: null,
            transcription: null,
        });
        setError(null);
    }, [state.audioUrl]);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Audio Recording & Transcription
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Record patient notes and convert them to text using AI-powered transcription.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <Mic /> Recording Control
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        {!state.isRecording ? (
                            <Button
                                variant="contained"
                                startIcon={<Mic />}
                                onClick={startRecording}
                                disabled={loading}
                                color="error"
                            >
                                Start Recording
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                startIcon={<Stop />}
                                onClick={stopRecording}
                                color="primary"
                            >
                                Stop Recording
                            </Button>
                        )}

                        {state.audioUrl && (
                            <>
                                {!state.isPlaying ? (
                                    <Button
                                        variant="outlined"
                                        startIcon={<PlayArrow />}
                                        onClick={playAudio}
                                        disabled={loading}
                                    >
                                        Play
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        startIcon={<Pause />}
                                        onClick={pauseAudio}
                                    >
                                        Pause
                                    </Button>
                                )}

                                <Button
                                    variant="outlined"
                                    startIcon={<Upload />}
                                    onClick={uploadAndTranscribe}
                                    disabled={loading}
                                >
                                    Transcribe
                                </Button>

                                <Button variant="text" onClick={reset} disabled={loading}>
                                    Reset
                                </Button>
                            </>
                        )}
                    </Box>

                    {state.isRecording && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <VolumeUp sx={{ color: 'error.main' }} />
                            <Typography variant="body2" color="error.main">
                                Recording in progress...
                            </Typography>
                            <Box sx={{ width: 20, height: 20 }}>
                                <CircularProgress size={16} color="error" />
                            </Box>
                        </Box>
                    )}

                    {loading && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" gutterBottom>
                                Processing audio...
                            </Typography>
                            <LinearProgress variant="determinate" value={uploadProgress} />
                        </Box>
                    )}

                    {state.audioUrl && (
                        <audio
                            ref={audioRef}
                            src={state.audioUrl}
                            onEnded={() => setState(prev => ({ ...prev, isPlaying: false }))}
                            style={{ display: 'none' }}
                        />
                    )}
                </CardContent>
            </Card>

            {state.transcription && (
                <Card>
                    <CardContent>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                            <Description /> Transcription Result
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {state.transcription}
                            </Typography>
                        </Paper>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}
