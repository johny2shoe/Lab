window.human = false;

var canvasEl = document.querySelector('.spores');
var ctx = canvasEl.getContext('2d');
var numberOfParticules = 100;
var pointerX = 0;
var pointerY = 0;
var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
var colors = ['#FC89BA','#FF74AF','#97F2B1','#FF7D2E']; //chnaged the color to only one
// var colors = ['#fc03d7', '#0703fc', '#03fc45', '#f8fc03'];

function setCanvasSize() {
  canvasEl.width = window.innerWidth *2;
  canvasEl.height = window.innerHeight *2;
  canvasEl.style.width = window.innerWidth + 'px';
  canvasEl.style.height = window.innerHeight + 'px';
  canvasEl.getContext('2d').scale(2, 2);
}

function updateCoords(e) {
  pointerX = e.clientX || e.touches[0].clientX;
  pointerY = e.clientY || e.touches[0].clientY;
}

function setParticuleDirection(p) {
  var angle = anime.random(0, 360) * Math.PI / 180;
  var value = anime.random(50, 180);
  var radius = [-1, 1][anime.random(0, 1)] * value;
  return {
    x: p.x + radius / Math.cos(angle),
    y: p.y + radius / Math.sin(angle)
  }
}

function createParticule(x,y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color = colors[anime.random(0, colors.length - 1)];
  p.radius = anime.random(16, 32);
  p.endPos = setParticuleDirection(p);
  p.draw = function() {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
  return p;
}

function createCircle(x,y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color = '#FFF';
  p.radius = 0.01;
  p.alpha = 0;
  p.lineWidth = 6;
  p.draw = function() {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.lineWidth = p.lineWidth;
    ctx.strokeStyle = p.color;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  return p;
}

function renderParticule(anim) {
  for (var i = 0; i < anim.animatables.length; i++) {
    anim.animatables[i].target.draw();
  }
}

function animateParticules(x, y) {
  var circle = createCircle(x, y);
  var particules = [];
  for (var i = 0; i < numberOfParticules; i++) {
    particules.push(createParticule(x, y));
  }
  anime.timeline().add({
    targets: particules,
    x: function(p) { return p.endPos.x; },
    y: function(p) { return p.endPos.y; },
    radius: 0.001, //changing size of the circles
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    update: renderParticule
  })
    .add({
    targets: circle,
    radius: anime.random(80, 160),
    lineWidth: 0,
    alpha: {
      value: 0,
      easing: 'linear',
      duration: anime.random(600, 800),  
    },
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    update: renderParticule,
    offset: 0
  });
}

var render = anime({
  duration: Infinity,
  update: function() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }
});

document.addEventListener(tap, function(e) {
  window.human = true;
  render.play();
  updateCoords(e);
  animateParticules(pointerX, pointerY);
}, false);

var centerX = window.innerWidth /2;
var centerY = window.innerHeight / 2;

function autoClick() {
  if (window.human) return;
  animateParticules(
    anime.random(centerX-50, centerX+50), 
    anime.random(centerY-50, centerY+50)
  );
  anime({duration: 100}).finished.then(autoClick);
}

autoClick();
setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);


///Sound on click

//Step 1 play sounds through howler ---finished
//Step 2 sounds on click of image icons ---finished
//Step 3 pause current sounds when playing new ones ---finished
//do i need an array?
//Step 4 pause current song when logo is clicked, prevent repeating songs

var songs = {
  dog: new Howl({
    src: 'audio/Baby_Tears_Blues.mp3'
    // html5:true,
  }),
  cake: new Howl({
    src: 'audio/Walk_a_Begonia.mp3'
  }),
  type: new Howl({
    src: 'audio/Swingin_Spathiphyllums.mp3'
  }),
  history: new Howl({
    src: 'audio/Symphony_Spider_Plant.mp3'
  }),
  logo: new Howl({
    src: 'audio/Plantasia.mp3',
    
  }),
};


document.getElementById("dog").onclick = function() {
  console.log('dogisplaying');
  // getAudioContext().resume();
  songs.cake.pause();
  songs.logo.pause();
  songs.history.pause();
  songs.type.pause();
  songs.dog.play();
  if (document.getElementById("barb").style.opacity = "0%") {
    document.getElementById("barb").style.opacity = "100%";
  } else {
    document.getElementById("barb").style.opacity = "0%";
  }
}

document.getElementById("cake").onclick = function() {
  console.log('cakeisplaying');
  songs.dog.pause();
  songs.logo.pause()
  songs.history.pause();
  songs.type.pause();
  songs.cake.play();
}

document.getElementById("type").onclick = function() {
  console.log('isplaying');
  songs.dog.pause();
  songs.cake.pause();
  songs.logo.pause();
  songs.history.pause();
  songs.type.play();
}

document.getElementById("history").onclick = function() {
  console.log('isplaying');
  songs.dog.pause();
  songs.cake.pause();
  songs.logo.pause();
  songs.type.pause();
  songs.history.play();
}

document.getElementById("logo").onclick = function() {
  console.log('logoisplaying');
  songs.dog.pause();
  songs.cake.pause();
  songs.history.pause();
  songs.type.pause();;
  if (songs.logo.pause()){
    songs.logo.play();
  } else {
    songs.logo.pause();
  }
}