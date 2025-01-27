'use client'
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import AsideNavbar from './member-dashboard/AsideNavbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
                router.push('/login');
            }
        };

        checkAuth();
    }, [supabase, router]);

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