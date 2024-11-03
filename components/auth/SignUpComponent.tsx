'use client'
import React, { useEffect, useState } from 'react';
import styles from './login.module.scss';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

enum UserRole {
    mentee = 'mentee',
    mentor = 'mentor',
}

export function SignUpComponent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState<UserRole>(UserRole.mentee)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowConfirmation(true);
    }

    useEffect(() => {
        console.log(showConfirmation)
    }, [showConfirmation])

    const handleConfirm = () => {
        setShowConfirmation(false);
        handleSignUp();
    }

    const handleCancel = () => {
        setShowConfirmation(false);
    }
    
    const handleSignUp = async () => {
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
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
        })

        if (error) {
            setError(error.message)
        } else {
            router.push('/login')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h4 className={styles.title}>Sign Up</h4>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formField}>
                        <input
                            className={styles.formInput}
                            type="email"
                            name="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="you@example.com"
                        />
                        <label className={styles.formLabel} htmlFor="email">Email</label>
                    </div>
                    <div className={styles.formField}>
                        <input
                            className={styles.formInput}
                            type="password"
                            name="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="••••••••"
                        />
                        <label className={styles.formLabel} htmlFor="password">Password</label>
                    </div>
                    <div className={styles.formField}>
                        <input
                            className={styles.formInput}
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            placeholder="••••••••"
                        />
                        <label className={styles.formLabel} htmlFor="confirmPassword">Confirm Password</label>
                    </div>
                    <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">I am a...</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="role"
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        >
                            <FormControlLabel value={UserRole.mentee} control={<Radio />} label="Mentee" />
                            <FormControlLabel value={UserRole.mentor} control={<Radio />} label="Mentor" />
                        </RadioGroup>
                    </FormControl>
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.formButton}>Sign Up</button>
                    </div>
                </form>
                
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>
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
        </div>
    );
}