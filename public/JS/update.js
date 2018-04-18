'use strict';

const id = document.getElementById('id').value = sessionStorage.getItem('id');
const category = document.getElementById('category').value = sessionStorage.getItem('category');
const title = document.getElementById('title').value = sessionStorage.getItem('title');


  document.getElementById('editForm').addEventListener('click', (e) => {  
  const url = '/edit/'

    fetch(url, {
      method: 'POST', 
      body:FormData
    })
    .then(err => console.log(err))
  });

