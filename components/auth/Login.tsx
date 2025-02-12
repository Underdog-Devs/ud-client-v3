'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { TextField, Button, Alert, Box, Typography, useTheme, CircularProgress } from '@mui/material';
import styles from './login.module.scss';

export function Login() {
    const theme = useTheme();
    const [view, setView] = useState('sign-in');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (res.error === null) {
            window.location.href = '/';
        } else {
            setTimeout(() => {
                setError(res.error.message);
            }, 1000);
        }
    };

    const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset`,
        });
        if (!error) {
            setView('check-email');
        }
    };

    return (
        <Box className={styles.container} sx={{ maxWidth: 400, margin: 'auto', padding: '1rem' }}>
            {view === 'check-email' ? (
                <Box className={styles.formContainer}>
                    <Typography variant="h4" className={styles.title} color={theme.palette.primary.main} textAlign="center" fontWeight="bold">Check your email</Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
                        We've sent a password reset link to the email address you provided, if it exists in our system.
                    </Typography>
                </Box>
            ) : (
                <Box className={styles.formContainer}>
                    <Typography variant="h4" className={styles.title} color={theme.palette.primary.main} textAlign="right">
                        {view !== 'reset' ? "Log In" : "Forgot password?"}
                    </Typography>
                    <form className={styles.form} onSubmit={view === 'sign-in' ? handleSignIn : resetPassword}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                        />
                        {view !== 'reset' && (
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                variant="outlined"
                            />
                        )}
                        <Box className={styles.formActions} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Button
                                onClick={() => setView(view !== 'reset' ? 'reset' : 'sign-in')}
                                sx={{ textTransform: 'none', color: 'gray'}}
                                disableRipple
                            >
                                {view !== 'reset' ? "Forgot password?" : "Back"}
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                {view !== 'reset' ? "Submit" : "Reset"}
                            </Button>
                        </Box>
                    </form>
                    {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
                </Box>
            )}
        </Box>
    );
}