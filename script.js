const apiKey = "AIzaSyB_hbfD4Z6lC0neHeRqyeUM-D_NSc2sRqA";
let nextPageToken = null; // To handle pagination
let isFetching = false; // To prevent duplicate fetches

async function home() {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&maxResults=20&pageToken=${nextPageToken || ""}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    // Save the nextPageToken
    nextPageToken = data.nextPageToken || null;

    const container = document.querySelector(".container");

    data.items.map((video) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const viewCountFormatted = formatViews(video.statistics.viewCount);

        card.innerHTML = `
            <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" />
            <div class="info">
                <h2>${video.snippet.title}</h2>
                <p class="cTitle">${video.snippet.channelTitle}</p>
                <p>${viewCountFormatted + " Views"}</p>
            </div>`;
        card.addEventListener("click", () => {
            // Redirect to the video page with video ID
            window.location.href = `video.html?videoId=${video.id}`;
        });
        container.appendChild(card);
    });
}

home();

function formatViews(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M"; // Format for millions
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K"; // Format for thousands
    } else {
        return num.toString(); // For smaller numbers
    }
}

// Infinite scrolling for pagination
window.addEventListener("scroll", () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;

    if (scrollPosition >= pageHeight - 100 && nextPageToken && !isFetching) {
        fetchMoreVideos();
    }
});

async function fetchMoreVideos() {
    if (isFetching) {
        return;
    }
    isFetching = true;
    await home();
    isFetching = false;
}


document.querySelector(".search-button").addEventListener("click", (event) => {
    event.preventDefault(); 

    const query = document.querySelector(".search").value.trim();
    
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
});

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
        }, 5000); // 5 seconds timeout
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
document.addEventListener("DOMContentLoaded", function () {
    // Get all menu items
    const menuItems = document.querySelectorAll(".menu-item");

    // Get current page filename
    let currentPage = window.location.pathname.split("/").pop();
    
    // If the URL ends with a slash (e.g., "https://example.com/") then currentPage will be empty.
    // In that case, default to "index.html".
    if (!currentPage) {
        currentPage = "index.html";
    }

    // Remove active class from all menu items
    menuItems.forEach(item => item.classList.remove("active"));

    // For index.html, always mark the home menu item as active.
    // Ensure the href attribute in your HTML matches (e.g., "./index.html" or "/index.html").
    if (currentPage === "index.html") {
        const homeMenuItem = document.querySelector('.menu-item[href*="index.html"]');
        if (homeMenuItem) {
            homeMenuItem.classList.add("active");
            homeMenuItem.style.color = "red"; // Use lowercase "color"
        }
    } else {
        // For other pages, find the matching menu item by filename and mark it active.
        const activeMenuItem = document.querySelector(`.menu-item[href*="${currentPage}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add("active");
            activeMenuItem.style.color = "red";
        }
    }
});
