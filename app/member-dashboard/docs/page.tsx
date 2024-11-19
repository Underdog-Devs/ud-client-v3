import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import Dashboard from '@/components/member-dashboard/Dashboard';

export default function Docs() {
    return <Box sx={{margin: 2}}>
        <Dashboard currentTab="docs"/>
        <Typography variant="h3">Docs</Typography>
        <Typography variant="body1">Here you can find all the documents you need to know about the program.</Typography>
    </Box>;

}