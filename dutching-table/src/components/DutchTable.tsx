import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Box,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { DutchBetOpportunity } from '../types/DutchBetOpportunity';
import { Chip } from '@mui/material';
import { sampleOpportunities } from '../data/sampleOpportunities';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import React, { useState, useEffect } from 'react';
import { testData } from '../data/testData';  // ← import here

dayjs.extend(relativeTime);



export function DutchTable() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [data, setData] = useState<DutchBetOpportunity[]>([]);
  const [search, setSearch] = useState('');
  const [userEmail, setUserEmail] = useState<string>('john@example.com'); // mock login
  const [isDarkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  //  Make sure this is defined BEFORE useEffect and button
  const loadData = async () => {
    const result = await fetchDutchingOpportunities();
    setData(result);
  };

  
  //useEffect(() => {
   // loadData();
  //}, []);
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setDarkMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
    }
  };



    return (
      <Box>
        <AppBar position="static" color="default">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <img src="/public/logo.png" alt="Logo" style={{ height: 40 }} />
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1">{userEmail}</Typography>
              <AccountCircle />
              <IconButton color="inherit" onClick={toggleTheme}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box p={isMobile ? 1 : 3}>
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isMobile ? 'stretch' : 'center'}
            mb={2}
            gap={2}
          >
            <TextField
              label="Search by Market"
              variant="outlined"
              size="small"
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth={isMobile}
            />
            <Button
              variant="contained"
              onClick={loadData}
              style={{ backgroundColor: 'black', color: 'lightgreen' }}
            >
              Refresh
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table size={isMobile ? 'small' : 'medium'}>
    <TableHead>
      <TableRow style={{ backgroundColor: '#444' }}>
        <TableCell style={{ color: '#fff' }}>EVENT</TableCell>
        <TableCell style={{ color: '#fff' }}>TIME</TableCell>
        <TableCell style={{ color: '#fff' }}>BOOKIE 1</TableCell>
        <TableCell style={{ color: '#fff' }}>ODDS 1</TableCell>
        <TableCell style={{ color: '#fff' }}>MARKET SELECTION</TableCell>
        <TableCell style={{ color: '#fff' }}>BOOKIE 2</TableCell>
        <TableCell style={{ color: '#fff' }}>ODDS 2</TableCell>
        <TableCell style={{ color: '#fff' }}>MARKET SELECTION 2</TableCell>
        <TableCell style={{ color: '#fff' }}>PL</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {data.map((item) => {
        const [odd1, odd2] = item.combinations;
        const teamNames = item.combinations
          .filter(c => c.selection.type === 'team')
          .map(c => c.selection.standardizedName)
          .slice(0, 2)
          .join(' vs ');
        const time = dayjs(item.combinations[0].timestamp).format('HH:mm');

                  return (
                    <Box p={isMobile ? 1 : 3}>
                      <TableContainer component={Paper}>
                        <Table size={isMobile ? 'small' : 'medium'}>
                          <TableHead>
                            <TableRow>
                              <TableCell>EVENT</TableCell>
                              <TableCell>TIME</TableCell>
                              <TableCell>BOOKIE 1</TableCell>
                              <TableCell>ODDS 1</TableCell>
                              <TableCell>MARKET SELECTION 1</TableCell>
                              <TableCell>BOOKIE 2</TableCell>
                              <TableCell>ODDS 2</TableCell>
                              <TableCell>MARKET SELECTION 2</TableCell>
                              <TableCell>PL</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data.map((row, index) => (
                              <TableRow key={row.eventId}>
                                <TableCell>
                                  {row.combinations[0]?.selection.standardizedName} vs {row.combinations[1]?.selection.standardizedName}
                                </TableCell>
                                <TableCell>1800HRS</TableCell>
                                <TableCell>
                                  <Chip label={row.combinations[0]?.bookmaker} color="primary" />
                                </TableCell>
                                <TableCell>{row.combinations[0]?.odds}</TableCell>
                                <TableCell>{row.combinations[0]?.selection.rawName}</TableCell>
                                <TableCell>
                                  <Chip label={row.combinations[1]?.bookmaker} color="secondary" />
                                </TableCell>
                                <TableCell>{row.combinations[1]?.odds}</TableCell>
                                <TableCell>{row.combinations[1]?.selection.rawName}</TableCell>
                                <TableCell>
                                  <Chip label="PROFIT" color="success" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  );
                })}
              </TableBody>  
            </Table>
          </TableContainer>
          {data.length === 0 && (
            <Typography variant="subtitle1" align="center" mt={2}>
              No opportunities found
            </Typography>
        )}  
      </Box>
    </Box>
  );
}

