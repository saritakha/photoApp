"use strict";

//////////////////////////////////////////////////////////////////////////////
//fetching from json
fetch('/api')
  .then(res => res.json()) // returns json
  .then(datas => {
    createDomTree(datas);
    createSelect(datas);
  })
  .catch(error => console.log('error: ' + error));


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
  const Title = document.createElement('h3');
  const cancel = document.createElement('button');
  const img = document.createElement('img');
  const times = document.createElement('h5');
  const categories = document.createElement('h5');
  const fullImage = document.createElement('button');
  const edit = document.createElement('button');

  Title.innerHTML = item.title;
  img.src = item.image;
  fullImage.innerHTML = 'Full image';
  times.innerHTML = 'Time: ' + item.time;
  categories.innerHTML = 'Category: ' + item.category;
  cancel.innerHTML = 'Delete';
  cancel.className = 'delete'; 
  cancel.style.backgroundColor = "red";
  edit.innerHTML = 'Edit';
  edit.className = 'edit';
  edit.style.backgroundColor = "green";

  //style to image
  img.style.width = '100%';

  // adding all the child to parent
  gallery.appendChild(Title);
  gallery.appendChild(img);
  gallery.appendChild(times);
  gallery.appendChild(categories);
  gallery.appendChild(fullImage);
  gallery.appendChild(edit);
  gallery.appendChild(cancel);

  document.querySelector('.home').appendChild(gallery);
  let mid_img = document.querySelector('#img-container');
  let mapI = document.querySelector('#map-container');

  /////////////////////////////////////////////////////////////////////////////////////////////
  // add event listeners to the buttons
  const modal = document.querySelector('.modal');

  fullImage.addEventListener('click', (e) => {
    modal.style.display = "block";
    mid_img.src = item.image;
    mapI.innerHTML = '<iframe src="https://maps.google.com/maps?q=' + item.coordinates.lat + ',' + item.coordinates.lng + '&hl=en&z=14&amp;output=embed" frameborder="0" style="border:0" allowfullscreen></iframe>';
  })

  const x = document.querySelector('.cancel');
  x.addEventListener('click', () => {
    modal.style.display = "none";
  });

  //update
//////////////////////////////////////////////////////////////////////////
  edit.addEventListener('click',  () => {
    window.location.href="update.html";

  //get value from form
   sessionStorage.setItem('title',item.title);
   sessionStorage.setItem('category',item.category);
   sessionStorage.setItem('image',item.image);

  // Send PUT Request here
  fetch(`update/`+item._id, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      category: categories,
      title: Title,
      image: img
    })
  }).then(res => {
    if(res.ok) return res.json()
  })
});

//delete
//////////////////////////////////////////////////////////////////////////
  cancel.addEventListener('click',  () => {
  
  // Send PUT Request here
  fetch(`delete/`+item._id, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      category: categories,
      title: Title,
      image: img
    })
  }).then(res => {
    if(res.ok) return res.json()
  })
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
    option.text = item.title;
    selection.appendChild(option);

    selection.addEventListener('change', () => {
      const selected = selection.selectedIndex;
      let selectedValue = selection[selected].value;
      console.log(selectedValue);
      const filteredData = jsons.filter((item) => {
        if (selectedValue) {
          return item.Title === selectedValue;
        } else {
          return true;
        }
      });
      const myContainer = document.querySelector('.home');
      createEmptyDom(myContainer);
      createDomTree(filteredData);

    });
  }
}

//////////////////////////////////////////////////////////////////////////
// listeners for the button
const viewBut = document.querySelector('.viewBut');
const addBut = document.querySelector('.addBut');

viewBut.addEventListener('click', () => {
  window.location.href = '/index.html';
});

addBut.addEventListener('click', () => {
  window.location.href = '/form.html';
});



