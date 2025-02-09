import { Button, ButtonGroup } from '@mui/material';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import styles from './AsideNavbar.module.scss';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const AsideNavbar = ({ width }: { width: number }) => {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const pathname = usePathname();

    const isActive = (path: string) => pathname?.includes(path);

    return (
        <aside className={styles.asideContainer} style={{ width: width }}>
            <Box className={styles.asideNavbar}>
                <ButtonGroup orientation="vertical" aria-label="navigation links" sx={{ gap: 1}}>
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
            <Box className={styles.asideLogOut}>
                <Button 
                    fullWidth 
                    onClick={() => {
                        supabase.auth.signOut();
                        window.location.href = '/';
                    }}
                    variant="text"
                >
                    Log Out
                </Button>
            </Box>
        </aside>
    );
};

export default AsideNavbar;