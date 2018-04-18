"use strict";

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
  fullImage.style.backgroundColor= "#578bc6";
  fullImage.style.width = '100%';
  times.innerHTML = 'Time: ' + item.time;
  categories.innerHTML = 'Category: ' + item.category;

  // delete function for deleting 
  const tryDel = (e) => {
    e.preventDefault();
    console.log(cancel.dataset.id)
    fetch(cancel.dataset.id, {
      method: 'DELETE'
    }).then(() => {
      window.location.href= '/';
    })
  }

  //deletebutton and s stying
  cancel.innerHTML = 'Delete';
  cancel.addEventListener('click', tryDel);
  cancel.setAttribute('data-id', item._id);
  cancel.style.backgroundColor = "#e0596b";
  cancel.style.width = '100%';

  //edit
  edit.innerHTML = 'Edit';
  edit.href = "/edit/"+item._id;
  edit.style.backgroundColor = "#6dbc7a";
  edit.style.width = '100%';

  edit.addEventListener('click', () => {
    window.location.href = "/update/"+item._id;

    //get value from form
    sessionStorage.setItem('id', item._id);
    sessionStorage.setItem('title', item.title);
    sessionStorage.setItem('category', item.category);
    sessionStorage.setItem('image', item.image);
  });
  
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

  document.querySelector('#home').appendChild(gallery);
  let mid_img = document.querySelector('#img-container');
  let mapI = document.querySelector('#map-container');

  //////////////////////////////////////////////////////////////////////////
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
}

// Empty row div before inserting the filtered values
const createEmptyDom = (data) => {
  data.innerHTML = '';
};

///////////////////////////////////////////////////////////////////////
const createSelect = (jsons) => {
  //sorting by titile
  for (let item of jsons) {
    const selection = document.querySelector('.select');
    const option = document.createElement('option');
    option.text = item.title;
    selection.appendChild(option);

    selection.addEventListener('change', () => {
      const selected = selection.selectedIndex;
      let selectedValue = selection[selected].value;
      const filteredData = jsons.filter((item) => {
        if (selectedValue) {
          return item.title === selectedValue;
        } else {
          return true;
        }
      });
      const myContainer = document.querySelector('#home');
      createEmptyDom(myContainer);
      createDomTree(filteredData);
    });
  }
}

///////////////////////////////////////////////////////////////////////////////
const createDomTree = (jsons) => {
  for (let json of jsons) {
    createDom(json);
  }
}


//////////////////////////////////////////////////////////////////////////////
//fetching from json
fetch('/api')
  .then(res => res.json()) // returns json
  .then(datas => {
    createDomTree(datas);
    createSelect(datas);
  });

