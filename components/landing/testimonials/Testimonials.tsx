import React from 'react';
import styles from './testimonials.module.scss';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Testimonial } from '../../testimonial';
import Link from 'next/link';

export const dynamic = "force-dynamic";

const Testimonials = async () => {
	const supabase = createServerComponentClient({ cookies })
	const { data: testimonials } = await supabase.from('testimonials').select()
	.limit(3).order('created_at', { ascending: false })
	return (
		<div>
			<h2 className={styles.title}>Testimonials</h2>
			<div className={styles.container}>
				{testimonials?testimonials.map((testimonial, i) => {
					return (
						<div key={i}>
							<Testimonial name={testimonial.name} type={testimonial.type} testimonial={testimonial.testimonial.length > 150 ? testimonial.testimonial.substring(0, 250)+"..." : testimonial.testimonial} image={testimonial.image?testimonial.image:'/images/icon-03.jpg'} />
						</div>
					);
				}):null}
			</div>
			<div className={styles.more}>
				<Link href="/testimonials">
					See more testimonials
				</Link>
			</div>
		</div>
	);
};

export default Testimonials;
