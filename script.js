console.log('Lets write JavaScript');

let currFolder;

function secondsToMinutesSeconds(seconds) {
        if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

let songs; // Declaring songs globally
let currentSong = new Audio();

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href); // Push the full URL of the song
        }
    }


      // Show all songs in the playlist
      let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
      songUL.innerHTML = "";
      for (const song of songs) {
          // Extract the filename from the URL
          const filename = song.split("/").pop();
          // Replace '%20' with space in the filename
          const formattedFilename = filename.replaceAll("%20", " ");
          songUL.innerHTML += `<li><img class="invert" width="34" src="img/music.svg" alt="">
                              <div class="info">
                                  <div>${formattedFilename}</div>
                                  <div>Neeraj</div>
                              </div>
                              <div class="playnow">
                                  <span>Play Now</span>
                                  <img class="invert" src="img/play.svg" alt="">
                              </div></li>`;
      }
  
      // Attach an event listener to each song
      Array.from(songUL.getElementsByTagName("li")).forEach(e => {
          e.addEventListener("click", element => {
              playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
          });
      });
    return songs;
}

const playMusic = (track) => {
    let audioUrl = track.split('/').pop(); // Extract the filename from the full URL
    currentSong.src = `${currFolder}/` + audioUrl; // Construct the correct URL for the audio file
    currentSong.play();
    play.src = "img/pause.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(audioUrl);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

      
};

