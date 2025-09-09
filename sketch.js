/* TITLE: ComPair is a pairwise comparison tool
  ABSTRACT: create data for analysis in pairwise comparison models. (win, lose) analyze using jupyter notebook running choix by Lucas Maystre
  
  
*/
let stack_list = []

let greeting = "Hi! Fenster angepasst? Bitte 'reset' = neu laden! Danke ";
let inp;

let l_img, r_img;
let l, r;
let rmask, lmask;
let img_array = [];
let output_array = [];

let rater;
let hi;
let go = false;

let cW;
let hMinus = 50;

let n_pairsPerStack; // limit if eachCombinationOnce = false
let eachCombinationOnce = true;  // set the rating mode

let n_stacks;
let floorCount = 0;

let combinations = [];
let pair = 0; //keep track of calls to random_pairs, should = output_array.length - 1

// PRELOAD


function preload() {
  go = false;
  
  stack_list = arrayRange(1, 76, 1)
  n_stacks = stack_list.length;
  
  if (eachCombinationOnce) {
    print("MODE: \teach combination once");
  }
  stack_list = shuffle(stack_list);
  stack = stack_list[0];
  print("stack", stack)
  loadStack(stack);

  /*
  let hello = createElement("p", "bitte erst die Initialen eingeben \n dann ok clicken");

  hello.center();
  hello.position(80, 0);  
*/

  buttonExport = createElement("button", "reset");
  buttonExport.size(60);
  buttonExport.position(0, 0);
  buttonExport.mousePressed(resetData);

  buttonExport = createElement("button", "E X P O R T !");
  buttonExport.size(200);
  buttonExport.position(windowWidth - buttonExport.width);
  buttonExport.mousePressed(saveData);

  inp = createInput();
  inp.size(150);
  inp.position(windowWidth / 2 - inp.width / 2, 10);
  inp.input(typing);

  buttonOK = createButton("Pseudonym eingeben und klicken");
  buttonOK.position(inp.x + inp.width + 30, 0);
  buttonOK.mousePressed(nameRater);

  hi = createElement("h1", greeting);
  hi.style("color", "#00a1d3");
  hi.position(80, 0);

}

function loadStack(stack) {
  img_array = [];
  for (i = 0; i < img_names.length; i++) {
    let name = img_names[i];  // added 25.01.
    let path = "images/" + "1_" + stack + "_" + name + ".png";   // change 25.01.
    print(path);
    img_array[i] = loadImage(path);
  }
  print(str(img_array.length), "images in stack", str(stack));
}

// SETUP

function setup() {
  // setup p5js window
  frameRate(4);
  canvas = createCanvas(windowWidth, windowHeight - hMinus);
  canvas.position(0, hMinus);
  cW = canvas.width;

  rmask = createGraphics(width, height);
  lmask = createGraphics(width, height);

  combinations = combine(img_names);  //returns shuffled pairs
  random_pair();
  print(combinations[output_array.length]);
}

// DRAW LOOP

function draw() {
  background(0);
  noStroke();

  if (go && rater) {
    show_images();
    countdown(width - 120, 0);
  }
}

// FUNCTIONS

function combine(obj_array) {
  // calculates all pairwise combinations for a given length of an array
  // returning an array of unique [a,b] combinations 
  // actually only needs the length and not the "contents" of obj_array
  // returns list of 
  
  let output = [];
  for (i = 0; i < obj_array.length - 1; i++) {  // last one 98 89 same
    for (j = i + 1; j < obj_array.length; j++) {
      //print(i, j);
      append(output, shuffle([i, j])); // added shuffle 26.01.2023
    }
  }
  if (eachCombinationOnce) {
    n_pairsPerStack = output.length;
  }
  print("n combinations: ", output.length);
  let out = shuffle(output);
  print(out);  
  return out;  // just index numbers
}


