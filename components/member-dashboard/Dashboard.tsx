"use client"

import { Box, Button, Tabs, Typography } from '@mui/material';
import { Tab } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Dashboard({ currentTab }: { currentTab: string }) {
  const router = useRouter();
  const [value, setValue] = useState(currentTab);
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

  const resetOnboarding = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (user.user_metadata.completed_onboarding_quiz) {
      await supabase.auth.updateUser({
        data: { completed_onboarding_quiz: false }
        });
        setCompletedOnboarding(false);
      }
      else {
        await supabase.auth.updateUser({
          data: { completed_onboarding_quiz: true }
        });
        setCompletedOnboarding(true);
      }
    }
    
  };

  return (
    <div>
      <Box sx={{margin: 2}}>
      <Tabs selectionFollowsFocus value={value} onChange={handleChange} aria-label="dashboard tabs" textColor="primary" indicatorColor="primary" sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Tab label="Quiz" value="quiz" color="primary" sx={{fontWeight: 'bold', fontSize: '1.25rem'}} />
          <Tab label="Profile" value="profile" color="primary" sx={{fontWeight: 'bold', fontSize: '1.25rem'}} />
          <Tab
            label="Docs"
            value="docs"
            disabled={!completedOnboarding}
            color="primary"
            sx={{fontWeight: 'bold', fontSize: '1.25rem' }}
          />
          {process.env.NODE_ENV === 'development' && <Button 
            onClick={resetOnboarding}
            style={{ marginTop: '1rem' }}
            variant="contained"
            color="primary"
          >
              Change completedOnboarding flag
            </Button>}
        </Tabs>
      </Box>
    </div>
  )
}