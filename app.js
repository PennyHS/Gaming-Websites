const nextButton = document.querySelector('.next-btn');
const video = document.querySelector('.hero-video');

// Detect environment - if URL contains localhost or 127.0.0.1, it's local
const isLocalDevelopment = window.location.hostname.includes('localhost') || 
                          window.location.hostname.includes('127.0.0.1');

// Base path changes depending on environment
const basePath = isLocalDevelopment ? 'public' : '';

// Video lists with environment-aware paths
const desktopMovieList = [
    `/videos/hero-3.mp4`,
    `/videos/hero-4.mp4`,
    `/videos/hero-1.mp4`,
    `/videos/hero-2.mp4`
];

const mobileMovieList = [
    `/videos-mobile/hero-3-mobile.mp4`,
    `/videos-mobile/hero-4-mobile.mp4`,
    `/videos-mobile/hero-1-mobile.mp4`,
    `/videos-mobile/hero-2-mobile.mp4`
];

let index = 0;
let isChangingVideo = false;

// Log environment info
console.log("Environment:", isLocalDevelopment ? "Local Development" : "Production");
console.log("Base path:", basePath);
console.log("First desktop path:", desktopMovieList[0]);
console.log("First mobile path:", mobileMovieList[0]);

nextButton.addEventListener('click', function() {
    // Prevent multiple rapid clicks
    if (isChangingVideo) return;
    isChangingVideo = true;
    
    // Increment index with wrap-around
    index = (index + 1) % desktopMovieList.length;
    
    // Update sources based on device
    if (window.innerWidth <= 768) {
        // Mobile - update both sources
        const sources = video.getElementsByTagName('source');
        sources[0].src = mobileMovieList[index];
        sources[1].src = desktopMovieList[index];
        console.log("Loading mobile video:", mobileMovieList[index]);
    } else {
        // Desktop - just use desktop sources
        const sources = video.getElementsByTagName('source');
        sources[1].src = desktopMovieList[index];
        console.log("Loading desktop video:", desktopMovieList[index]);
    }
    
    // Reset the video to load new source
    video.load();
    
    // Play after loading with better error handling
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Video started playing successfully
                isChangingVideo = false;
            })
            .catch(error => {
                console.error("Video play error:", error);
                isChangingVideo = false;
            });
    } else {
        // Older browsers might not return a promise
        setTimeout(() => { isChangingVideo = false; }, 1000);
    }
});