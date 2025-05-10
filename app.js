const nextButton = document.querySelector('.next-btn');
const video = document.querySelector('.hero-video');

const desktopMovieList = [
    'videos/hero-3.mp4',
    'videos/hero-4.mp4',
    'videos/hero-1.mp4',
    'videos/hero-2.mp4'
];
const mobileMovieList = [
    'videos/hero-3-mobile.mp4',
    'videos/hero-4-mobile.mp4',
    'videos/hero-1-mobile.mp4',
    'videos/hero-2-mobile.mp4'
];

// Determine if we're on mobile
const isMobile = window.innerWidth <= 768;

// Choose the right movie list
const movieList = isMobile ? mobileMovieList : desktopMovieList;

let index = 0;

nextButton.addEventListener('click', function(){

    index += 1
    video.src = movieList[index];

        if (index === 3){
            index = -1; 
        }
    
})