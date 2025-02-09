'use client'
import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Footer from './parts/footer';
import Navigation from './parts/navigation';
import DashboardLayout from './DashboardLayout';

type Props = {
	children: ReactNode;
};

const Layout = ({ children }: Props) => {
	const pathname = usePathname();
	const isDashboard = pathname.startsWith('/member-dashboard');

	if (isDashboard) {
		return (
			<>
				<Navigation />
				<DashboardLayout>
					{children}
				</DashboardLayout>
			</>
		);
	}

	return (
		<>
			<Navigation />
			<main>
				{children}
			</main>
			<Footer />
		</>
	);
};

export default Layout;
