import { Container, Box, Typography, Card, CardContent, Avatar, Button, Stack } from '@mui/material'

export function TestimonialsPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Testimonials
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: '750px' }}>
          Hear from our community members about their journey and how UnderdogDevs 
          has impacted their lives and careers.
        </Typography>
        
        <Stack spacing={4} sx={{ mb: 8 }}>
          {/* Testimonials */}
          {[
            {
              id: 1,
              name: "Sarah Johnson",
              role: "Full Stack Developer",
              company: "Tech Corp",
              quote: "UnderdogDevs gave me the confidence and skills I needed to transition from incarceration to a successful tech career. The mentorship program was life-changing.",
              image: "/images/fallback.png"
            },
            {
              id: 2,
              name: "Marcus Williams",
              role: "Frontend Developer",
              company: "StartupXYZ",
              quote: "The community support and technical training I received helped me land my dream job. I'm now mentoring others through the same program that helped me.",
              image: "/images/fallback.png"
            },
            {
              id: 3,
              name: "Jessica Chen",
              role: "Data Analyst",
              company: "DataFlow Inc",
              quote: "Coming from an economically disadvantaged background, I never thought I could work in tech. UnderdogDevs proved me wrong and opened doors I never knew existed.",
              image: "/images/fallback.png"
            }
          ].map((testimonial) => (
            <Card key={testimonial.id} elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Avatar 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    sx={{ width: 64, height: 64, flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="blockquote" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{testimonial.quote}"
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'semibold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role} at {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
        
        {/* Call to Action */}
        <Card sx={{ bgcolor: 'primary.50', textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Ready to Start Your Journey?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Join our community and begin your transformation into a tech professional.
            </Typography>
            <Button 
              variant="contained"
              href="/member-dashboard"
              size="large"
              sx={{ px: 4, py: 1.5, fontWeight: 'semibold' }}
            >
              Join UnderdogDevs
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}