#include "Item.h"


Item::Item()
{
  //set values for default constructor
  setType("null");
  setColour(Scalar(0,0,0));

}

Item::Item(string name){

  setType(name);

  if(name=="Post-It"){

    setHSVmin(Scalar(0,88,129));
    setHSVmax(Scalar(182,117,184));

    //BGR value for Green:
    setColour(Scalar(0,255,0));

  }
  if(name=="Juggling Ball"){

    setHSVmin(Scalar(23,96,38));
    setHSVmax(Scalar(161,236,186));

    //BGR value for Yellow:
    setColour(Scalar(0,255,255));

  }



}

Item::~Item(void)
{
}

int Item::getXPos(){

  return Item::xPos;

}

void Item::setXPos(int x){

  Item::xPos = x;

}

int Item::getYPos(){

  return Item::yPos;

}

void Item::setYPos(int y){

  Item::yPos = y;

}

Scalar Item::getHSVmin(){

  return Item::HSVmin;

}
Scalar Item::getHSVmax(){

  return Item::HSVmax;
}

void Item::setHSVmin(Scalar min){

  Item::HSVmin = min;
}


void Item::setHSVmax(Scalar max){

  Item::HSVmax = max;
}