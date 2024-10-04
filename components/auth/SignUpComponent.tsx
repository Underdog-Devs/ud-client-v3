'use client'
import React, { useState } from 'react';
import styles from './login.module.scss';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function SignUpComponent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
                <form className={styles.form} onSubmit={handleSignUp}>
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
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.formButton}>Sign Up</button>
                    </div>
                </form>
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>
        </div>
    );
}