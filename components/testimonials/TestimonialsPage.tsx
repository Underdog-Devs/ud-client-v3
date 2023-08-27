import React from 'react';
import styles from './testimonialsPage.module.scss';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Testimonial } from '../testimonial/Testimonial';

export const dynamic = "force-dynamic";

const TestimonialsPage = async () => {
	const supabase = createServerComponentClient({ cookies })
	const { data: testimonials } = await supabase.from('testimonials').select()
	.order('created_at', { ascending: false })
	return (
		<div className={styles.container}>
			<div className={styles.title}>
				<h1>Testimonials</h1>
				<p>Some words from mentees and mentors about Underdog Devs</p>
			</div>
			{testimonials?testimonials.map((testimonial, i) => {
				return (
					<div key={i} className={styles.card}>
						<Testimonial name={testimonial.name} type={testimonial.type} testimonial={testimonial.testimonial} image={testimonial.image}/>
					</div>
				);
			}):null}
		</div>
	);
};

export default TestimonialsPage;
