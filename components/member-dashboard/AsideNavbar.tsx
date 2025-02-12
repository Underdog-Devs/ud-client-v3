import { Button, ButtonGroup, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import styles from './AsideNavbar.module.scss';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

async function getUserEmail() {
    const supabase = createClientComponentClient();

    const { data: { user } } = await supabase.auth.getUser();

    return user?.email;
}

const AsideNavbar = ({ width }: { width: number }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        getUserEmail().then((email) => {
            setUserEmail(email || '');
        });
    }, []);

    const isActive = (path: string) => pathname?.includes(path);

    return (
        <aside className={styles.asideContainer} style={{ width: width }}>
            <Box className={styles.asideNavbar}>
                <ButtonGroup orientation="vertical" aria-label="navigation links" sx={{ gap: 1, height: '100%'}}>
                <Button 
                    className={`${styles.asideNavbarButton} ${isActive('main') ? styles.active : ''}`}
                    onClick={() => {
                        router.push('/member-dashboard');
                    }}
                    variant="text"
                >
                    Dashboard
                </Button>
                
                <Button 
                    className={`${styles.asideNavbarButton} ${isActive('onboarding') ? styles.active : ''}`}
                    onClick={() => {
                        router.push('/member-dashboard/onboarding');
                    }}
                    variant="text"
                >
                    Onboarding
                </Button>
                <Button 
                    className={`${styles.asideNavbarButton} ${isActive('profile') ? styles.active : ''}`}
                    onClick={() => {
                        router.push('/member-dashboard/profile');
                    }}
                    variant="text"
                >
                    Profile
                </Button>
                <Button 
                    className={`${styles.asideNavbarButton} ${isActive('docs') ? styles.active : ''}`}
                    onClick={() => {
                        router.push('/member-dashboard/docs');
                    }}
                    variant="text"
                    >
                    Docs
                </Button>
                </ButtonGroup>
            </Box>
            <Typography 
                variant="body2" 
                color="text.secondary"
                className={styles.userEmail}
            >
                {userEmail}
            </Typography>
        </aside>
    );
};

export default AsideNavbar;