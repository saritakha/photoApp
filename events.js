"use strict";



// let getDiv = function(){ 

fetch('events.json')
.then( res => res.json()) // returns promise
.then( json => {   // get json
for (let item of json) {

  //listing all the iems from the div and adding it in div
    const li = document.createElement('li');

    // all the things are inside a div
    const gallery = document.createElement('div');
    const img = document.createElement('img');
    const title= document.createElement('h2');
    const des = document.createElement('h4');
    const button = document.createElement('button');

    // class given to add event listener
    button.className = 'modalButton';

    // using value from json
    img.src = item.thumbnail;
    title.innerHTML = item.title;
    des.innerHTML = item.details;
    button.innerHTML = 'View';

    // adding all the child to parent
    gallery.appendChild(img);
    gallery.appendChild(title);
    gallery.appendChild(des);
    gallery.appendChild(button);
    li.appendChild(gallery);


    // modal for the larger pic
    const modal = document.createElement('div');
    const x = document.createElement('button');
    const midI = document.createElement('img');

    // giving class name 
    modal.className = 'modal';
    x.className = 'cancel';

    // taking middle image and other
    midI.src = item.image;
    midI.style.width = '900px';
    midI.style.height = '500px';
    x.innerHTML = 'x';
   
    // append child
    modal.appendChild(x);
    modal.appendChild(title);
    modal.appendChild(midI);


   document.querySelector('ul').appendChild(li);
   document.querySelector('ul').appendChild(modal);
   

let modalButton = document.querySelector('.modalButton');
let container = document.querySelector('.container');
let nav = document.querySelector('nav');

modalButton.addEventListener('click' , function(){
  modal.style.display = 'block';
  nav.style.display = 'none';
  gallery.style.display = 'none';
});

x.addEventListener('click' , function(){
  modal.style.display = 'none';
  nav.style.display = 'block';
  gallery.style.display = 'block';
});
}
});
