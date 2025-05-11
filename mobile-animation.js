document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        console.log("Mobile device detected, applying mobile-specific animations");
        
        // Process autoTakeFull elements when they become visible
        const takefullElements = document.querySelectorAll('.autoTakeFull');
        
        // Create an observer for the takefull elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log("TakeFull element is now visible");
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.4 // Trigger when 40% visible
        });
        
        // Start observing all takefull elements
        takefullElements.forEach(element => {
            observer.observe(element);
        });
        
        // Make sure autoDisplay elements have their animation triggered
        // We'll do this by removing and re-adding them to force the animation to restart
        const displayElements = document.querySelectorAll('.autoDisplay');
        displayElements.forEach(element => {
            // Force animation to restart
            element.style.animation = 'none';
            // Trigger reflow
            void element.offsetWidth;
            // Re-add animation
            element.style.animation = 'mobileDisplayIn 0.8s ease-out forwards';
        });
    }
});