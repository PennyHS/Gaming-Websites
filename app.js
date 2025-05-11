document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.querySelector('.next-btn'); 
    const video = document.querySelector('.hero-video');
    
    // Add error handling and logging
    video.addEventListener('error', function(e) {
        console.error('Video error:', e);
        console.error('Current video source:', video.currentSrc);
    });
    
    video.addEventListener('canplay', function() {
        console.log('Video can play');
    });
    
    // Video lists with relative paths
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
    
    // Initial video setup based on device
    function setupInitialVideo() {
        const isMobile = window.innerWidth <= 768;
        const sources = video.getElementsByTagName('source');
        
        if (isMobile) {
            console.log('Mobile device detected, using mobile video source');
            if (sources.length > 0) {
                sources[0].src = mobileMovieList[0];
                console.log('Set mobile source to:', mobileMovieList[0]);
            }
        } else {
            console.log('Desktop device detected, using desktop video source');
            if (sources.length > 1) {
                sources[1].src = desktopMovieList[0];
                console.log('Set desktop source to:', desktopMovieList[0]);
            }
        }
        
        // Reload and play
        video.load();
        
        // Try to play and catch any errors
        video.play().catch(e => {
            console.error('Failed to play video automatically:', e);
            
            // Add a play button if autoplay fails
            if (!document.querySelector('.manual-play-btn')) {
                const playBtn = document.createElement('button');
                playBtn.textContent = 'Play Video';
                playBtn.className = 'manual-play-btn';
                playBtn.style.position = 'absolute';
                playBtn.style.zIndex = '100';
                playBtn.style.top = '50%';
                playBtn.style.left = '50%';
                playBtn.style.transform = 'translate(-50%, -50%)';
                
                playBtn.addEventListener('click', function() {
                    video.play();
                    this.remove();
                });
                
                video.parentNode.appendChild(playBtn);
            }
        });
    }
    
    // Run the setup
    setupInitialVideo();
    
    // Next button functionality
    nextButton.addEventListener('click', function() {
        // Increment index with wrap-around
        index = (index + 1) % desktopMovieList.length;
        
        // Update sources based on device
        if (window.innerWidth <= 768) {
            console.log('Mobile device, changing to:', mobileMovieList[index]);
            // Mobile - update both sources
            const sources = video.getElementsByTagName('source');
            if (sources.length > 0) {
                sources[0].src = mobileMovieList[index];
                console.log('Set mobile source to:', mobileMovieList[index]);
            }
            if (sources.length > 1) {
                sources[1].src = desktopMovieList[index];
            }
        } else {
            console.log('Desktop device, changing to:', desktopMovieList[index]);
            // Desktop - just use desktop sources
            const sources = video.getElementsByTagName('source');
            if (sources.length > 1) {
                sources[1].src = desktopMovieList[index];
                console.log('Set desktop source to:', desktopMovieList[index]);
            }
        }
        
        // Reset the video to load new source
        video.load();
        
        // Play after loading with error handling
        video.play().catch(e => {
            console.error('Failed to play video after next click:', e);
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // If device width crosses the mobile/desktop threshold, reload appropriate video
        const isMobile = window.innerWidth <= 768;
        const sources = video.getElementsByTagName('source');
        
        if (isMobile && sources.length > 0) {
            sources[0].src = mobileMovieList[index];
            video.load();
            video.play().catch(e => console.error('Resize play error:', e));
        } else if (!isMobile && sources.length > 1) {
            sources[1].src = desktopMovieList[index];
            video.load();
            video.play().catch(e => console.error('Resize play error:', e));
        }
    });
    
    // Create fallback for videos
    function createFallbacks() {
        const allVideos = document.querySelectorAll('video');
        
        allVideos.forEach((v, i) => {
            // Add error handling to all videos
            v.addEventListener('error', function(e) {
                console.error(`Video ${i} error:`, e);
                
                // If this is a feature video, try to show a fallback image
                if (v.parentNode.classList.contains('card')) {
                    const img = document.createElement('img');
                    img.src = `img/feature-${i+1}-fallback.jpg`;
                    img.alt = 'Feature preview';
                    img.style.width = '100%';
                    v.parentNode.replaceChild(img, v);
                }
            });
        });
    }
    
    createFallbacks();
});