function random_pair() {
  // from predefined combinations
  // nothing really random happening here in case of eachCombinationOnce
  // we are just walking through the shuffled combinations
  
  if (eachCombinationOnce) {
    // assignments to left and right not randomized here because good enough
    // should be done if input images are

    r = combinations[pair % combinations.length][0];   // get first name
    l = combinations[pair % combinations.length][1];   // get second name
    // gets predefined pair based on combine(img_names)
  }

  r_img = img_array[r];  // gets the image for above specified number
  l_img = img_array[l];

  pair++;
}

function show_images() {

  imageMode(CENTER);

  let x = cW / 4;
  let w = cW / 2;

  l_img.resize(width/2, 0);
  image(l_img, width / 4, height / 2);

  r_img.resize(width/2, 0);
  image(r_img, (3 / 4) * width, height / 2);


  noStroke();
  fill(10);
  textSize(20);
  text(l, 30, height - 30);
  text(r, width / 2 + 30, height - 30);
}

function saveData() {
  save(
    output_array,
    rater + "_" + year() + "_" + month() + "_" + day() + "_" + int(millis())
  );
}

function resetData() {
  hi.html("");
  output_array = [];
  location.reload();
  //preload();
}

// LISTEN

function mouseReleased() {
  fill(200, 100);
  if (mouseY > 0 && mouseY < height - hMinus) {
    if (focused && mouseX < width / 2) {
      rect(0, 0, width / 2, height);
    } else if (focused && mouseX > width / 2) {
      rect(width / 2, 0, width, height);
    }
  }
}

function mousePressed() {
  if (rater && mouseY > 0 && mouseY < height - hMinus) {
    if (focused && mouseX < width / 2) {
      winningside("left");
    } else if (focused && mouseX > width / 2) {
      winningside("right");
    }
  }
}

function keyPressed() {
  //text(`${key} ${keyCode}`, 10, 40);

  if (keyCode == 37) {
    winningside("left");
  } else if (keyCode == 39) {
    winningside("right");
  }
}

function winningside(direction) {
  noStroke();
  fill(200, 100);

  if (direction == "left") {
    append(output_array, [rater, stack, l, r, int(millis()), eachCombinationOnce, img_names[l], img_names[r]]);
    print("left wins\t", img_names[l], img_names[r]);
    //
  } else if (direction == "right") {
    append(output_array, [rater, stack, r, l, int(millis()), eachCombinationOnce, img_names[r], img_names[l]]);
    print("right wins\t", img_names[r], img_names[l]);
    //
  }

  print(output_array.length);
  
  let last = floorCount;
  floorCount = floor(output_array.length / n_pairsPerStack); //when n_th pair rated becomes 1
  if (floorCount == last + 1 && floorCount <= n_stacks - 1) {
    print("floor", floorCount)
    stack = stack_list[floorCount];  //
    print("new Stack is", stack);
    loadStack(stack);
  } else if (output_array.length == n_pairsPerStack * n_stacks) {
    go = false;
    hi.html("Danke! Bitte die exportierten Daten ");
    saveData();
  }

  random_pair();
  show_images();
  //confirmFade()
}

function windowResized() {
  setup();
  cW = canvas.width;
}

function confirmFade() {
  for (i = 200; i > 0; i--) {
    fill(i);
    rect(0, 0, width, height);
  }
}

function countdown(x, y) {
  fill(255, 255, 0, 160);
  rect(x, y, 120, 60);
  textSize(20);
  textAlign(RIGHT, TOP);
  fill(0);
  text(
    "Countdown\n" + str(pair) +"/"+  str(n_pairsPerStack * n_stacks),
    windowWidth - 10,
    y + 10
  );
}

function typing() {
  rater = inp.value();
  hi.html("Hi, " + rater);
}

function nameRater() {
  go = true;
  rater = inp.value();
  hi.html("Dann mal viel Spaß " + rater);
  buttonOK.hide();
  inp.hide();
}

const arrayRange = (start, stop, step) =>
    // https://www.freecodecamp.org/news/javascript-range-create-an-array-of-numbers-with-the-from-method/
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
    );
