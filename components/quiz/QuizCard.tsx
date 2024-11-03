import React from 'react';
import { Link, CardHeader, Avatar, IconButton, CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CheckIcon from '@mui/icons-material/Check';

export interface QuizCardMetadata {
    order: number;
    for: string[];
    title: string;
    description: string;
    alt: string;
    slug: string;
    linkText: string;
    content: string;
    quiz: string;
    image: string;
    completed: boolean;
    available: boolean;
}

export interface QuizCardUserMetadata {
    available: boolean;
}

export const QuizCard: React.FC<QuizCardMetadata & QuizCardUserMetadata> = ({ title, description, alt, slug, linkText, completed, available }) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }} >
        <CardActionArea href={!available ? '#' : `/member-dashboard/quiz/${slug}`} sx={{height: '100%'}}>
            <CardMedia
                component="img"
                alt={alt}
                height="140"
                image={"/images/meeting.jpg"}
                sx={{opacity: 0.7, filter: available ? 'none' : 'grayscale(100%)'}}
            />
            <CardContent>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <CardHeader
                        title={title}
                    subheader={description}
                />
                {completed && <CheckIcon/>}
                </div>
            </CardContent>
        </CardActionArea>
    </Card>
  );
};
