import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    IconButton,
    TableSortLabel,
    TablePagination,
} from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
    type SortingState,
} from '@tanstack/react-table';
import { api } from '../lib/api';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    email: string;
    lastVisit: string;
    status: 'Active' | 'Inactive' | 'Pending';
}

const columnHelper = createColumnHelper<Patient>();

const columns = [
    columnHelper.accessor('lastName', {
        header: 'Last Name',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('firstName', {
        header: 'First Name',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('dateOfBirth', {
        header: 'Date of Birth',
        cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('phone', {
        header: 'Phone',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('lastVisit', {
        header: 'Last Visit',
        cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
            const status = info.getValue();
            return (
                <Chip
                    label={status}
                    color={
                        status === 'Active'
                            ? 'success'
                            : status === 'Inactive'
                              ? 'error'
                              : 'warning'
                    }
                    size="small"
                />
            );
        },
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: () => (
            <IconButton size="small" color="primary">
                <Visibility />
            </IconButton>
        ),
    }),
];

export function PatientsTable() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get<Patient[]>('/api/v1/patients');
                setPatients(response);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch patients');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const table = useReactTable({
        data: patients,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" component="h2">
                    Patients
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <TextField
                    size="small"
                    placeholder="Search patients..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{ minWidth: 300 }}
                />
            </Box>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableCell key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        cursor: header.column.getCanSort()
                                                            ? 'pointer'
                                                            : 'default',
                                                    }}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <TableSortLabel
                                                            active={!!header.column.getIsSorted()}
                                                            direction={
                                                                header.column.getIsSorted() ||
                                                                undefined
                                                            }
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} hover>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={table.getFilteredRowModel().rows.length}
                    rowsPerPage={table.getState().pagination.pageSize}
                    page={table.getState().pagination.pageIndex}
                    onPageChange={(_, page) => table.setPageIndex(page)}
                    onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </Paper>
        </Box>
    );
}
