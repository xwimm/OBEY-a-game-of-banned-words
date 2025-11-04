// Official List of Politically Dangerous Words by Xiomara Wimmer
// Data and Machine Learning for Artistic Practice (DMLAP) Spring Term 2025  
//Handpose model: T. Kwok, ml5.js Handpose (Tensorflow.js port of MediaPipe Hands), 2020
// https://learn.ml5js.org/#/reference/handpose
// Original demo code: https://editor.p5js.org/ml5/sketches/handpose_webcam
// Modified by Xiomara Wimmer, 2025
// Banned words list from https://pen.org/banned-words-list/
//
const bannedWords = [
  "abortion","accessibility","Accessible","activism","activists","advocacy",
  "advocate","advocates","affirmative action","affirmative action programs",
  "affirming care","affordable home","affordable housing","agricultural water",
  "agrivoltaics","air pollution","all-inclusive","allyship","alternative energy",
  "anti-racism","antiracist","asexual","assigned at birth","assigned female at birth",
  "assigned male at birth","at risk","autism","aviation fuel","barrier","barriers",
  "belong","bias","biased","Biased toward","biases","Biases towards","bioenergy",
  "biofuel","biogas","biologically female","biologically male","biomethane","bipoc",
  "bisexual","Black","black and latinx","breastfeed + people","breastfeed + person",
  "Cancer Moonshot","carbon emissions mitigation","carbon footprint","carbon markets",
  "carbon pricing","carbon sequestration","CEC","changing climate","chestfeed + people",
  "chestfeed + person","clean energy","clean fuel","clean power","clean water",
  "climate","climate accountability","climate change","climate consulting",
  "climate crisis","climate model","climate models","climate resilience","climate risk",
  "climate science","climate smart agriculture","climate smart forestry",
  "climate variability","climate-change","climatesmart","commercial sex worker",
  "community","community diversity","community equity","confirmation bias",
  "contaminants of environmental concern","continuum","Covid-19","critical race theory",
  "cultural competence","cultural differences","cultural heritage","Cultural relevance",
  "cultural sensitivity","culturally appropriate","culturally responsive","definition",
  "DEI","DEIA","DEIAB","DEIJ","diesel","dietary guidelines/ultraprocessed foods",
  "disabilities","disability","disabled","disadvantaged","discriminated",
  "discrimination","discriminatory","discussion of federal policies","disparity",
  "diverse","diverse backgrounds","diverse communities","diverse community",
  "diverse group","diverse groups","diversified","diversify","diversifying","diversity",
  "diversity and inclusion","diversity in the workplace",
  "diversity, equity, and inclusion","diversity/equity efforts","EEJ","EJ","elderly",
  "electric vehicle","energy conversion","enhance the diversity","enhancing diversity",
  "entitlement","environmental justice","environmental quality","equal opportunity",
  "equality","equitable","equitableness","equity","ethanol","ethnicity","evidence-based",
  "excluded","exclusion","expression","female","females","feminism","fetus","field drainage",
  "fluoride","fostering inclusivity","fuel cell","gay","GBV","gender","gender based",
  "gender based violence","gender diversity","gender dysphoria","gender expression",
  "gender identity","gender ideology","gender nonconformity","gender transition",
  "gender-affirming care","gendered","genders","geothermal","GHG emission","GHG modeling",
  "GHG monitoring","global warming","green","green infrastructure","greenhouse gas emission",
  "groundwater pollution","Gulf of Mexico","H5N1/bird flu","hate","hate speech",
  "health disparity","health equity","hispanic","hispanic minority","historically",
  "housing affordability","housing efficiency","hydrogen vehicle","identity","ideology",
  "immigrants","implicit bias","implicit biases","inclusion","inclusive","inclusive leadership",
  "inclusiveness","inclusivity","Increase diversity","increase the diversity","indigenous",
  "indigenous community/ people","inequalities","inequality","inequitable","inequities",
  "injustice","institutional","integration","intersectional","intersectionality","intersex",
  "issues concerning pending legislation","justice40","key groups","key people","key populations",
  "Latinx","lesbian","lgbt","LGBTQ","low-emission vehicle","low-income housing","male dominated",
  "marginalize","marginalized","marijuana","measles","membrane filtration",
  "men who have sex with men","mental health","methane emissions","microplastics","migrant",
  "minorities","minority","minority serving institution","most risk","MSI","msm","multicultural",
  "Mx","Native American","NCI budget","net-zero","non-binary","nonbinary","noncitizen",
  "non-conforming","nonpoint source pollution","nuclear energy","nuclear power","obesity","opioids",
  "oppression","oppressive","orientation","pansexual","PCB","peanut allergies","people + uterus",
  "people of color","people-centered care","person-centered","person-centered care","PFAS","PFOA",
  "photovoltaic","polarization","political","pollution","pollution abatement","pollution remediation",
  "prefabricated housing","pregnant people","pregnant person","pregnant persons","prejudice",
  "privilege","privileges","promote","promote diversity","promoting diversity","pronoun","pronouns",
  "prostitute","pyrolysis","QT","queer","race","race and ethnicity","racial","racial diversity",
  "racial identity","racial inequality","racial justice","racially","racism","runoff","rural water",
  "safe drinking water","science-based","sediment remediation","segregation","self-assessed",
  "sense of belonging","sex","sexual preferences","sexuality","social justice","social vulnerability",
  "socio cultural","socio economic","sociocultural","socioeconomic status","soil pollution",
  "solar energy","solar power","special populations","stem cell or fetal tissue research","stereotype",
  "stereotypes","subsidized housing","sustainable construction","systemic","they/them","tile drainage",
  "topics of federal investigations","topics that have received recent attention from Congress",
  "topics that have received widespread or critical media attention","trans","transexual",
  "transexualism","transexuals","transgender","transgender military personnel","transgender people",
  "transitional housing","trauma","traumatic","tribal","two-spirit","unconscious bias",
  "under appreciated","under represented","under served","underprivileged","underrepresentation",
  "underrepresented","underserved","understudied","undervalued","vaccines","victim","victims",
  "vulnerable","vulnerable populations","water collection","water conservation","water distribution",
  "water efficiency","water management","water pollution","water quality","water storage",
  "water treatment","white privilege","wind power","woman","women","women and underrepresented",
  "women in leadership"
];

