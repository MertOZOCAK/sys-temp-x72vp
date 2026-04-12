let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let wave = document.getElementById('wave');
let randomIcon = document.querySelector('.random-track');
let repeatIcon = document.querySelector('.repeat-track');

let curr_track = document.createElement('audio');
let curr_video = document.getElementById('curr_video'); // Video elementi
let videoMsg = document.getElementById('video-error-msg');
let player_div = document.querySelector('.player');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let isRepeat = false;
let isVideoMode = false; // Video mod kontrolü
let updateTimer;
let track_history = [];

const music_list = [
    { img: '../images/logo.png', name: 'Ah Ellerim Kırılaydı', artist: 'Tuğçe Kandemir', music: '../music/stay.mp3' },
    { img: '../images/logo.png', name: 'Yol Arkadaşım', artist: 'Bayhan Gürhan', music: '../music/YolArkadaşım.mp3' },
    { img: '../images/logo.png', name: 'Salını Salını', artist: 'Bayhan Gürhan', music: '../music/SalınıSalını.mp3' },
    { img: '../images/logo.png', name: 'Tiryakinim', artist: 'Bayhan Gürhan', music: '../music/Tiryakinim.mp3' },
    { img: '../images/logo.png', name: 'Sar Zamanımızı Geriye', artist: 'Amo988', music: '../music/SarZamanımızıGeriye.mp3' },
    { img: '../images/logo.png', name: 'Aldanırım', artist: 'Sıla Şahin, Samet Kardeşler', music: '../music/Aldanırım.mp3' },
    { img: '../images/logo.png', name: 'Görmedim Sen Gibi', artist: 'Bilal Sonses', music: '../music/GörmedimSenGibi.mp3' },
    { img: '../images/logo.png', name: 'Dön Diyemem', artist: 'Bilal Sonses', music: '../music/DönDiyemem.mp3' },
    { img: '../images/logo.png', name: 'İçimden Gelmiyor', artist: 'Bilal Sonses', music: '../music/İçimdenGelmiyor.mp3' },
    { img: '../images/logo.png', name: 'Lan', artist: 'Zeynep Bastık', music: '../music/Lan.mp3' },
    { img: '../images/logo.png', name: 'Seni Düşündüm', artist: 'Çağla, Doğu Swag', music: '../music/Seni Düşündüm.mp3' },
    { img: '../images/logo.png', name: 'Şehrin Yolu', artist: 'Feride Hilal Akın, İlyas Yalçıntaş', music: '../music/ŞehrinYolu.mp3' },
    { img: '../images/logo.png', name: 'Sana Yıldızları Ödediğimden', artist: 'Bengü Peker', music: '../music/SanaYıldızlarıÖdediğimden.mp3' },
    { img: '../images/logo.png', name: 'Sensizlik', artist: 'Shahlo Azimova', music: '../music/Sensizlik.mp3' },
    { img: '../images/fallingdown.jpg', name: 'Falling Down', artist: 'Wid Cards', music: '../music/fallingdown.mp3' },
    { img: '../images/logo.png', name: 'İçimdeki Sen', artist: 'Bilal Sonses, Tuğçe Kandemir', music: '../music/İçimdekiSen.mp3' },
    { img: '../images/ratherbe.jpg', name: 'Rather Be', artist: 'Clean Bandit', music: '../music/Rather Be.mp3' }
];

loadTrack(track_index);

function loadTrack(index) {
    clearInterval(updateTimer);
    resetValues();
    
    curr_track.src = music_list[index].music;
    curr_track.load();

    // Hızı koru
    let speed = parseFloat(document.querySelector('.speed-btn')?.textContent) || 1;
    curr_track.playbackRate = speed;

    curr_video.style.display = 'none';
    videoMsg.style.display = 'none';

    track_art.style.backgroundImage = "url(" + music_list[index].img + ")";
    track_name.textContent = music_list[index].name;
    track_artist.textContent = music_list[index].artist;
    now_playing.textContent = (index + 1) + " / " + music_list.length + " ŞARKIDA ÇALINIYOR";

    updateTimer = setInterval(setUpdate, 1000);
    
    curr_track.onended = () => { isRepeat ? (loadTrack(track_index), playTrack()) : nextTrack(); };
    if (isVideoMode) setMediaType('video');
    renderPlaylist();
}

