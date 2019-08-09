var fullscreen = false;
var drawing = true;
var MAX_EX_BUFFER_SIZE = 400;
var MAX_BK_BUFFER_SIZE = 150;
var MAX_STARS_BUFFER_SIZE = 10;
var modes = {
  festa: false,
  acid: false,
  rainbowed: false,
  mlg: false,
  debug: false
};

var particlesShowing = {
  bk: true,
  ex: true,
  stars: false
};


var particlesGPS = {
  ex: 1,
  bk:1
};
//var EX_PARTICLES_GPS = 9;
var menuOpened = false;

/**
 * RAINBOW
*/

var size    = 256;
var rainbow = new Array(size);

for (var i=0; i<size; i++) {
  var red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
  var blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
  var green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg

  rainbow[i] = [parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16)];
}

function sin_to_hex(i, phase) {
  var sin = Math.sin(Math.PI / size * 2 * i + phase);
  var int = Math.floor(sin * 127) + 128;
  var hex = int.toString(16);

  return hex.length === 1 ? "0"+hex : hex;
}

/**
 * END RAINBOW
*/

/* An "exploding" particle effect that uses circles */
var ExplodingParticle = function() {
  // Set how long we want our particle to animate for
  this.animationDuration = 1000; // in ms

  // Set the speed for our particle
  this.speed = {
    x: -5 + Math.random() * 10,
    y: -5 + Math.random() * 10
  };
  
  // Size our particle
  this.radius = 5 + Math.random() * 10;
  this.originRadius = this.radius;
  
  // Set a max time to live for our particle
  
  // This function will be called by our animation logic later on
  this.draw = ctx => {
    let p = this;

    if(this.radius > 0) {
      // Draw a circle at the current location
      ctx.beginPath();
      ctx.arc(p.startX, p.startY, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + this.rgbArray[0] + ',' + this.rgbArray[1] + ',' + this.rgbArray[2] + ", 1)";
      ctx.fill();
      
      // Update the particle's location and life
      p.remainingLife--;
      p.radius -= 0.25;
      p.startX += p.speed.x;
      p.startY += p.speed.y;
    } else { //if you can't see the particle it returns to the origin position
      p.startX = p.originX;
      p.startY = p.originY;
      p.radius = p.originRadius;
      p.speed = {
        x: -5 + Math.random() * 10,
        y: -5 + Math.random() * 10
      };
    }
  };
};

var BackGroundParticle = function() {
  // Set how long we want our particle to animate for
  this.animationDuration = 3000; // in ms
  

  // Set the speed for our particle
  this.speed = {
    x: -5 + Math.random() * 10,
    y: -5 + Math.random()
  };
  
  // Size our particle
  this.radius = 20 + Math.random() * 50;
  this.originRadius = this.radius;
  
  
  // This function will be called by our animation logic later on
  this.draw = ctx => {
    let p = this;

    if(this.radius > 0) {
      // Draw a circle at the current location
      ctx.beginPath();
      ctx.arc(p.startX, p.startY, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + this.rgbArray[0] + ',' + this.rgbArray[1] + ',' + this.rgbArray[2] + ", 0.5)";
      ctx.fill();
      // Update the particle's location and life
      p.radius -= 0.25;
      // if(p.radius <= 0) { //remove if finidhed
      //   bkParticles.filter(this);
      // }
      if(p.randDir <= 0){
        p.startX += ((Math.cos((Date.now() + p.randPlusDir)/100)*4));
        // console.log(p.randDir);
      } else {
        p.startX += ((Math.cos((Date.now() + p.randPlusDir)/100)*4)*-1);
      }
      p.startY += p.speed.y;
    } else {
      p.startY = p.originY;
      p.startX = Math.floor((Math.random() * window.innerWidth) + 1);
      p.radius = p.originRadius;
      p.randDir = Math.floor((Math.random() * 3)  + -1);
      p.randPlusDir = Math.floor((Math.random() * 1000)  + 1);
      p.speed = {
        x: -5 + Math.random() * 10,
        y: -5 + Math.random()
      };
    }
  };
};

var FollowingText = function () {
  var startX;
  var startY;
  this.draw = function (ctx, info) {
    let p = this;
    this.startX = p.el.startX;
    this.startY = p.el.startY;
    ctx.fillText(p.startX, p.startY, info);
  };
};


/**
 * function definitions
*/

var particles = [];
var bkParticles = [];
var stars = [];
var debugTexts = [];
var rainbowPtr = 0;
function createParticleAtPointEX(x, y, colorData) {
  let particle = new ExplodingParticle();
  particle.rgbArray = colorData;
  particle.startX = x;
  particle.startY = y;
  particle.originX = x;
  particle.originY = y;
  // particle.newX = x;
  // particle.newY = y;
  particle.startTime = Date.now();
  
  particles.push(particle);
  
  return particle;
}

function createParticleAtPointBK(x, y, colorData) {
  let particle = new BackGroundParticle();
  particle.rgbArray = colorData;
  // x not used
  particle.startX = Math.floor((Math.random() * window.innerWidth) + 1);
  particle.startY = y;
  //particle.originX = x;
  particle.originY = y;
  particle.randDir = Math.floor((Math.random() * 3)  + -1);
  particle.randPlusDir = Math.floor((Math.random() * 1000)  + 1);
  particle.startTime = Date.now();
  
  bkParticles.push(particle);
  
  return particle;
}

function createStar() {
  // letar = near();
  // tmpstar.x = me = Date.now();
  
  // stars.pu¡pstar);
  
  // ret pstar;
}

function showFBTDisplay(visible){
  if(visible) { //if is fullscreen
    document.getElementById("fbtdiv").style.display = "block"; //show button
  } else {
    document.getElementById("fbtdiv").style.display = "none"; //hide button
  }
}

function showCanvasDisplay(visible){
  if(visible) { //if is fullscreen
    document.getElementById("dcanv").style.display = "block"; //show canvas
  } else {
    document.getElementById("dcanv").style.display = "none"; //hide canvas
  }
}

var c = document.getElementById("dcanv");
var ctx = c.getContext("2d");

var Mlogo = document.createElement("img");
Mlogo.src = "MLogo.png";
var logoSize = 200;

function initCanvas() {
  console.log("inited");
  
  /**
   * RESET VARS FOR A COOL CUL
   */
  particles = [];
  bkParticles = [];
  debugTexts = [];
  
  /**
   * Start initing
   */
  
  var drawing = true;
  
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  
  /**
   * draw gradient
  */
  
  var bkGrd = ctx.createRadialGradient(750.000, 750.000, 10.000, 1500.000, 650.000, 1500.000);
  //from var bkGrd = ctx.createRadialGradient(150.000, 750.000, 10.000, 1100.000, 650.000, 1500.000);
  // tom             ctx.createRadialGradient(750.000, 750.000, 10.000, 1500.000, 650.000, 1500.000);
  bkGrd.addColorStop(0.026, 'rgba(0, 0, 0, 1.000)'); // Change this (first val) for the animation
  bkGrd.addColorStop(1.000, 'rgba(25, 25, 25, 1.000)');
  
  ctx.fillStyle = bkGrd;
  ctx.fillRect(0,0,c.width, c.height);
  
   /**
   * draw image
  */
  // Mlogo.style.position = "absolute";
  // var MlogolLoaded = false;
  // document.getElementById("drawing").appendChild(Mlogo);
  Mlogo.onload = function() {
    MlogoLoaded = true;
    ctx.drawImage(Mlogo, ((window.innerWidth/2)-(logoSize/2)), ((window.innerHeight/2)-(logoSize/2)), logoSize, logoSize);
    // window.requestAnimationFrame(updateDraw);
  };
  
  //start making particles async
  window.setTimeout(createParticlesAsync, 0);
  
  window.requestAnimationFrame(updateDraw);

}

function createParticlesAsync(){
  
  if(particlesShowing.ex){
    if(particles.length < MAX_EX_BUFFER_SIZE){
      for(var i = 0; i < particlesGPS.ex; i++) {
          if(modes.rainbowed){
            if(rainbowPtr < 255) {
              rainbowPtr++;
            } else {
              rainbowPtr = 0;
            }
            createParticleAtPointEX((window.innerWidth/2),(window.innerHeight/2),rainbow[rainbowPtr]);
          } else {
            createParticleAtPointEX((window.innerWidth/2),(window.innerHeight/2),EXPPartColors);
          }
        }
      }
    }
    if(particlesShowing.bk){
      if(bkParticles.length < MAX_BK_BUFFER_SIZE){
        for(var i = 0; i < particlesGPS.bk; i++){
          if(modes.festa){
            createParticleAtPointBK((window.innerWidth/2),(window.innerHeight + 50),[Math.floor((Math.random() * 255)  + 1),Math.floor((Math.random() * 255)  + 1),Math.floor((Math.random() * 255)  + 1)]);
          } else if (modes.debug) {
            var tmpp = createParticleAtPointBK((window.innerWidth/2),(window.innerHeight + 50),partColors);
            var tmpt = new FollowingText();
            tmpt.el = tmpp;
            debugTexts.push(tmpt);
          } else {
            createParticleAtPointBK((window.innerWidth/2),(window.innerHeight + 50),partColors);
          }
        }
      }
    }
    if(particlesShowing.stars) {
      if(stars.length < MAX_STARS_BUFFER_SIZE) {
        for(var i = 0; i < MAX_STARS_BUFFER_SIZE; i++) {
          createStar();
        }
      }
    }
  // console.log("bk particles:", (bkParticles.length < MAX_BK_BUFFER_SIZE), "particles:", (particles.length < MAX_EX_BUFFER_SIZE), "junts:", ((bkParticles.length < MAX_BK_BUFFER_SIZE)||(particles.length < MAX_EX_BUFFER_SIZE)));
  
  if((bkParticles.length < MAX_BK_BUFFER_SIZE) || (particles.length < MAX_EX_BUFFER_SIZE)){
    window.setTimeout(createParticlesAsync, 10);
  }
}


var yPlusDB = 0;
var partColors = [0,164,255];
EXPPartColors = [255,255,255];
function updateDraw(){
  if(drawing) {
    /**
     * draw gradient
    */
    
    var bkGrd = ctx.createRadialGradient(750.000, 750.000, 10.000, 1500.000, 650.000, 1500.000);
    //from var bkGrd = ctx.createRadialGradient(150.000, 750.000, 10.000, 1100.000, 650.000, 1500.000);
    // tom             ctx.createRadialGradient(750.000, 750.000, 10.000, 1500.000, 650.000, 1500.000);
    bkGrd.addColorStop(0.026, 'rgba(0, 0, 0, 1.000)'); // Change this (first val) for the animation
    bkGrd.addColorStop(1.000, 'rgba(25, 25, 25, 1.000)');
    ctx.fillStyle = bkGrd;
    if(!modes.acid){
      ctx.fillRect(0,0,c.width, c.height);
    }
    
    
    /**
     * Draw Stars
     * Not implemented yet :)
    */
    // for(let i = 0; i < stars.length; i++) {
    //   stars[i].draw(ctx);
    // }
    
    /**
     * Draw BackGroundParticle particles
    */
    for(let i = 0; i < bkParticles.length; i++) {
      bkParticles[i].draw(ctx);
    }
    
    /**
     * Draw DebugTexts
    */
    for(let i = 0; i < debugTexts.length; i++) {
      debugTexts[i].draw(ctx, "hi");
    }
    
    /**
     * Draw logo particles
    */
    for(let i = 0; i < particles.length; i++) {
      particles[i].draw(ctx);
    }
    
    
    
    
    var centerCoor = {
      x:0,
      y:0
    };
    
    centerCoor.x = (window.innerWidth/2);
    centerCoor.y = (window.innerHeight/2);
    
    yPlusDB = ((Math.cos(Date.now()/200)*12));
    
    try{
      ctx.drawImage(Mlogo, (centerCoor.x-(logoSize/2)), (centerCoor.y-(logoSize/2) + 10  + yPlusDB), logoSize, logoSize);
    }catch(e){
      console.error("Cant draw logo: " + e);
    }
    
    
    
    // tpos++;
    
    // if(bkParticles.length >= MAX_BUFFER_SIZE) {    //[DECRAPTED]
    //   bkParticles.shift();
    // }
    // if(particles.length >= MAX_BUFFER_SIZE) {
    //   particles.shift();
    // }
    
    // ctx.font = "30px Comic Sans MS";
    // ctx.fillStyle = "red";
    // ctx.textAlign = "center";
    // ctx.fillText("____2019@", c.width/2+tpos, c.height/2+tpos);
    //window.setTimeout(function () {
      window.requestAnimationFrame(updateDraw);
    //}, 500);
  }
}

function stopCanvas() {
  console.log("canvas stoped");
  var drawing = false;
  c = document.createElement("canvas");
  c.setAttribute("id", "dcanv2");
  c.setAttribute("class", "repencil");
  ctx = c.getContext("2d");
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}
var modal = document.getElementById('cmdModal');



/**
 *  Modal
 */

function showCommand() {
  modal.style.display = "block";
  var cmdBt = document.getElementById("cmdBt");
  var cmdText = document.getElementById("cmdText");
  var cmdRes = document.getElementById("cmdRes");
  cmdBt.addEventListener("click",function () {
    cmdBt.setAttribute("disabled", ""); // Disable to process showCommand
    
    // Mlogo.src = cmdText.value;
    cmdRes.style.color = "#0d0";
    try{
      switch(cmdText.value) {
      //   case "nachomen":
      //   case "pabble":
      //     Mlogo.src = "otherLogos/" + cmdText.value +".png";
      //     cmdRes.innerHTML = "You selected " + cmdText.value + "!";
      //     break;
        case "error":
          throw("Test Error");
          break;
        case "default":
          Mlogo.src = "MLogo.png";
          cmdRes.innerHTML = "Return to the original!";
          break;
        default:
          // cmdRes.style.color = "#ddd";
          // cmdRes.innerHTML = "<span class=\"nvl\">No valid logo. :(</span> Changed to default logo";
          throw("No valid logo!");
      }
    }catch(e){
      cmdRes.style.color = "#f00";
      cmdRes.innerText = e;
      
    }
    
    // cmdRes.innerHTML = "Success!";
    
    cmdBt.removeAttribute("disabled"); // Disable to process showCommand
  });
}

function toogleCommand() {
  if(menuOpened) {
    modal.style.display = "none";
    menuOpened = false;
  } else {
    showCommand();
    menuOpened = true;
  }
}

var close_modal = document.getElementsByClassName("close-modal")[0];
close_modal.onclick = function() {
  // modal.style.display = "none";
  // menuOpened = false;
  toogleCommand();
}
var cmdCl = document.getElementById("cmdCl");
cmdCl.addEventListener("change", function() {
  var r = parseInt(cmdCl.value.charAt(1) + cmdCl.value.charAt(2), 16);
  var g = parseInt(cmdCl.value.charAt(3) + cmdCl.value.charAt(4), 16);
  var b = parseInt(cmdCl.value.charAt(5) + cmdCl.value.charAt(6), 16);
  partColors = [r,g,b];
  bkParticles = [];
  createParticlesAsync();
  // console.log([r,g,b]);
}, false);

var cmdClF = document.getElementById("cmdClF");
cmdClF.addEventListener("change", function() {
  var r = parseInt(cmdClF.value.charAt(1) + cmdClF.value.charAt(2), 16);
  var g = parseInt(cmdClF.value.charAt(3) + cmdClF.value.charAt(4), 16);
  var b = parseInt(cmdClF.value.charAt(5) + cmdClF.value.charAt(6), 16);
  EXPPartColors = [r,g,b];
  particles = [];
  createParticlesAsync();
  // console.log([r,g,b]);
}, false);

var bkCh = document.getElementById("bkCh");
bkCh.addEventListener("change", function (e) {
  particlesShowing.bk = this.checked;
  bkParticles = [];
  createParticlesAsync();
});

var exCh = document.getElementById("exCh");
exCh.addEventListener("change", function (e) {
  particlesShowing.ex = this.checked;
  particles = [];
  createParticlesAsync();
});

// var bkNum = document.getElementById("bkNum");
// bkNum.addEventListener("change", function () {
//   particlesGPS.bk = parseInt(this.value);
// });

// var exNum = document.getElementById("exNum");
// exNum.addEventListener("change", function () {
//   particlesGPS.ex = parseInt(this.value);
// });


/**
  *
  * start of the in-line code
  *
  */

window.resizeTo(620, 500);
if((window.innerWidth == screen.width && window.innerHeight == screen.height)) { //if is fullscreen
  fullscreen = true;
  showFBTDisplay(!fullscreen);
  showCanvasDisplay(fullscreen);
  initCanvas();
} else {
  showFBTDisplay(!fullscreen);
  showCanvasDisplay(fullscreen);
}

/**
 * Lsiteners
*/

document.getElementById("fbt").addEventListener("click", function () { //When fbt clicked
  document.body.webkitRequestFullscreen(); //set the window to fullscreen
  document.getElementById("rc").classList.remove("hide"); //[Obiusly not working] [DECRAPTED] hide strange text
});

document.body.addEventListener("webkitfullscreenchange", function(e){
  console.log("fullscreen: " + (window.innerWidth == screen.width && window.innerHeight == screen.height)); //debug
  // toogleFBTDisplay(); //No duplicated code
  showFBTDisplay(!(window.innerWidth == screen.width && window.innerHeight == screen.height)); // set the FBTDIV display to true if fullscreen  is false.
  showCanvasDisplay((window.innerWidth == screen.width && window.innerHeight == screen.height));
  
  if((window.innerWidth == screen.width && window.innerHeight == screen.height)){ //Posible bug canvas re-init or re-stop
    initCanvas();
    fullscreen = true;
  } else {
    // stopCanvas();
    fullscreen = false;
    window.close();
  }
});

document.addEventListener('keydown', function(e){
  if(!menuOpened){
    if(e.key=="f") {
      modes.festa = !modes.festa;
      bkParticles = [];
      createParticlesAsync();
    } else if (e.key == "a") {
      modes.acid = !modes.acid;
    } else if (e.key == "r") {
      modes.rainbowed = !modes.rainbowed;
      particles = []; // kill particles
      createParticlesAsync(); //repoblate particles
    } else if (e.key == "m") {
      modes.mlg = !modes.mlg;
    } else if (e.key == "l") {
      document.body.webkitRequestFullscreen();
    } else if (e.key == "i") {
      if(fullscreen){
        // showCommand();
        toogleCommand();
        // menuOpened = true;
      }
    } else if (e.key == "d"){
      particles = [];
      bkParticles = [];
      modes.debug = !modes.debug;
    }
    // console.log(e);
  }
  if (e.key == "i" && e.ctrlKey) {
    if(fullscreen){
      toogleCommand();
    }
  }
});
