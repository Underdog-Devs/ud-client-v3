"use client";
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import styles from './navigation.module.scss';

interface Props { }

function Navigation({ }: Props): ReactElement {
	const [showLinks, setShowLinks] = useState(false);
	const linksContainerRef = useRef<HTMLElement | null>(null);

	const toggleLinks = () => {
		setShowLinks(!showLinks);
	};

	useEffect(() => {
		if (showLinks) {
			if (linksContainerRef.current) {
				linksContainerRef.current.style.height = 'auto';
			}
		} else if (linksContainerRef.current) {
			linksContainerRef.current.style.height = '0px';
		}
	}, [showLinks]);

	return (
		<div className={styles.container}>
			<div className={styles.desktopNav}>
				<Link href="/" passHref>
					<Image
						onClick={() => setShowLinks(false)}
						className={styles.image}
						src="/images/underdogdevs-04.png"
						height={45}
						width={165}
						alt="Underdog devs"
					/>
				</Link>
				<nav className={styles.navigation}>
					<div className={styles.navigationLinks}>
						<a href="https://forms.gle/YdE9SBfJGXc3XW928" target="_blank" rel="noreferrer">
							Become a Mentee
						</a>
						<a href="https://forms.gle/qsusfwyTA8H2vj6z5" target="_blank" rel="noreferrer">Become a Mentor</a>
						<Link href="/project-underdog" passHref>
							Project Underdog
						</Link>
						{/* commented out until we have testimonial data to display */}
						{/* <Link href="/testimonials" passHref>
							<p className={styles.getInvolvedButton}>Testimonials</p>
						</Link> */}
						<Link href="/donate" passHref>
							Donate
						</Link>
						<Link href="/signup" passHref>
							Contact Us
						</Link>
						<a href="https://cottonbureau.com/people/underdog-devs" target="_blank" rel="noreferrer"> Merchandise </a>
					</div>

				</nav>
			</div>
			<div className={styles.mobileNav}>
				<div className={styles.navHeader}>
					<Link href="/" passHref>
						<Image
							onClick={() => setShowLinks(false)}
							className={styles.image}
							src="/images/icon-01.png"
							height={75}
							width={75}
							alt="Underdog devs"
						/>
					</Link>
					<button
						aria-label="navigation-menu"
						className={styles.navToggle}
						onClick={toggleLinks}
					>
						{showLinks ? <FaTimes /> : <FaBars />}
					</button>
				</div>
				<nav className={styles.mobileNavigation} ref={linksContainerRef}>
					<a
						onClick={() => setShowLinks(false)}
						href="https://forms.gle/YdE9SBfJGXc3XW928"
						target="_blank"
						rel="noreferrer"
					>
						Become a Mentee
					</a>
					<a
						onClick={() => setShowLinks(false)}
						href="https://forms.gle/qsusfwyTA8H2vj6z5"
						target="_blank"
						rel="noreferrer"
					>Become a Mentor
					</a>
					<Link
						href="/project-underdog"
						onClick={() => setShowLinks(false)}
						passHref
					>
						Project Underdog
					</Link>
					{/* commented out until we have testimonial data to display */}
					{/* <Link
						href="/testimonials"
						passHref
					>
						<p onClick={() => setShowLinks(false)}>Testimonials</p>
					</Link> */}
					<Link
						href="/donate"
						passHref
						onClick={() => setShowLinks(false)}
					>
						Donate
					</Link>
					<Link
						href="/signup"
						passHref
						onClick={() => setShowLinks(false)}
					>
						Contact Us
					</Link>
					<a
						
						href="https://cottonbureau.com/people/underdog-devs"
						target="_blank"
						rel="noreferrer"
					> Merchandise
					</a>
				</nav>
			</div>
		</div>
	);
}

export default Navigation;
