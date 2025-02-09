'use client'
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import AsideNavbar from './member-dashboard/AsideNavbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './dashboardLayout.module.scss';
import Navigation from './parts/navigation/Navigation';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();
    const WIDTH = 200;
    const NAV_HEIGHT = 64; // Высота навигации

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setIsAuthenticated(true);
            } else {
                router.push('/signin');
            }
        };

        checkAuth();
    }, [supabase, router]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Box sx={{ display: 'flex', flex: 1, mt: `${NAV_HEIGHT}px` }}>
                <AsideNavbar width={WIDTH} />
                <main style={{ 
                    marginTop: '0px', 
                    flexGrow: 1, 
                    marginLeft: `${WIDTH}px`,
                }}>
                    <Box className={styles.container}>
                        {children}
                    </Box>
                </main>
            </Box>
        </Box>
    );
};

export default DashboardLayout;