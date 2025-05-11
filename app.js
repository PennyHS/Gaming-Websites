document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.querySelector('.next-btn');
    const video = document.querySelector('.hero-video');
    
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
    
    // Add styling for the loader
    const style = document.createElement('style');
    style.textContent = `
    .video-loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #edff66;
        animation: spin 1s ease-in-out infinite;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    @keyframes spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .video-loading .video-loader {
        opacity: 1;
    }

    .video-loading .hero-video {
        opacity: 0.5;
        transition: opacity 0.3s ease;
    }
    `;
    document.head.appendChild(style);
    
    // Add a loader element to the hero-vid div
    const loaderElement = document.createElement('div');
    loaderElement.className = 'video-loader';
    document.querySelector('.hero-vid').appendChild(loaderElement);
    
    // Function to check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Function to preload the next video
    function preloadNextVideo() {
        const nextIndex = (index + 1) % desktopMovieList.length;
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'video';
        preloadLink.href = isMobile() ? mobileMovieList[nextIndex] : desktopMovieList[nextIndex];
        
        // Remove any existing preload links
        document.querySelectorAll('link[rel="preload"][as="video"]').forEach(el => el.remove());
        
        // Add the new preload link
        document.head.appendChild(preloadLink);
        console.log('Preloading next video:', preloadLink.href);
    }
    
    // Function to update video sources based on device
    function updateVideoSource() {
        // Show loader
        document.querySelector('.hero-vid').classList.add('video-loading');
        
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
                    document.querySelector('.hero-vid').classList.remove('video-loading');
                    // Preload the next video now
                    preloadNextVideo();
                }).catch(error => {
                    console.log('Play error:', error);
                    // Auto-play was prevented, try to play on user interaction
                    document.body.addEventListener('click', function bodyClick() {
                        video.play().then(() => {
                            document.querySelector('.hero-vid').classList.remove('video-loading');
                        });
                        document.body.removeEventListener('click', bodyClick);
                    }, { once: true });
                    
                    // Hide loader after a timeout even if video doesn't play
                    setTimeout(() => {
                        document.querySelector('.hero-vid').classList.remove('video-loading');
                    }, 2000);
                });
            }
        } catch (e) {
            console.error('Video play error:', e);
            // Hide loader after error
            document.querySelector('.hero-vid').classList.remove('video-loading');
        }
    }
    
    // Function to check if video is visible and playing correctly
    function checkVideoVisibility() {
        const heroSection = document.querySelector('.hero-section');
        
        // Force correct dimensions and visibility
        heroSection.style.display = 'block';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        
        // Log video status for debugging
        console.log('Video ready state:', video.readyState);
        console.log('Video dimensions:', video.offsetWidth, 'x', video.offsetHeight);
        
        // Force reload if video appears to have issues
        if (video.readyState === 0 || video.readyState === 1) {
            console.log('Video not ready, reloading...');
            updateVideoSource();
        }
    }
    
    // Fix for mobile video autoplay issues
    function enableMobileVideo() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Force low-power mode for better mobile performance
            video.setAttribute('playsinline', '');
            video.setAttribute('muted', '');
            video.muted = true;
            
            // Handle visibility changes
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    video.play().catch(e => console.log('Visibility play error:', e));
                } else {
                    video.pause();
                }
            });
        });
    }
    
    // Add lazy loading to card videos
    function setupLazyVideos() {
        const cardVideos = document.querySelectorAll('.card video');
        cardVideos.forEach(video => {
            // Add lazy loading attribute
            video.setAttribute('loading', 'lazy');
            
            // Create an observer for lazy loading
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Start playing when in viewport
                        video.play().catch(e => console.log('Lazy video play error:', e));
                        observer.disconnect();
                    }
                });
            }, {
                rootMargin: '100px' // Start loading when 100px away
            });
            
            observer.observe(video);
        });
    }
    
    // Detect low-bandwidth conditions
    function checkConnection() {
        if (navigator.connection) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // Switch to lightweight version
                console.log('Slow connection detected, optimizing content...');
                
                // Replace card videos with static images on very slow connections
                if (connection.downlink < 0.5) { // Less than 0.5 Mbps
                    document.querySelectorAll('.card video').forEach((video, index) => {
                        // Create a placeholder for the video
                        const placeholder = document.createElement('div');
                        placeholder.className = 'video-placeholder';
                        placeholder.style.cssText = 'width: 100%; height: 100%; background-color: #000; display: flex; align-items: center; justify-content: center;';
                        
                        // Add a play icon or text
                        placeholder.innerHTML = '<div style="color: white; text-align: center;"><div style="font-size: 40px;">▶️</div><div>Click to load video</div></div>';
                        
                        // Replace video with placeholder
                        video.parentNode.replaceChild(placeholder, video);
                        
                        // Add click handler to load video when requested
                        placeholder.addEventListener('click', function() {
                            const newVideo = document.createElement('video');
                            newVideo.src = video.src;
                            newVideo.autoplay = true;
                            newVideo.muted = true;
                            newVideo.loop = true;
                            newVideo.playsinline = true;
                            newVideo.style.width = '100%';
                            newVideo.style.height = '100%';
                            newVideo.style.objectFit = 'cover';
                            
                            placeholder.parentNode.replaceChild(newVideo, placeholder);
                            newVideo.play().catch(e => console.log('Placeholder click play error:', e));
                        });
                    });
                }
            }
        }
    }
    
    // Main initialization
    function init() {
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
                updateVideoSource();
                checkVideoVisibility();
            }, 300);
        });
        
        // Check video visibility after a short delay
        setTimeout(checkVideoVisibility, 1000);
        
        // Enable optimizations for mobile
        enableMobileVideo();
        
        // Setup lazy loading for other videos
        setupLazyVideos();
        
        // Check connection speed
        checkConnection();
        
        // Preload the next video
        preloadNextVideo();
    }
    
    // Start initialization
    init();
});