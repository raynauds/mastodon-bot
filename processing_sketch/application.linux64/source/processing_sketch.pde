void setup() {
  size(400, 400);
  background(255);
  
  float rLimit = 100;
  float gLimit = 100;
  float bLimit = 100;
  
  float n = random(1);
  if (n < 0.33) {
    rLimit = 255;
    float m = random(1);
    if (m < 0.20) {
      gLimit = 200;
    } else if (m < 0.4) {
      bLimit = 200;
    }
  } else if (n < 0.66) {
    gLimit = 255;
    float m = random(1);
    if (m < 0.20) {
      rLimit = 200;
    } else if (m < 0.4) {
      bLimit = 200;
    }
  } else {
    bLimit = 255;
    float m = random(1);
    if (m < 0.20) {
      rLimit = 200;
    } else if (m < 0.4) {
      gLimit = 200;
    }
  }
  
  if (!(args == null)) {
    rLimit = float(args[0]);
    gLimit = float(args[1]);
    bLimit = float(args[2]);
  }
  
  for (int i = 0; i < 200; i++) {
    float x = random(width);
    float y = random(height);
    float d = random(10, 50);
    float range = 100;
    float r = random(rLimit, rLimit + range);
    float g = random(gLimit, rLimit + range);
    float b = random(bLimit, rLimit + range);
    color col = color(r, g, b, 150);
    
    noStroke();
    fill(col);
    ellipse(x, y, d, d);
  }
  
  String red = quantify(rLimit);
  String green = quantify(gLimit);
  String blue = quantify(bLimit);
  
  String output = red + " red, " + green + " green, and " + blue + " blue";
  
  save("img.png");
  println(output);
  exit();
}

String quantify(float col) {
  String quantity = "almost no";
  if (col > 50) quantity = "a little bit of";
  if (col > 100) quantity = "some";
  if (col > 150) quantity = "a good amout of";
  if (col > 200) quantity = "loads of";
  if (col > 255) quantity = "too much";
  return quantity;
}
