const apiKey = "AIzaSyB_hbfD4Z6lC0neHeRqyeUM-D_NSc2sRqA";
const urlParams = new URLSearchParams(window.location.search);
let videoId = urlParams.get("videoId");
console.log(videoId);

if (videoId) {
    // Embed the video with autoplay
    const iframe = document.getElementById("video-player");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1`;
}

// Function to fetch video title and details
async function title(videoId) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);

    if (result.items) {
        const videoTitle = document.getElementById("video-title");
        const views = document.getElementById("views");
        const likes = document.getElementById("likes");
        const viewFormat=formatViews(result.items[0].statistics.viewCount)
        const likeFormat=formatLikes(result.items[0].statistics.likeCount)
        // Update video title and stats
        videoTitle.textContent = result.items[0].snippet.title;
        views.innerHTML = `<p class="Format">Views: ${viewFormat}</p>`;
        likes.innerHTML = `<p class="Format">Likes: ${likeFormat}</p>`;
    }

    const channelId = result.items[0].snippet.channelId;
    fetchRelatedVideos(channelId);
}
function formatViews(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M"; // Format for millions
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K"; // Format for thousands
    } else {
        return num.toString(); // For smaller numbers
    }
}
function formatLikes(nums) {
    if (nums >= 1000000) {
        return (nums / 1000000).toFixed(1) + "M"; // Format for millions
    } else if (nums >= 1000) {
        return (nums / 1000).toFixed(1) + "K"; // Format for thousands
    } 
}

// Function to fetch comments
async function request(videoId) {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=53&videoId=${videoId}&key=${apiKey}`;
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    const commentsSection = document.querySelector(".comments-section");
    commentsSection.innerHTML = ''; // Clear previous comments

    result.items.forEach((data) => {
        const comment = document.createElement("div");
        comment.classList.add("comment-list");
        comment.innerHTML = `
            <img src="${data.snippet.topLevelComment.snippet.authorProfileImageUrl}" alt="Profile Picture"/>
            <div class="info">
                <h3>${data.snippet.topLevelComment.snippet.authorDisplayName}</h3>
                <p>${data.snippet.topLevelComment.snippet.textDisplay}</p>
            </div>
        `;
        commentsSection.appendChild(comment);
    });
}

// Function to fetch related videos
async function fetchRelatedVideos(channelId) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&key=${apiKey}`;
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    const recommendations = document.querySelector(".recommendations");
    recommendations.innerHTML = ''; // Clear previous recommendations

    result.items.forEach((data) => {
        const recommendationItem = document.createElement("div");
        recommendationItem.classList.add("recommendation-item");
        recommendationItem.innerHTML = `
            <img src="${data.snippet.thumbnails.high.url}" alt="Recommendation Thumbnail"/>
            <div class="info">
                <h4>${data.snippet.title}</h4>
                <p>${data.snippet.channelTitle}</p>
            </div>
        `;

        // Add click event listener to recommendation
        recommendationItem.addEventListener('click', function () {
            const newVideoId = data.id.videoId;
            updateVideo(newVideoId);
        });

        recommendations.appendChild(recommendationItem);
    });
}

// Function to update the video, comments, and details based on the new video ID
function updateVideo(newVideoId) {
    videoId = newVideoId; // Update the current video ID

    // Update the iframe to the new video
    const iframe = document.getElementById("video-player");
    iframe.src = `https://www.youtube.com/embed/${newVideoId}?autoplay=1&controls=1&modestbranding=1`;

    // Reload the video details and comments
    title(newVideoId);
    request(newVideoId);
}

document.querySelector(".comment").addEventListener("click", () => { 
    document.querySelector(".comments-section").classList.toggle("show");
   
});




document.querySelector(".search-button").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission (important!)

    const query = document.querySelector(".search").value.trim();

    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
});

// Initial calls to load video title and comments
request(videoId);
title(videoId);


let voiceBtn = document.querySelector(".voice-btn");
let voiceModal = document.getElementById("voice-modal");
let voiceText = document.getElementById("voice-text");

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (speechRecognition) {
    let recognition = new speechRecognition();


    function speak(text) {
        let text_speak = new SpeechSynthesisUtterance(text);
        text_speak.rate = 0.9;
        text_speak.pitch = 0.8;
        text_speak.volume = 1;
        text_speak.lang = "en-US"; // Set to Hindi if needed: "hi-IN"
        window.speechSynthesis.speak(text_speak);
    }

    let timeout;
    let inactivityTimeout;

    recognition.onstart = function () {
        voiceModal.style.display = "flex";
        voiceText.innerText = "Listening...";

        // Set a timeout to check if user speaks within 5 seconds
        timeout = setTimeout(() => {
            voiceText.innerText = "Can't hear, try again.";
            speak("Can't hear, try again.");
            recognition.stop();
        }, 5000);
        
        inactivityTimeout = setTimeout(() => {
            voiceModal.style.display = 'none'; // Close the popup
          }, 7000);
    };

    recognition.onresult = function (event) {
        clearTimeout(timeout); // Clear timeout if speech is detected

        let transcript = event.results[0][0].transcript;
        voiceText.innerText = `Searching: "${transcript}"`;

        speak(`Searching for ${transcript} on YouTube.`);

        setTimeout(() => {
            voiceModal.style.display = "none";
            window.location.href = `search.html?q=${encodeURIComponent(transcript)}`;
        }, 1000);
    };

    recognition.onspeechend = function () {
        clearTimeout(timeout);
        recognition.stop();
    };

    recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        voiceText.innerText = "Error: Can't hear, try again.";
        speak("Can't hear, try again.");
        recognition.stop();
    };

    voiceBtn.addEventListener("click", () => {
        console.log("Mic button clicked");
        try {
            recognition.start();
        } catch (error) {
            console.error("Error starting speech recognition:", error);
        }
    });
} else {
    console.error("Speech Recognition API not supported in this browser.");
    alert("Your browser does not support speech recognition.");
}
