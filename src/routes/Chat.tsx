import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { ChatApp } from '../components/ChatApp';

export function Chat() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Chat Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get instant help with medical questions, patient care guidance, and healthcare insights.
        </Typography>
      </Box>
      
      <ChatApp />
    </Container>
  );
}