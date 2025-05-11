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
    
    // Function to check if we're on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Function to update video sources based on device
    function updateVideoSource() {
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
                playPromise.catch(error => {
                    console.log('Play error:', error);
                    // Auto-play was prevented, try to play on user interaction
                    document.body.addEventListener('click', function bodyClick() {
                        video.play();
                        document.body.removeEventListener('click', bodyClick);
                    }, { once: true });
                });
            }
        } catch (e) {
            console.error('Video play error:', e);
        }
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
        resizeTimeout = setTimeout(updateVideoSource, 300);
    });
});