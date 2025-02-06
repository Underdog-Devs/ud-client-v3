import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface User {
    id: string;
    email: string;
    user_metadata: {
      role: string;
    };
}

export const getUserRole = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();

  console.log('USER', user);
  return user?.user_metadata.role;
};


