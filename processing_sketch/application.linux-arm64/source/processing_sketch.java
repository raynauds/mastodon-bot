import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class processing_sketch extends PApplet {

public void setup() {
  
  background(255);
  
  float rLimit = 100;
  float gLimit = 100;
  float bLimit = 100;
  
  float n = random(1);
  if (n < 0.33f) {
    rLimit = 255;
    float m = random(1);
    if (m < 0.20f) {
      gLimit = 200;
    } else if (m < 0.4f) {
      bLimit = 200;
    }
  } else if (n < 0.66f) {
    gLimit = 255;
    float m = random(1);
    if (m < 0.20f) {
      rLimit = 200;
    } else if (m < 0.4f) {
      bLimit = 200;
    }
  } else {
    bLimit = 255;
    float m = random(1);
    if (m < 0.20f) {
      rLimit = 200;
    } else if (m < 0.4f) {
      gLimit = 200;
    }
  }
  
  if (!(args == null)) {
    rLimit = PApplet.parseFloat(args[0]);
    gLimit = PApplet.parseFloat(args[1]);
    bLimit = PApplet.parseFloat(args[2]);
  }
  
  for (int i = 0; i < 200; i++) {
    float x = random(width);
    float y = random(height);
    float d = random(10, 50);
    float range = 100;
    float r = random(rLimit, rLimit + range);
    float g = random(gLimit, rLimit + range);
    float b = random(bLimit, rLimit + range);
    int col = color(r, g, b, 150);
    
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

public String quantify(float col) {
  String quantity = "almost no";
  if (col > 50) quantity = "a little bit of";
  if (col > 100) quantity = "some";
  if (col > 150) quantity = "a good amout of";
  if (col > 200) quantity = "loads of";
  if (col > 255) quantity = "too much";
  return quantity;
}
  public void settings() {  size(400, 400); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "processing_sketch" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
