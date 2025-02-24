import Image from 'next/image';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import {
	BsTwitter,
	BsFacebook,
	BsYoutube,
	BsGithub,
	BsLinkedin,
} from 'react-icons/bs';
import { ImInstagram } from 'react-icons/im';
// styles
import styles from './footer.module.scss';

function Footer(): ReactElement {
	return (
		<footer className={styles.container}>
			<div className={styles.content}>
				<div className={styles.social}>
					<Image
						src="/images/underdogdevs-04.png" // Route of the image file
						height={40} // Desired size with correct aspect ratio
						width={150} // Desired size with correct aspect ratio
						alt="Your Name"
						loading="lazy"
					/>
					<p>Connect with us on social media</p>
					<div className={styles.icons}>
						<a
							href="https://twitter.com/UnderdogDevs"
							target="_blank"
							rel="noreferrer"
							className={styles.icon}
						>
							<BsTwitter />
						</a>
						<a
							target="_blank"
							rel="noreferrer"
							href="https://www.facebook.com/Underdog-Devs-104482305007944"
							className={styles.icon}
						>
							<BsFacebook />
						</a>
						<a
							target="_blank"
							rel="noreferrer"
							href="https://www.instagram.com/underdog_devs/"
							className={styles.icon}
						>
							<ImInstagram />
						</a>
						<a
							target="_blank"
							rel="noreferrer"
							href="https://www.youtube.com/channel/UC8rwCavxrhcfZTYPnR_VdSg"
							className={styles.icon}
						>
							<BsYoutube />
						</a>
						<a
							target="_blank"
							rel="noreferrer"
							href="https://github.com/Underdog-Devs"
							className={styles.icon}
						>
							<BsGithub />
						</a>
						<a
							target="_blank"
							rel="noreferrer"
							href="https://www.linkedin.com/company/underdog-devs-org/"
							className={styles.icon}
						>
							<BsLinkedin />
						</a>
					</div>
				</div>
				<div className={styles.navigation}>
					<div className={styles.navSect}>
						<h4>Community</h4>
						<Link href="/signup" passHref>
							Become a Member
						</Link>
						<Link href="/login" passHref>
							Log In
						</Link>
					</div>
					<div className={styles.navSect}>
						<h4>Organization</h4>
						<Link href="/project-underdog" passHref>
							Project Underdog
						</Link>
						<Link href="/donate" passHref>
							Donate
						</Link>
						
						<a href="https://cottonbureau.com/people/underdog-devs" target="_blank" rel="noreferrer"> Merchandise </a>
					</div>
				</div>
			</div>
			<p className={styles.copyright}>
				Copyright © {new Date().getFullYear()} Underdog Devs
			</p>
		</footer>
	);
}

export default Footer;