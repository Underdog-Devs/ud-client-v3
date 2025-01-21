import React from 'react';
import { Box } from '@mui/material';
import AsideNavbar from './member-dashboard/AsideNavbar';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const WIDTH = 200;
    
    return (
        <Box sx={{ display: 'flex' }}>
            <AsideNavbar width={WIDTH} />
            <main style={{ marginTop: '0px', padding: '2rem', flexGrow: 1, marginLeft: `${WIDTH}px` }}>
                {children}
            </main>
        </Box>
    );
};

export default DashboardLayout;