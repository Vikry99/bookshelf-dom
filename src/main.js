const buku = [];

const RENDER_EVENT_DATA = "event-book";
const SAVED_BOOK = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

document.addEventListener(RENDER_EVENT_DATA, function () {
  console.log(buku);

  const unComplateBookList = document.getElementById("completeBookshelfList");
  unComplateBookList.innerHTML = "";

  const completeBookList = document.getElementById("incompleteBookshelfList");
  completeBookList.innerHTML = "";

  for (const bookItem of searchBook()) {
    const bookElement = makeBookObject(bookItem);
    if (!bookItem.isComplete) {
      completeBookList.append(bookElement);
    } else {
      unComplateBookList.append(bookElement);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
    document.dispatchEvent(new Event(RENDER_EVENT_DATA));
  });

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    document.getElementById("inputBook").reset();
  });

  if (checkStorage()) {
    loadData();
  }
});

document.addEventListener(SAVED_BOOK, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function saveBook() {
  if (checkStorage()) {
    const parse = JSON.stringify(buku);
    localStorage.setItem(STORAGE_KEY, parse);
    document.dispatchEvent(new Event(RENDER_EVENT_DATA));
  }
}

function loadData() {
  const dataFormStorage = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataFormStorage);

  if (data !== null) {
    for (const book of data) {
      buku.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT_DATA));
}

function checkStorage() {
  if (typeof Storage === "undefined") {
    alert("Local Storage tidak ada!!");
    return false;
  }
  return true;
}

function generateID() {
  return +new Date();
}

function generateToObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function addBook() {
  const titleBook = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const bookIsComplete = document.getElementById("inputBookIsComplete").checked;
  const bookId = generateID();

  const bookToObject = generateToObject(
    bookId,
    titleBook,
    bookAuthor,
    bookYear,
    bookIsComplete
  );
  buku.push(bookToObject);
  saveBook();
  document.dispatchEvent(new Event(RENDER_EVENT_DATA));
}

function findBook(bookId) {
  for (const bookIdx of buku) {
    if (bookIdx.id === bookId) {
      return bookIdx;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in buku) {
    if (buku[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function addToFinish(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;

  bookTarget.isComplete = true;
  saveBook();
  document.dispatchEvent(new Event(RENDER_EVENT_DATA));
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  buku.splice(bookTarget, 1);
  saveBook();
  document.dispatchEvent(new Event(RENDER_EVENT_DATA));
}

function addNotFinish(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;

  bookTarget.isComplete = false;
  saveBook();
  document.dispatchEvent(new Event(RENDER_EVENT_DATA));
}

function searchBook() {
  const bookTitle = document.getElementById("searchBookTitle").value;

  const searchBook = buku.filter(function (book) {
    const bookName = book.bookTitle.toLowerCase();

    return bookName.includes(bookTitle.toLowerCase());
  });

  return searchBook;
}

function makeBookObject(bookObject) {
  const judul = document.createElement("h3");
  judul.innerText = bookObject.title;

  const penulis = document.createElement("p");
  penulis.innerText = bookObject.author;

  const tahunBuat = document.createElement("p");
  tahunBuat.innerText = bookObject.year;

  const tombolHapus = document.createElement("button");
  tombolHapus.innerText = "Hapus buku";
  tombolHapus.classList.add("red");

  const container = document.createElement("div");
  container.classList.add("action");

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(judul, penulis, container);
  article.setAttribute("id", `todo${bookObject.id}`);
  if (bookObject.isComplete) {
    const tombolBelumSelesai = document.createElement("button");
    tombolBelumSelesai.innerText = "Belum selesai di Baca";
    tombolBelumSelesai.classList.add("green");

    tombolBelumSelesai.addEventListener("click", function () {
      addNotFinish(bookObject.id);
    });

    tombolHapus.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    container.append(tombolHapus, tombolBelumSelesai);
  } else {
    const tombolSelesai = document.createElement("button");
    tombolSelesai.innerText = "Selesai dibaca";
    tombolSelesai.classList.add("green");

    tombolSelesai.addEventListener("click", function () {
      addToFinish(bookObject.id);
    });

    tombolHapus.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    container.append(tombolHapus, tombolSelesai);
  }

  return article;
}
