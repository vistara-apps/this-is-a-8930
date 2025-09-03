/**
 * useMediaQuery Hook
 * 
 * This hook provides a way to check if a media query matches the current viewport.
 */

import { useState, useEffect } from 'react'

const useMediaQuery = (query) => {
  // Initialize with a default value to avoid hydration mismatch
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Create a media query list
    const mediaQuery = window.matchMedia(query)
    
    // Set the initial value
    setMatches(mediaQuery.matches)
    
    // Define a callback function to handle changes
    const handleChange = (event) => {
      setMatches(event.matches)
    }
    
    // Add the event listener
    mediaQuery.addEventListener('change', handleChange)
    
    // Clean up the event listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

// Common media query breakpoints
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)'
}

export default useMediaQuery

