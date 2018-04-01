"use strict";

//////////////////////////////////////////////////////////////////////////////
//fetching from json
fetch('/api')
  .then(res => res.json()) // returns json
  .then(datas => {
    createDomTree(datas);
    createSelect(datas);
  })
 .catch( error => console.log('error: ' + error));


///////////////////////////////////////////////////////////////////////////////
const createDomTree = (jsons) => {
  for (let json of jsons) {
    createDom(json);
  }
}

///////////////////////////////////////////////////////////////////////////////
const createDom = (item) => {
  // all the things are inside a div
  const gallery = document.createElement('div');
  const Title = document.createElement('h2');
  const img = document.createElement('img');
  const times = document.createElement('h4');
  const categories = document.createElement('h4');
  const fullImage = document.createElement('button');
  Title.innerHTML = item.title;
  img.src = item.image;
  fullImage.innerHTML = 'Full image';
  times.innerHTML = 'Time: '+item.time;
  categories.innerHTML = 'Category: '+item.category;

  //style to image
  img.style.width = '100%';

  // adding all the child to parent
  gallery.appendChild(Title);
  gallery.appendChild(img);
  gallery.appendChild(times);
  gallery.appendChild(categories);
  gallery.appendChild(fullImage);

  document.querySelector('.container').appendChild(gallery);
  let mid_img = document.querySelector('#img-container');
  let mapI = document.querySelector('#map-container');


  /////////////////////////////////////////////////////////////////////////////////////////////
  // add event listeners to the buttons
  const modal = document.querySelector('.modal');

  fullImage.addEventListener('click', (e) => {
    modal.style.display = "block";
    mid_img.src = item.image;
    //mapI.innerHTML = '<iframe src="https://maps.google.com/maps?q=' + item.coordinates.lat + ',' + item.coordinates.lng + '&hl=en&z=14&amp;output=embed" frameborder="0" style="border:0" allowfullscreen></iframe>';
  })

  const x = document.querySelector('.cancel');
  x.addEventListener('click', () => {
    modal.style.display = "none";
  });

}

// Empty row div before inserting the filtered values
function createEmptyDom(data) {
  data.innerHTML = '';
};

///////////////////////////////////////////////////////////////////////
const createSelect = (jsons) => {
  //sorting by category
  for (let item of jsons) {
    const selection = document.querySelector('.select');
    const option = document.createElement('option');
    option.text = item.category;
    selection.appendChild(option);

    selection.addEventListener('change', () => {
      const selected = selection.selectedIndex;
      let selectedValue = selection[selected].value;
      console.log(selectedValue);
      const filteredData = jsons.filter((item) => {
        if (selectedValue) {
          return item.category === selectedValue;
        } else {
          return true;
        }
      });
      const myContainer = document.querySelector('.container');
      createEmptyDom(myContainer);
      createDomTree(filteredData);

    });
  }
}

//////////////////////////////////////////////////////////////////////////
// listeners for the button
const viewBut = document.querySelector('.viewBut');
const addBut = document.querySelector('.addBut');

viewBut.addEventListener('click', () =>{
  window.open('index.html');
});

addBut.addEventListener('click', () =>{
  window.open('form.html');
});
