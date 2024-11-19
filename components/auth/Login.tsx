'use client'
import React, { useState } from 'react';
import styles from './login.module.scss';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Alert } from '@mui/material';

export function Login() {
    const [view, setView] = useState('sign-in')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClientComponentClient()
    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const res = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (res.error === null) {
            router.push('/member-dashboard')
            router.refresh()
        }
        else {
            setTimeout(() => {
                setError(res.error.message)
            }, 1000);
        }
    }

    const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { data, error } = await supabase.auth
            .resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset`,
            })
        if (!error) {
            setView('check-email')
        }
    }

    return (
        <>
            <div className={styles.container}>
                {view === 'check-email' ? (
                    <div className={styles.formContainer}>
                    <h4 className={styles.title}>Check your email</h4>
                    <div style={{maxWidth: 400, padding: '0 25px', textAlign: 'center', color: 'white'}}>
                        <p className="text-center">
                            We've sent a password reset link to the email address you provided, if it exists in our system.
                        </p>
                    </div>
                    
                </div>
            ) : (
                <div className={styles.formContainer}>
                    <h4 className={styles.title}>{view!=='reset'?"Login":"Forgot Password?"}</h4>
                    {error && <Alert severity="error" sx={{marginBottom: 2}}>{error}</Alert>}
                    <form className={styles.form} onSubmit={view==='sign-in'?handleSignIn:resetPassword}>
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
                        {view!=='reset'&&
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
                        </div>}
                        <div className={styles.formActions}>
                        {view!=='reset'?<span className={`${styles.passwordResetLink} ${styles.formButton}`} onClick={()=>setView('reset')}>Forgot Password?</span>:<span className={`${styles.passwordResetLink} ${styles.formButton}`} onClick={()=>setView('sign-in')}>Sign In</span>}
                            <button type="submit" className={styles.formButton}>{view!=='reset'?"Submit":"Reset"}</button>
                        </div>
                    </form>
                </div>)}
        </div>
        </>
    );
}