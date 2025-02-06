'use client'
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import AsideNavbar from './member-dashboard/AsideNavbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './dashboardLayout.module.scss';
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();
    const WIDTH = 200;

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
        <Box sx={{ display: 'flex' }}>
            <AsideNavbar width={WIDTH} />
            <main style={{ marginTop: '0px', flexGrow: 1, marginLeft: `${WIDTH}px` }}>
                <Box className={styles.container}>
                    {children}
                </Box>
            </main>
        </Box>
    );
};

export default DashboardLayout;