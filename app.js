document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.querySelector('.next-btn');
    const video = document.querySelector('.hero-video');
    const heroSection = document.querySelector('.hero-section');
    const heroInfo = document.querySelector('.hero-info');
    const heroVid = document.querySelector('.hero-vid');
    const gamingText = document.querySelector('.gaming-text');
    
    // Video lists
    const desktopMovieList = [
        'videos/hero-3.mp4',
        'videos/hero-4.mp4',
        'videos/hero-1.mp4',
        'videos/hero-2.mp4'
    ];
    
    const mobileMovieList = [
        'videos-mobile/hero-3-mobile.mp4',
        'videos-mobile/hero-4-mobile.mp4',
        'videos-mobile/hero-1-mobile.mp4',
        'videos-mobile/hero-2-mobile.mp4'
    ];
    
    let index = 0;
    
    // Create a loading indicator element for the video
    const loaderElement = document.createElement('div');
    loaderElement.className = 'video-loader';
    loaderElement.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; border: 5px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: #edff66; animation: spin 1s ease-in-out infinite; z-index: 10; opacity: 0; transition: opacity 0.3s ease;';
    
    // Add the keyframes for the loader animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes spin {
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .video-loading .video-loader {
            opacity: 1;
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Add the loader to the hero video container
    heroVid.appendChild(loaderElement);
    
    // Function to check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Function to enforce visibility of mobile elements
    function fixMobileDisplay() {
        if (isMobile()) {
            console.log("Fixing mobile display");
            
            // Force hero section to be visible
            heroSection.style.display = 'block';
            heroSection.style.height = '100vh';
            heroSection.style.width = '100%';
            
            // Force video container to be visible
            heroVid.style.display = 'block';
            heroVid.style.height = '100%';
            heroVid.style.width = '100%';
            heroVid.style.position = 'relative';
            
            // Force video to be visible
            video.style.display = 'block';
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            
            // Force UI elements to be visible
            if (heroInfo) {
                heroInfo.style.display = 'block';
                heroInfo.style.opacity = '1';
                heroInfo.style.zIndex = '999';
            }
            
            if (nextButton) {
                nextButton.style.display = 'flex';
                nextButton.style.opacity = '1';
                nextButton.style.zIndex = '999';
            }
            
            if (gamingText) {
                gamingText.style.display = 'block';
                gamingText.style.opacity = '1';
                gamingText.style.zIndex = '99';
            }
        }
    }
    
    // Function to create a fallback for mobile when video fails
    function createVideoFallback() {
        if (isMobile()) {
            console.log("Creating video fallback");
            
            // Create a fallback background
            const fallbackBg = document.createElement('div');
            fallbackBg.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(45deg, #000, #333); z-index: 1;';
            
            // Insert the fallback before the video
            heroVid.insertBefore(fallbackBg, video);
            
            // Hide the actual video
            video.style.opacity = '0';
            
            // Make sure UI elements are in front of the fallback
            fixMobileDisplay();
        }
    }
    
    // Function to update video sources based on device
    function updateVideoSource() {
        // Show loading indicator
        heroVid.classList.add('video-loading');
        
        // Get all sources
        const sources = video.getElementsByTagName('source');
        
        // Remove all existing sources
        while(sources.length > 0) {
            video.removeChild(sources[0]);
        }
        
        // Create and add the appropriate source
        const source = document.createElement('source');
        source.type = 'video/mp4';
        
        if (isMobile()) {
            source.src = mobileMovieList[index];
            console.log('Setting mobile video:', mobileMovieList[index]);
            
            // Force preload and inline playback for mobile
            video.setAttribute('preload', 'auto');
            video.setAttribute('playsinline', '');
            video.setAttribute('muted', '');
            video.muted = true;
            
            // Force mobile display fixes right after changing source
            setTimeout(fixMobileDisplay, 100);
        } else {
            source.src = desktopMovieList[index];
            console.log('Setting desktop video:', desktopMovieList[index]);
        }
        
        video.appendChild(source);
        
        // Force reload and play
        video.load();
        
        try {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Hide loader when video starts playing
                    heroVid.classList.remove('video-loading');
                    console.log("Video playing successfully");
                    
                    // Make sure video is visible
                    video.style.opacity = '1';
                }).catch(error => {
                    console.log('Play error:', error);
                    
                    // Auto-play was prevented, try to play on user interaction
                    document.body.addEventListener('click', function bodyClick() {
                        video.play().then(() => {
                            heroVid.classList.remove('video-loading');
                            video.style.opacity = '1';
                        });
                        document.body.removeEventListener('click', bodyClick);
                    }, { once: true });
                    
                    // Hide loader after a timeout even if video doesn't play
                    setTimeout(() => {
                        heroVid.classList.remove('video-loading');
                        
                        // Create fallback if video fails on mobile
                        if (isMobile() && video.readyState < 2) {
                            createVideoFallback();
                        }
                    }, 2000);
                });
            }
        } catch (e) {
            console.error('Video play error:', e);
            
            // Hide loader after error
            heroVid.classList.remove('video-loading');
            
            // Create fallback if video fails on mobile
            if (isMobile()) {
                createVideoFallback();
            }
        }
    }
    
    // Main initialization
    function init() {
        console.log("Initializing app.js");
        console.log("Device detection:", isMobile() ? "MOBILE" : "DESKTOP");
        
        // Fix mobile display immediately
        if (isMobile()) {
            fixMobileDisplay();
        }
        
        // Set initial video source when page loads
        updateVideoSource();
        
        // Handle next button click
        nextButton.addEventListener('click', function() {
            index = (index + 1) % desktopMovieList.length; // Same length for both arrays
            updateVideoSource();
        });
        
        // Update video on resize (e.g., when rotating device)
        let resizeTimeout;
        window.addEventListener('resize', function() {
            // Debounce resize event
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Fix mobile display on resize
                fixMobileDisplay();
                
                // Check if we need to switch video format
                const wasMobile = isMobile();
                setTimeout(() => {
                    if (wasMobile !== isMobile()) {
                        console.log("Device type changed, updating source");
                        updateVideoSource();
                    }
                }, 300);
            }, 300);
        });
    }
    
    // Start initialization
    init();
    
    // Additional checks to ensure mobile display works
    if (isMobile()) {
        // Try multiple times to ensure display
        for (let i = 1; i <= 3; i++) {
            setTimeout(() => {
                console.log(`Mobile display check ${i}`);
                fixMobileDisplay();
                
                // If video still has issues after 3 seconds, use fallback
                if (i === 3 && video.readyState < 2) {
                    console.warn("Video still not ready after 3 seconds, using fallback");
                    createVideoFallback();
                }
            }, i * 1000);
        }
    }
});