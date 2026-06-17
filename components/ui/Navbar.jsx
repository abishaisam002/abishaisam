'use client'

import { useEffect, useRef, useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/ui/Navbar.module.css'
import { FaBars, FaTimes } from 'react-icons/fa'

// idx matches snap position in page.js dynamically based on projects count
const NAV_ITEMS = [
  { label: 'Home',         idx: 0 },
  { label: 'About',        idx: 2 },
  { label: 'Projects',     idx: 3 },
  { label: 'Experience',   idx: 3 + profile.projects.length },
  { label: 'Expertise',    idx: 3 + profile.projects.length + 1 },
  { label: 'Contact',      idx: 3 + profile.projects.length + 3 },
]

function getUAETime() {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).toUpperCase()
}

export default function Navbar() {
  const [time,    setTime]    = useState('')   // '' on SSR - avoids hydration mismatch
  const [onIntro, setOnIntro] = useState(true)
  const [onDark,  setOnDark]  = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef   = useRef(null)
  const lastY       = useRef(0)
  const hidden      = useRef(false)
  const stopTimer   = useRef(null)

  // Live clock - set immediately on mount, then every second
  useEffect(() => {
    setTime(getUAETime())
    const id = setInterval(() => setTime(getUAETime()), 1000)
    return () => clearInterval(id)
  }, [])

  // Auto-hide on scroll-down, reveal on scroll-up or scroll-stop
  useEffect(() => {
    const scroller = document.querySelector('main') ?? window
    const vh = window.innerHeight

    function showNavbar() {
      if (!hidden.current) return
      gsap.to(headerRef.current, { y: '0%', duration: 0.35, ease: 'power2.out' })
      hidden.current = false
    }

    const onScroll = () => {
      const currentY = scroller.scrollTop ?? window.scrollY
      const delta    = currentY - lastY.current

      const sectionIdx = Math.round(currentY / vh)
      setOnIntro(currentY < vh * 0.8)
      setOnDark(sectionIdx >= 3)

      if (delta > 8 && !hidden.current) {
        gsap.to(headerRef.current, { y: '-100%', duration: 0.35, ease: 'power2.inOut' })
        hidden.current = true
      } else if (delta < -6) {
        showNavbar()
      }

      lastY.current = currentY

      // Show navbar 400 ms after scrolling stops
      clearTimeout(stopTimer.current)
      stopTimer.current = setTimeout(showNavbar, 400)
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      clearTimeout(stopTimer.current)
    }
  }, [])

  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${onIntro ? styles.introMode : ''} ${onDark ? styles.darkMode : ''}`}>
        <span className={styles.time}>UAE TIME - {time}</span>

        <NavigationMenu className={styles.navMenu}>
          <NavigationMenuList className="flex gap-6">
            {NAV_ITEMS.map(({ label, idx }) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink
                  className={styles.navLink}
                  onClick={() => {
                    const scroller = document.querySelector('main')
                    if (scroller) gsap.to(scroller, {
                      scrollTop: idx * window.innerHeight,
                      duration: 1.0,
                      ease: 'power3.inOut',
                    })
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <a
            href="/assets/202605_Abishai_Sam_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.emailBtn} rounded-full text-xs font-semibold px-5 h-8 bg-white/10 hover:bg-white/20 mr-2`}
          >
            Resume
          </a>
          <a
            href="/assets/2026_Abishai_Sam_Cover_Letter_V2.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.emailBtn} rounded-full text-xs font-semibold px-5 h-8 bg-white/10 hover:bg-white/20 mr-2`}
          >
            Cover Letter
          </a>
          <a
            href={`mailto:${profile.email}`}
            className={`${styles.emailBtn} rounded-full text-xs font-semibold px-5 h-8`}
          >
            Email me
          </a>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map(({ label, idx }) => (
            <button
              key={label}
              className={styles.mobileNavLink}
              onClick={() => {
                const scroller = document.querySelector('main')
                if (scroller) gsap.to(scroller, {
                  scrollTop: idx * window.innerHeight,
                  duration: 1.0,
                  ease: 'power3.inOut',
                })
                setMenuOpen(false)
              }}
            >
              {label}
            </button>
          ))}
          <a
            href="/assets/202605_Abishai_Sam_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileMailLink}
            onClick={() => setMenuOpen(false)}
          >
            Download Resume
          </a>
          <a
            href="/assets/2026_Abishai_Sam_Cover_Letter_V2.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileMailLink}
            onClick={() => setMenuOpen(false)}
          >
            Download Cover Letter
          </a>
          <a
            href={`mailto:${profile.email}`}
            className={styles.mobileMailLink}
            onClick={() => setMenuOpen(false)}
          >
            {profile.email}
          </a>
        </div>
      )}
    </>
  )
}
