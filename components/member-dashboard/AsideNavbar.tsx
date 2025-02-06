import { Button } from '@mui/material';
import { Box } from '@mui/material';
import Link from 'next/link';
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
            <Box className={styles.asideLogo}>
                <Link href="/member-dashboard">
                    <img
                        src="/images/icon-02.png"
                        alt="Underdog Devs Logo"
                        style={{
                            width: '100px',
                            height: 'auto'
                        }}
                    />
                </Link>
            </Box>
            <Box className={styles.asideNavbar}>
                <Button 
                    className={`${styles.asideNavbarButton} ${isActive('onboarding') ? styles.active : ''}`}
                    onClick={() => {
                        router.push('/member-dashboard/onboarding');
                    }}
                >
                    Onboarding
                </Button>
                <Button 
                    className={`${styles.asideNavbarButton} ${isActive('profile') ? styles.active : ''}`}
                    onClick={() => {
                        router.push('/member-dashboard/profile');
                    }}
                >
                    Profile
                </Button>
                <Button 
                    className={`${styles.asideNavbarButton} ${isActive('docs') ? styles.active : ''}`}
                    onClick={() => {
                        router.push('/member-dashboard/docs');
                    }}
                >
                    Docs
                </Button>
            </Box>
            <Box className={styles.asideLogOut}>
                <Button fullWidth onClick={() => {
                    supabase.auth.signOut();
                    router.push('/');
                    router.refresh();
                }}>Log Out</Button>
            </Box>
        </aside>
    );
};

export default AsideNavbar;