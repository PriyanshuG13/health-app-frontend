import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { GlobalTopBar } from './components/GlobalTopBar';
import { RouteGuard } from './components/RouteGuard';
import { Home } from './routes/Home';
import { Chat } from './routes/Chat';
import { Patients } from './routes/Patients';
import { Recording } from './routes/Recording';
import { SignIn } from './routes/SignIn';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <GlobalTopBar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route 
          path="/chat" 
          element={
            <RouteGuard requireAuth={true}>
              <Chat />
            </RouteGuard>
          } 
        />
        
        <Route 
          path="/patients" 
          element={
            <RouteGuard requireAuth={true} requireDrchrono={true}>
              <Patients />
            </RouteGuard>
          } 
        />
        
        <Route 
          path="/recording" 
          element={
            <RouteGuard requireAuth={true}>
              <Recording />
            </RouteGuard>
          } 
        />
        
        <Route path="/auth/signin" element={<SignIn />} />
      </Routes>
    </Box>
  );
}

export default App;