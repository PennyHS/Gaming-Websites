document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    // Check if view timeline animations are supported
    // This is a new API and not supported in all browsers
    const supportsViewTimeline = CSS.supports && CSS.supports('animation-timeline: view()');
    
    console.log("Device detection:", isMobile ? "Mobile" : "Desktop");
    console.log("Supports view timeline animations:", supportsViewTimeline);
    
    // If on mobile and view timeline isn't supported, use our intersection observer fallback
    if (isMobile && !supportsViewTimeline) {
        console.log("Using intersection observer for animations on mobile");
        
        // Configure the intersection observer
        const observerOptions = {
            root: null, // Use viewport as root
            rootMargin: '0px',
            threshold: 0.15 // Trigger when 15% of element is visible
        };
        
        // Create an intersection observer for each animation type
        const blurObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Apply animation start state when the element becomes visible
                    entry.target.style.opacity = "1";
                    entry.target.style.filter = "blur(0)";
                    entry.target.style.transform = "translateY(0)";
                    
                    // Apply animation end state when scrolled away (delayed)
                    window.addEventListener('scroll', function scrollHandler() {
                        const rect = entry.target.getBoundingClientRect();
                        if (rect.top < -100) {
                            entry.target.style.opacity = "0";
                            entry.target.style.filter = "blur(40px)";
                            entry.target.style.transform = "translateY(-200px)";
                            window.removeEventListener('scroll', scrollHandler);
                        }
                    });
                    
                    // Stop observing once animation is applied
                    blurObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const takeFullObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Delay slightly to make it feel like a scroll-triggered animation
                    setTimeout(() => {
                        entry.target.style.width = "100%";
                        entry.target.style.height = "100vh";
                        entry.target.style.borderRadius = "0";
                        entry.target.style.marginBottom = "100px";
                    }, 300);
                    
                    // Stop observing once animation is applied
                    takeFullObserver.unobserve(entry.target);
                }
            });
        }, { 
            root: null,
            rootMargin: '0px',
            threshold: 0.6 // Higher threshold to match the CSS view(70% 65%)
        });
        
        const displayObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reset initial state to match 'from' in CSS animation
                    entry.target.style.opacity = "0";
                    entry.target.style.transform = "translateY(200px) scale(0.3)";
                    
                    // Then animate to final state
                    setTimeout(() => {
                        entry.target.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0) scale(1)";
                    }, 50);
                    
                    // Stop observing once animation is applied
                    displayObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all elements with the respective animation classes
        document.querySelectorAll('.autoBlur').forEach(element => {
            blurObserver.observe(element);
        });
        
        document.querySelectorAll('.autoTakeFull').forEach(element => {
            takeFullObserver.observe(element);
        });
        
        document.querySelectorAll('.autoDisplay').forEach(element => {
            displayObserver.observe(element);
        });
        
        // For elements already in view on page load
        document.querySelectorAll('.autoBlur, .autoTakeFull, .autoDisplay').forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isVisible) {
                if (element.classList.contains('autoBlur')) {
                    element.style.opacity = "1";
                    element.style.filter = "blur(0)";
                    element.style.transform = "translateY(0)";
                } else if (element.classList.contains('autoTakeFull')) {
                    setTimeout(() => {
                        element.style.transition = "all 0.8s ease-out";
                        element.style.width = "100%";
                        element.style.height = "100vh";
                        element.style.borderRadius = "0";
                        element.style.marginBottom = "100px";
                    }, 500);
                } else if (element.classList.contains('autoDisplay')) {
                    element.style.opacity = "1";
                    element.style.transform = "translateY(0) scale(1)";
                }
            }
        });
    }
    
    // Fallback for older browsers that don't support Intersection Observer
    if (isMobile && !supportsViewTimeline && !('IntersectionObserver' in window)) {
        console.log("Using scroll-based fallback for animations");
        
        // Activate animations for elements in viewport on scroll
        function activateAnimationsOnScroll() {
            document.querySelectorAll('.autoBlur, .autoTakeFull, .autoDisplay').forEach(element => {
                const rect = element.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom >= 0;
                
                if (isInView) {
                    if (element.classList.contains('autoBlur')) {
                        element.style.opacity = "1";
                        element.style.filter = "blur(0)";
                        element.style.transform = "translateY(0)";
                    } else if (element.classList.contains('autoTakeFull')) {
                        element.style.width = "100%";
                        element.style.height = "100vh";
                        element.style.borderRadius = "0";
                        element.style.marginBottom = "100px";
                    } else if (element.classList.contains('autoDisplay')) {
                        element.style.opacity = "1";
                        element.style.transform = "translateY(0) scale(1)";
                    }
                }
            });
        }
        
        // Activate on page load
        activateAnimationsOnScroll();
        
        // Activate on scroll
        window.addEventListener('scroll', activateAnimationsOnScroll);
    }
    
    // Last resort fallback - just make sure elements are visible
    setTimeout(() => {
        if (isMobile) {
            console.log("Ensuring all animated elements are visible");
            document.querySelectorAll('.autoBlur, .autoTakeFull, .autoDisplay').forEach(element => {
                // Make sure element is at least visible regardless of animation
                element.style.opacity = "1";
            });
        }
    }, 2000);
});