// Global Variables
let words = [];
let video, handpose, predictions = [];
let isStarted = false;
let obeyAudio;

// Word Class
class Word {
  constructor() {
    this.text = random(bannedWords);
    this.x = random(width);
    this.y = random(-100, -50);
    this.speed = random(0.8, 2);
    this.rotation = random(-PI, PI);
    this.rotSpeed = random(-0.05, 0.05); //random rotation speed to add movement to the piece
    this.size = random(20, 36);
  this.r = random(200, 255);
  this.g = random(100, 255);
  this.b = random(100, 255);
  this.alpha = 255;
    this.alpha = 255; // opaquness at MAX
    this.popping = false;
    
  

  }

  update() {
    if (this.popping) {
      this.alpha -= 25;
      if (this.alpha < 0) this.alpha = 0;
      this.rotation += this.rotSpeed;
      return;
    }
    this.y += this.speed;
    this.rotation += this.rotSpeed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
  
fill(this.r, this.g, this.b, this.alpha);

    stroke(0, this.alpha * 0.5);
    strokeWeight(2);
    textAlign(CENTER, CENTER);
    textSize(this.size);
    text(this.text, 0, 0);
    pop();
  }

  isOffScreen() { return this.y > height + 100 || this.alpha <= 0; }

  checkCollision(handX, handY) {
    const r = max(16, this.size * 0.8);
    return dist(handX, handY, this.x, this.y) < r;
  }

  pop() {
    if (!this.popping) {
      this.r = 200; this.g = 16; this.b = 46; //MAGA red #C8102E
this.popping = true;
playObey();

    }
  }
}

// Setup
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  textFont("Times New Roman");
  textStyle(BOLD);

  // Fullscreen when clicking the canvas
  canvas.mousePressed(() => {
    fullscreen(!fullscreen());
  });

  obeyAudio = document.getElementById("obeyAudio");

  // Stop button click from triggering canvas click
  document.getElementById("startBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    startCamera();
  });
}

function draw() {
  background(20);

  if (video && video.loadedmetadata) {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();
  }
  
  fill(255);
textFont("Times New Roman");
textStyle(BOLD);
textAlign(CENTER, TOP);
textSize(width * 0.04);
text("Official List of Politically Dangerous Words", width / 2, 75);

  
fill(250);
noStroke();
textSize(22);
textAlign(CENTER, BOTTOM);
const msg = 'When words disappear, freedom follows.\nMove your hands to get rid of these "woke" words.';
text(msg, width / 2, height - 30);   // centered, 20px above bottom

  
  if (!isStarted) return;

  if (predictions.length > 0) {
    for (const hand of predictions) {
      if (!hand.landmarks) continue;

     drawHandPoints(hand.landmarks);


      const f = hand.landmarks[8];
      const handX = map(f[0], 0, video.width, width, 0);
      const handY = map(f[1], 0, video.height, 0, height);

      drawPointer(handX, handY);

      for (const w of words) {
        if (!w.popping && w.checkCollision(handX, handY)) w.pop();
      }
    }
  }

  for (let i = words.length - 1; i >= 0; i--) {
    words[i].update();
    words[i].display();
    if (words[i].isOffScreen()) words.splice(i, 1);
  }

  if (frameCount % 45 === 0 && words.length < 40) {
    words.push(new Word());
  }
}

// Window resized to full screen 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Adding audio OBEY.mp3
function playObey() {
  try {
    obeyAudio.currentTime = 0;
    obeyAudio.play();
  } catch (_) {}
}

// Camera and ML5 updated 
function startCamera() {
  document.getElementById("startBtn").disabled = true;
  document.getElementById("status").textContent = "Loading camera...";

  video = createCapture(VIDEO, () => {
    document.getElementById("status").textContent = "Loading hand tracking...";
  });
  video.size(640, 480);
  video.hide();

  handpose = ml5.handpose(video, () => {
    document.getElementById("status").textContent = "Ready! Use your hands!";
    isStarted = true;
    for (let i = 0; i < 15; i++) {
      const w = new Word();
      w.y = random(height);
      words.push(w);
    }
  });

  handpose.on("predict", (r) => (predictions = r));
}
//Full Screen exit
function keyPressed() {
  if (keyCode === ESCAPE && fullscreen()) fullscreen(false);
}

// Hand Points
function drawHandPoints(landmarks){
  for (let i = 0; i < landmarks.length; i++) {
    let x = map(landmarks[i][0], 0, video.width, width, 0);
    let y = map(landmarks[i][1], 0, video.height, 0, height);
    fill(255, 80, 80, 200);
    noStroke();
    circle(x, y, 12);
  }
}


function drawPointer(x, y) {
  const pulse = sin(frameCount * 0.1) * 10 + 30;
  fill(255, 50, 50, 100);
  noStroke();
  circle(x, y, pulse);
  fill(255, 200, 200, 200);
  circle(x, y, 20);
  stroke(255, 255, 255, 200);
  strokeWeight(3);
  noFill();
  circle(x, y, pulse);
}
