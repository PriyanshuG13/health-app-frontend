import React from 'react';
import { Container } from '@mui/material';
import { PatientsTable } from '../components/PatientsTable';

export function Patients() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <PatientsTable />
        </Container>
    );
}