function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playpauseTrack() { isPlaying ? pauseTrack() : playTrack(); }

function playTrack() {
    curr_track.play();
    isPlaying = true;
    if (!isVideoMode) track_art.classList.add('neon-glow');
    else track_art.classList.remove('neon-glow');
    wave.classList.add('loader');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('neon-glow');
    wave.classList.remove('loader');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
    track_history.push(track_index);
    if (isRandom) {
        let new_index;
        do { new_index = Math.floor(Math.random() * music_list.length); } 
        while (new_index === track_index && music_list.length > 1);
        track_index = new_index;
    } else {
        track_index = (track_index < music_list.length - 1) ? track_index + 1 : 0;
    }
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    if (track_history.length > 0) { track_index = track_history.pop(); } 
    else { track_index = (track_index > 0) ? track_index - 1 : music_list.length - 1; }
    loadTrack(track_index);
    playTrack();
}

function seekTo() {
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

function setVolume() {
    curr_track.volume = volume_slider.value / 100;
}

// --- YENİ EKLENEN/GERİ GELEN FONKSİYONLAR ---

function setSpeed(speed) {
    curr_track.playbackRate = speed;
    document.querySelector('.speed-btn').textContent = speed + 'x';
    toggleSpeedMenu();
}

function toggleSpeedMenu() {
    document.getElementById('speed-options').classList.toggle('show');
}

function setMediaType(type) {
    const btns = document.querySelectorAll('.type-btn');
    const videoMsg = document.getElementById('video-error-msg');
    btns.forEach(b => b.classList.remove('active'));
    
    if (type === 'video') {
        isVideoMode = true;
        btns[1].classList.add('active');
        player_div.classList.add('video-mode');
        curr_video.style.display = 'none';
        videoMsg.style.display = 'flex';
        if (isPlaying) curr_track.play();
    } else {
        isVideoMode = false;
        btns[0].classList.add('active');
        player_div.classList.remove('video-mode');
        curr_video.style.display = 'none';
        videoMsg.style.display = 'none';
        if (isPlaying) curr_track.play();
    }
}

function randomTrack() { isRandom = !isRandom; randomIcon.classList.toggle('randomActive', isRandom); }
function repeatTrack() { isRepeat = !isRepeat; repeatIcon.classList.toggle('repeatActive', isRepeat); }
function togglePlaylist() { document.getElementById('playlist-panel').classList.toggle('open'); }

function renderPlaylist() {
    const list = document.getElementById('playlist-items');
    list.innerHTML = music_list.map((track, i) => `
        <li class="playlist-item ${i === track_index ? 'active' : ''}" onclick="playFromList(${i})">
            <img src="${track.img}">
            <div><b>${track.name}</b></div>
        </li>
    `).join('');
}

function playFromList(index) {
    if(index !== track_index) track_history.push(track_index);
    track_index = index;
    loadTrack(track_index);
    playTrack();
}

function setUpdate() {
    let active = curr_track;
    
    if (!isNaN(active.duration)) {
        seek_slider.value = active.currentTime * (100 / active.duration);
        
        let curM = Math.floor(active.currentTime / 60);
        let curS = Math.floor(active.currentTime % 60);
        let durM = Math.floor(active.duration / 60);
        let durS = Math.floor(active.duration % 60);
        
        curr_time.textContent = (curM < 10 ? "0" + curM : curM) + ":" + (curS < 10 ? "0" + curS : curS);
        total_duration.textContent = (durM < 10 ? "0" + durM : durM) + ":" + (durS < 10 ? "0" + durS : durS);
    }
}