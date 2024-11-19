"use client"

import { Tabs, Typography } from '@mui/material';
import { Tab } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Dashboard() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [completedOnboarding, setCompletedOnboarding] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkOnboardingStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      setCompletedOnboarding(user?.user_metadata?.completed_onboarding_quiz || false);
    }
    
    checkOnboardingStatus();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (value === 'quiz') {
      router.push('/member-dashboard/quiz');
    } else if (value === 'docs' && completedOnboarding) {
      router.push('/member-dashboard/docs');
    }
  }, [value, completedOnboarding]);

  return (
    <div>
      <Typography variant="h2">Dashboard</Typography>
      <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs">
        <Tab label="Quiz" value="quiz" />
        <Tab label="Profile" value="profile" />
        <Tab 
          label="Docs" 
          value="docs" 
          disabled={!completedOnboarding}
        />
      </Tabs>
    </div>
  )
}