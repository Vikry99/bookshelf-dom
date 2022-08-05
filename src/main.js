const buku = [];

const RENDER_EVENT_DATA = 'event-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener(RENDER_EVENT_DATA, function(){
  console.log(buku);

  const unComplateBookList = document.getElementById('completeBookshelfList');
  unComplateBookList.innerHTML = '';

  const completeBookList = document.getElementById('incompleteBookshelfList') ;
  completeBookList,innerHTML = '';

  for(const bookItem of buku){
    const bookElement = makeBookObject(bookItem);
    if(!bookItem.isComplete){
        unComplateBookList.append(bookElement);
    }else{
        completeBookList.append(bookElement);
    }
  }
  
})

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    })
})

function generateID(){
    return + new Date();
}

function generateToObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}
function addBook(){
    const titleBook = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;
    const bookId = generateID();

    const bookToObject = generateToObject(bookId, titleBook, bookAuthor, bookYear, bookIsComplete);
    buku.push(bookToObject);
    document.dispatchEvent( new Event(RENDER_EVENT_DATA));
}

function addToFinish(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;
    
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT_DATA));
}

function makeBookObject(bookObject){
    const judul = document.createElement('h3');
    judul.innerText = bookObject.title;

    const penulis = document.createElement('p');
    penulis.innerText = bookObject.author;

    const tahunBuat = document.createElement('p');
    tahunBuat.innerText = bookObject.year;
    
    const tombolHapus = document.createElement('button');
    tombolHapus.innerText = 'Hapus buku';
    tombolHapus.classList.add('red');

    const container = document.createElement('div');
    container.classList.add('action');
    container.append(tombolSelesai, tombolHapus);
    
    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(judul, penulis ,container);
    article.setAttribute('id', `todo${bookObject.id}`);


    if(bookObject.isComplete){
    const tombolBelumSelesai = document.createElement('button');
    tombolBelumSelesai.innerText = 'Belum selesai di Baca';
    tombolBelumSelesai.classList.add('green');

    tombolBelumSelesai.addEventListener('click', function(){
        addNotFinish(bookObject.id);
    })

    tombolHapus.addEventListener('click', function(){
        removeBook(bookObject.id);
    })

    container.append(tombolHapus,tombolBelumSelesai);
    }else{
    const tombolSelesai = document.createElement('button');
    tombolSelesai.innerText = 'Selesai dibaca';
    tombolSelesai.classList.add('green');
    
    tombolSelesai.addEventListener('click', function(){
        addToFinish(bookObject.id);
    });

    tombolHapus.addEventListener('click', function(){
        removeBook(bookObject.id);
    });

    container.append(tombolHapus, tombolSelesai);
    }

    return article;
}