async function displayAlbums(){
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
         if(e.href.includes("/songs/") && !e.href.includes(".htaccess")){
           let folder = e.href.split("/").slice(-2)[1]
           //get the meta data of folder
           let a = await fetch(`/songs/${folder}/info.json`);
          let response = await a.json();
          console.log(response)
          cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
          <div  class="play">

             <svg width="400px" height="400px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <!-- Circular background -->
                  <circle cx="200" cy="200" r="200" fill="#1fdf64" />

                  <!-- SVG Path -->
                  <g transform="translate(72, 72)">
                      <path
                          d="M59 61.922c0-9.768 13.016-15.432 22.352-11.615 10.695 7.017 101.643 58.238 109.869 65.076 8.226 6.838 10.585 17.695-.559 25.77-11.143 8.074-99.712 60.203-109.31 64.73-9.6 4.526-21.952-1.632-22.352-13.088-.4-11.456 0-121.106 0-130.873zm13.437 8.48c0 2.494-.076 112.852-.216 115.122-.23 3.723 3 7.464 7.5 5.245 4.5-2.22 97.522-57.704 101.216-59.141 3.695-1.438 3.45-5.1 0-7.388C177.488 121.952 82.77 67.76 80 65.38c-2.77-2.381-7.563 1.193-7.563 5.023z"
                          stroke="#000000" fill-rule="evenodd" />
                  </g>
              </svg>
          </div>
          <img src="/songs/${folder}/cover.jpg" alt="">
          <h2>${response.title}</h2>
          <p>${response.description}</p>

      </div>`
        }
    }
        // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
                console.log("Fetching Songs")
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
                playMusic(songs[0])
    
            })
        })
    
}

async function main() {
    // Get the list of all the songs
    songs = await getSongs("/songs/ncs");
    // console.log(songs);

    //display all the albums on the page
    displayAlbums()

    var audio = new Audio(songs[0]);
    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    });



   


// Attach an event listener to play, next and previous
play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    else {
        currentSong.pause()
        play.src = "img/play.svg"
    }
})

// Add an event listener to previous
document.getElementById("previous").addEventListener("click", () => {
    currentSong.pause(); // Pause the current song
    let index = songs.indexOf(currentSong.src); // Find the index of the current song in the songs array

    // Check if there is a previous song available
    if (index > 0) {
        let previousSong = songs[index - 1]; // Get the previous song
        playMusic(previousSong); // Play the previous song
    }
});

// Add an event listener to next button
document.getElementById("next").addEventListener("click", () => {
    currentSong.pause(); // Pause the current song
    let index = songs.indexOf(currentSong.src); // Find the index of the current song in the songs array

    // Check if there is a next song available
    if (index < songs.length - 1) {
        let nextSong = songs[index + 1]; // Get the next song
        playMusic(nextSong); // Play the next song
    }
});







// Listen for timeupdate event
currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
})

// Add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
})

// Add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})

// Add an event listener for close button
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
})


// Add an event listener to volume button
document.querySelector(".volume img").addEventListener("click", () => {
    if (currentSong.volume > 0) {
        // Mute the audio
        currentSong.volume = 0;
        document.querySelector(".volume img").src = "img/mute.svg"; // Change volume icon to mute
    } else {
        // Unmute the audio
        currentSong.volume = 1;
        document.querySelector(".volume img").src = "img/volume.svg"; // Change volume icon to normal
    }
});

// Add an event to volume range input
document.querySelector(".range input").addEventListener("input", (e) => {
    console.log("Setting volume to", e.target.value, "/ 100");
    currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume > 0) {
        document.querySelector(".volume img").src = "img/volume.svg"; // Change volume icon to normal
    } else {
        document.querySelector(".volume img").src = "img/mute.svg"; // Change volume icon to mute
    }
});







    }    



main();









// async function getSongs() {
    //     let a = await fetch("http://127.0.0.1:5500/songs/")
    //     let response = await a.text();
    //     let div = document.createElement("div")
    //     div.innerHTML = response;
    //     let as = div.getElementsByTagName("a")
    //     let songs = []
    //     for (let index = 0; index < as.length; index++) {
        //         const element = as[index];
        //         if (element.href.endsWith(".mp3")) {
            //             songs.push(element.href); // Push the full URL of the song
            //         }
            //     }
            //     return songs
            // }
            
            // async function main() {
                //     let songs = await getSongs()
                //     console.log(songs)
                
                
                // main()
                
                
                
                // // Show all the songs in the playlist
                // let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
                // songUL.innerHTML = ""
                // for (const song of songs) {
                    //     songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt="">
                    //                         <div class="info">
                    //                             <div> ${song.replaceAll("%20", " ")}</div>
                    //                             <div>Harry</div>
                    //                         </div>
                    //                         <div class="playnow">
                    //                             <span>Play Now</span>
                    //                             <img class="invert" src="img/play.svg" alt="">
                    //                         </div> </li>`;
                    // }
                    
                    
                    //     return songs
                    // }
                    
                    // const playMusic = (track, pause = false) => {
                        //     currentSong.src = `/${currFolder}/` + track
                        //     if (!pause) {
                            //         currentSong.play()
                            //         play.src = "img/pause.svg"
                            //     }
                            //     document.querySelector(".songinfo").innerHTML = decodeURI(track)
                            //     document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
                            
                            
// }

// async function displayAlbums() {
    //     console.log("displaying albums")
    //     let a = await fetch(`/songs/`)
    //     let response = await a.text();
    //     let div = document.createElement("div")
    //     div.innerHTML = response;
    //     let anchors = div.getElementsByTagName("a")
    //     let cardContainer = document.querySelector(".cardContainer")
    //     let array = Array.from(anchors)
    //     for (let index = 0; index < array.length; index++) {
        //         const e = array[index]; 
        //         if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            //             let folder = e.href.split("/").slice(-2)[0]
            //             // Get the metadata of the folder
            //             let a = await fetch(`/songs/${folder}/info.json`)
            //             let response = await a.json(); 
            //             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            //             <div class="play">
            //                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            //                     xmlns="http://www.w3.org/2000/svg">
            //                     <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
            //                         stroke-linejoin="round" />
            //                 </svg>
            //             </div>
            
            //             <img src="/songs/${folder}/cover.jpg" alt="">
            //             <h2>${response.title}</h2>
            //             <p>${response.description}</p>
            //         </div>`
            //         }
            //     }
            
                    
                    
                    // async function main() {
                        //     // Get the list of all the songs
                        //     await getSongs("songs/ncs")
                        //     playMusic(songs[0], true)
                        
                        //     // Display all the albums on the page
//     await displayAlbums()






// Add an event listener to previous
// previous.addEventListener("click", () => {
    //     currentSong.pause()
    //     console.log("Previous clicked")
    //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //     if ((index - 1) >= 0) {
        //         playMusic(songs[index - 1])
        //     }
        // })
        
        // Add an event listener to next
        // next.addEventListener("click", () => {
            //     currentSong.pause()
            //     console.log("Next clicked")
            
            //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            //     if ((index + 1) < songs.length) {
                //         playMusic(songs[index + 1])
                //     }
                // })
                
                
                // Add event listener to mute the track
                // document.querySelector(".volume>img").addEventListener("click", e=>{ 
                    //     if(e.target.src.includes("volume.svg")){
                        //         e.target.src = e.target.src.replace("volume.svg", "mute.svg")
                        //         currentSong.volume = 0;
                        //         document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
                        //     }
                        //     else{
                            //         e.target.src = e.target.src.replace("mute.svg", "volume.svg")
                            //         currentSong.volume = .10;
                            //         document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
                            //     }
                            
                            // })
                            
                            
                            
                            
                            
                            // }
                            
                            // main() 
                            // // Add an event to volume
                            // document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
                            //     console.log("Setting volume to", e.target.value, "/ 100")
                            //     currentSong.volume = parseInt(e.target.value) / 100
                            //     if (currentSong.volume >0){
                            //         document.querySelector(".volume").src = document.querySelector(".volume").src.replace("mute.svg", "volume.svg")
                            //     }
                            // })