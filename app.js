// Wait for DOM to fully load
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
    
    // Make sure nextButton exists before adding event listener
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            // Increment index with wrap-around
            index = (index + 1) % desktopMovieList.length;
            
            // Get all source elements
            const sources = video.getElementsByTagName('source');
            
            // Update source for mobile (first source)
            if (sources.length > 0) {
                sources[0].src = mobileMovieList[index];
            }
            
            // Update source for desktop (second source)
            if (sources.length > 1) {
                sources[1].src = desktopMovieList[index];
            }
            
            // Reset the video to load new source
            video.load();
            
            // Play after loading
            video.play();
            
            // For debugging
            console.log('Video changed to index:', index);
        });
    } else {
        console.error('Next button not found!');
    }
});