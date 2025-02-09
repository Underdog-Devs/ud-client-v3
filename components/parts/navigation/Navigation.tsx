"use client";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import styles from "./navigation.module.scss";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button, ButtonGroup } from "@mui/material";
import theme from '@/components/theme';

const supabase = createClientComponentClient();

interface Props {}

function Navigation({}: Props): ReactElement {
  const [inDashboard, setInDashboard] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const linksContainerRef = useRef<HTMLElement | null>(null);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    if (showLinks) {
      if (linksContainerRef.current) {
        linksContainerRef.current.style.height = "auto";
      }
    } else if (linksContainerRef.current) {
      linksContainerRef.current.style.height = "0px";
    }
  }, [showLinks]);

  useEffect(() => {
    const checkInDashboard = () => {
      setInDashboard(window.location.pathname.startsWith('/member-dashboard'));
    };
    checkInDashboard();
  }, []);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoggedIn(!!session);
    };

    checkUserLoggedIn();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.desktopNav} style={{ maxWidth: !inDashboard ? '67vw' : '96vw' }}>
        <a href="/">
          <Image
            onClick={() => setShowLinks(false)}
            className={styles.image}
            src="/images/underdogdevs-04.png"
            height={45}
            width={165}
            alt="Underdog devs"
          />
        </a>
        <nav className={styles.navigation}>
          <div className={styles.navigationLinks}>
            <ButtonGroup size="small" aria-label="navigation links" sx={{ gap: 1 }}>
              <Link href="/project-underdog" passHref>
                <Button variant="text" style={{ color: theme.palette.primary.main }}>
                  Project Underdog
              </Button>
            </Link>
            
            {/* Commented out until we have at least one blog post */}
            {/* <div className={styles.verticalRule}></div>
            <Link href="/blog">Blog</Link> */}
            {/* commented out until we have testimonial data to display */}
            {/* <Link href="/testimonials" passHref>
							<p className={styles.getInvolvedButton}>Testimonials</p>
						</Link> */}
            <Link href="/donate" passHref>
              <Button variant="text" style={{ color: theme.palette.primary.main }}>
                Donate
              </Button>
            </Link>
            <a
              href="https://cottonbureau.com/people/underdog-devs"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              <Button variant="text" style={{ color: theme.palette.primary.main }}>
                Merchandise
              </Button>
            </a>
            {loggedIn ? ( 
              inDashboard ? (
                <Link href="/" passHref>
                  <Button variant="text" onClick={() => signOut()}
                    sx={{
                      color: theme.palette.primary.main,
                    }}
                  >
                    Log Out
                  </Button>
                </Link>
              ) : (
                <>
                <Link href="/member-dashboard" passHref>
                  <Button variant="outlined" style={{ color: theme.palette.primary.main, borderColor: "#f29f00" }}>
                    Dashboard
                  </Button>
                </Link>
                <Link href="/" passHref>
                <Button variant="text" onClick={() => signOut()}
                  sx={{
                    color: theme.palette.primary.main,
                  }}
                >
                  Log Out
                  </Button>
                </Link>
                </>
              )
            ) : (
              <>
                <Link href="/signup" passHref>
                  <Button variant="outlined" style={{ color: theme.palette.primary.main, borderColor: "#f29f00" }}>
                    Become a Member
                  </Button>
                </Link>
                <Link href="/signin" passHref>
                  <Button variant="text" style={{ color: theme.palette.primary.main }}>
                    Log In
                  </Button>
                </Link>
              </>
            )}
            </ButtonGroup>
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
          <div className={styles.mobileNavContainer}>
            <Link
              href="/project-underdog"
              onClick={() => setShowLinks(false)}
              passHref
            >
              Project Underdog
            </Link>
            <Link 
              href="/donate" 
              onClick={() => setShowLinks(false)}
              passHref
            >
              Donate
            </Link>
            <a
              href="https://cottonbureau.com/people/underdog-devs"
              target="_blank"
              rel="noreferrer"
              onClick={() => setShowLinks(false)}
            >
              Merchandise
            </a>
            {loggedIn ? (
              inDashboard ? (
                <Link 
                  href="/" 
                  passHref 
                  onClick={() => {
                    setShowLinks(false);
                    signOut();
                  }}
                >
                  Log Out
                </Link>
              ) : (
                <>
                  <Link 
                    href="/member-dashboard" 
                    passHref 
                    onClick={() => setShowLinks(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/" 
                    passHref 
                    onClick={() => {
                      setShowLinks(false);
                      signOut();
                    }}
                  >
                    Log Out
                  </Link>
                </>
              )
            ) : (
              <>
                <Link 
                  href="/signup" 
                  passHref 
                  onClick={() => setShowLinks(false)}
                >
                  Become a Member
                </Link>
                <Link 
                  href="/signin" 
                  passHref 
                  onClick={() => setShowLinks(false)}
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navigation;
