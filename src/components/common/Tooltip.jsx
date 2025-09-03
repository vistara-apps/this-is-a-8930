/**
 * Tooltip Component
 * 
 * This component displays a tooltip when hovering over its children.
 */

import React, { useState, useRef, useEffect } from 'react'

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 300,
  className = '',
  contentClassName = '',
  arrow = true,
  maxWidth = 250,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const targetRef = useRef(null)
  const tooltipRef = useRef(null)
  const timeoutRef = useRef(null)
  
  // Calculate the position of the tooltip
  const calculatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return
    
    const targetRect = targetRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollY = window.scrollY || window.pageYOffset
    const scrollX = window.scrollX || window.pageXOffset
    
    let top = 0
    let left = 0
    
    switch (position) {
      case 'top':
        top = targetRect.top + scrollY - tooltipRect.height - 8
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'bottom':
        top = targetRect.bottom + scrollY + 8
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'left':
        top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipRect.height / 2)
        left = targetRect.left + scrollX - tooltipRect.width - 8
        break
      case 'right':
        top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipRect.height / 2)
        left = targetRect.right + scrollX + 8
        break
      default:
        top = targetRect.top + scrollY - tooltipRect.height - 8
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2)
    }
    
    // Ensure the tooltip stays within the viewport
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Adjust horizontal position if needed
    if (left < 10) {
      left = 10
    } else if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10
    }
    
    // Adjust vertical position if needed
    if (top < 10) {
      top = targetRect.bottom + scrollY + 8 // Switch to bottom if not enough space on top
    } else if (top + tooltipRect.height > viewportHeight + scrollY - 10) {
      top = targetRect.top + scrollY - tooltipRect.height - 8 // Switch to top if not enough space on bottom
    }
    
    setTooltipPosition({ top, left })
  }
  
  // Show the tooltip
  const showTooltip = () => {
    if (disabled) return
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      // Calculate position after the tooltip is visible
      setTimeout(calculatePosition, 0)
    }, delay)
  }
  
  // Hide the tooltip
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }
  
  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition()
      }
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize)
    }
  }, [isVisible])
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  // Get arrow position class
  const getArrowClass = () => {
    switch (position) {
      case 'top': return 'bottom-[-4px] left-1/2 transform -translate-x-1/2 border-t-dark-surface border-l-transparent border-r-transparent border-b-transparent'
      case 'bottom': return 'top-[-4px] left-1/2 transform -translate-x-1/2 border-b-dark-surface border-l-transparent border-r-transparent border-t-transparent'
      case 'left': return 'right-[-4px] top-1/2 transform -translate-y-1/2 border-l-dark-surface border-t-transparent border-b-transparent border-r-transparent'
      case 'right': return 'left-[-4px] top-1/2 transform -translate-y-1/2 border-r-dark-surface border-t-transparent border-b-transparent border-l-transparent'
      default: return 'bottom-[-4px] left-1/2 transform -translate-x-1/2 border-t-dark-surface border-l-transparent border-r-transparent border-b-transparent'
    }
  }
  
  return (
    <div
      className={`inline-block ${className}`}
      ref={targetRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            maxWidth: `${maxWidth}px`
          }}
        >
          <div className={`bg-dark-surface text-dark-text text-sm rounded-lg py-2 px-3 shadow-dark-modal border border-dark-border ${contentClassName}`}>
            {content}
            {arrow && (
              <div className={`absolute w-0 h-0 border-4 ${getArrowClass()}`} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Tooltip

