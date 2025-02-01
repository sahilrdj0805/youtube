const apiKey = "AIzaSyCooBA52qMDmlPs15fs2-epsI3MhCB4luI";
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q");

async function search() {
    const url =  `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&q=${query}&key=${apiKey}`;
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);



    const container = document.querySelector(".container");

    result.items.forEach((data)=>{
                const videoId = data.id.videoId || data.id;
        
        const card=document.createElement("div")
        card.classList.add("card")
        card.innerHTML=`
        <img src="${data.snippet.thumbnails.high.url}">
        <div class="info">
        <h2>${data.snippet.title}</h2>
        <p>${data.snippet.channelTitle}</p>
        </div>
        
        `
        card.addEventListener("click", () => {
            window.location.href = `video.html?videoId=${videoId}`;
        });
        
        container.appendChild(card);
        });
          
         
        }
        search(query);
        




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