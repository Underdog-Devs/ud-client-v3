'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, Box, useTheme } from '@mui/material';
enum UserRole {
    mentee = 'mentee',
    mentor = 'mentor',
}

export function SignUpComponent() {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.mentee);
    const [error, setError] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirm = () => {
        setShowConfirmation(false);
        handleSignUp();
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    const handleSignUp = async () => {
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
                data: {
                    role: role,
                },
            },
            
        });

        if (error) {
            setError(error.message);
        } else {
            router.push('/signin');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
            <Typography variant="h4" color={theme.palette.primary.main} textAlign="right">Sign Up</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="outlined"
                />
                <FormControl component="fieldset" margin="normal" sx={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    gap: 2,
                    flexWrap: 'nowrap'
                }}>
                    <Typography variant="body1" sx={{ 
                        whiteSpace: 'nowrap',
                        marginBottom: 0
                    }}>I am a</Typography>
                    <RadioGroup
                        row
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        sx={{ margin: 0 }}
                    >
                        <FormControlLabel value={UserRole.mentee} control={<Radio />} label="Mentee" />
                        <FormControlLabel value={UserRole.mentor} control={<Radio />} label="Mentor" />
                    </RadioGroup>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sign Up
                </Button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <Dialog
                open={showConfirmation}
                onClose={handleCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm role selection"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to sign up as a {role}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleConfirm} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}