"use strict";




fetch('events.json')
.then( res => res.json()) // returns promise
.then( json => {   // get json

const select = document.createElement('select');
select.className= 'select';
const navi = document.querySelector('nav');

 navi.appendChild(select);
 
for (let item of json) {



  //sorting by category
  const selection = document.querySelector('.select');
  const option = document.createElement('option'); 
  option.text = item.category;
  selection.appendChild(option);
  
  //listing all the iems from the div and adding it in div
    const li = document.createElement('li');

    // all the things are inside a div
    const gallery = document.createElement('div');
    const Title = document.createElement('h2');
    const img = document.createElement('img');
    const des = document.createElement('h4');
    const time = document.createElement('h4');
    const category = document.createElement('h4');
    const button = document.createElement('button');

    // class given to add event listener
    button.className = 'modalButton';
    gallery.className = 'Gallery';

    // using value from json
    Title.innerHTML = item.title;
    img.src = item.thumbnail;
    des.innerHTML = item.details;
    button.innerHTML = 'Full image';
    time.innerHTML = item.time;
    category.innerHTML = item.category;

    // adding all the child to parent
    gallery.appendChild(Title);
    gallery.appendChild(img);
    gallery.appendChild(time);
    gallery.appendChild(category);
    gallery.appendChild(des);
    gallery.appendChild(button);
    li.appendChild(gallery);
    // option.appendChild(item.category);
    


    // modal for the larger pic
    const modal = document.createElement('div');
    const x = document.createElement('button');
    const midI = document.createElement('img');
    const map = document.createElement('iframe');

    //map style
    map.src = 'https://www.google.com/maps/embed/v1/;key=AIzaSyCJb1IqP_s-RMMavH9I9JiURw4vJkQ6lHc';
    map.style.width = '100px';
    map.style.height = '100px';


    // giving class name 
    modal.className= 'modal';
    x.className = 'cancel';

    // taking middle image and other
    midI.src = item.image;
    midI.style.width = '1000px';
    midI.style.height = '650px';
     x.innerHTML = 'x';
      
    // append child
    modal.appendChild(x);
    modal.appendChild(midI);
    modal.appendChild(map);
  
   document.querySelector('ul').appendChild(li);
   document.querySelector('ul').appendChild(modal);

}

const modal = document.querySelector('.modal');
const back = document.querySelector('li'); 
const x = document.querySelector('.cancel');
const modalButton = document.querySelector('.modalButton');
const nav = document.querySelector('nav');

modalButton.addEventListener('click' , () => 
{
  modal.style.display = 'block';
  nav.style.display = 'none';
  back.style.display = 'none';
});

x.addEventListener('click' , () => {
  modal.style.display = 'none';
  nav.style.display = 'block';
  back.style.display = 'block';
});

});
