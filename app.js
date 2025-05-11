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

nextButton.addEventListener('click', function() {
    // Increment index with wrap-around
    index = (index + 1) % desktopMovieList.length;
    
    // Update sources based on device
    if (window.innerWidth <= 768) {
        // Mobile - update both sources
        const sources = video.getElementsByTagName('source');
        sources[0].src = mobileMovieList[index];
        sources[1].src = desktopMovieList[index];
    } else {
        // Desktop - just use desktop sources
        const sources = video.getElementsByTagName('source');
        sources[1].src = desktopMovieList[index];
    }
    
    // Reset the video to load new source
    video.load();
    
    // Play after loading
    video.play();
});