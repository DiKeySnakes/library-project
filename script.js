'use strict';
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');
const form = document.getElementById('form');
const errorMsg = document.getElementById('errorMsg');
const tableBody = document.getElementById('tbody');
const defaultBooks = [
  {
    title: 'A Game of Thrones',
    author: 'George R. R. Martin',
    pages: '694',
    published: '1996',
    readStatus: 'unread',
  },
  {
    title: 'A Clash of Kings',
    author: 'George R. R. Martin',
    pages: '761',
    published: '1998',
    readStatus: 'unread',
  },
  {
    title: 'A Storm of Swords',
    author: 'George R. R. Martin',
    pages: '973',
    published: '2000',
    readStatus: 'unread',
  },
  {
    title: 'A Feast for Crows',
    author: 'George R. R. Martin',
    pages: '753',
    published: '2005',
    readStatus: 'unread',
  },
  {
    title: 'A Dance with Dragons',
    author: 'George R. R. Martin',
    pages: '1016',
    published: '2011',
    readStatus: 'unread',
  },
  {
    title: 'The Princess and the Queen',
    author: 'George R. R. Martin',
    pages: '107',
    published: '2013',
    readStatus: 'unread',
  },
  {
    title: 'The Sons of the Dragon',
    author: 'George R. R. Martin',
    pages: '76',
    published: '2017',
    readStatus: 'unread',
  },
];

class Book {
  constructor(title, author, pages, published, readStatus) {
    this.title = title.trim();
    this.author = author.trim();
    this.pages = parseInt(pages);
    this.published = published;
    this.readStatus = readStatus;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook(newBook) {
    if (!this.isInLibrary(newBook)) {
      this.books.push(newBook);
    }
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
  }

  getBook(title) {
    return this.books.find((book) => book.title === title);
  }

  isInLibrary(newBook) {
    return this.books.some((book) => book.title === newBook.title);
  }
}

const library = new Library();

const updateBooksTable = () => {
  resetBooksTable();
  if (library.books.length === 0) {
    for (let book of defaultBooks) {
      library.books.push(book);
    }
  }
  for (let book of library.books) {
    addTableRow(book);
  }
};

const resetBooksTable = () => {
  tableBody.innerHTML = '';
};

const addTableRow = (book) => {
  const bookRow = document.createElement('tr');
  bookRow.innerHTML = `<td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.pages}</td>
  <td>${book.published}</td>
  <td>
    <button
      onclick="changeReadStatus()"
      id="status-button"
      class="status-button"
      title="Double click to change status">
      <i class="fa-solid fa-book"></i>
    </button>&nbsp;${book.readStatus}
  </td>
  <td>
    <button
      onclick="removeBook()"
      id="delete-button"
      class="delete-button"
      title="Remove the book from the library">
      <i class="fa-solid fa-trash-can"></i>
    </button>
  </td>`;
  tableBody.appendChild(bookRow);
};

const getBookFromInput = () => {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const published = document.getElementById('published').value;
  const readStatus = document.getElementById('readStatus').value;
  return new Book(title, author, pages, published, readStatus);
};

const addBook = (e) => {
  e.preventDefault();
  const newBook = getBookFromInput();

  if (library.isInLibrary(newBook)) {
    errorMsg.textContent = 'This book already exists in your library!';
    return;
  }
  library.addBook(newBook);
  updateBooksTable();
  closeModal(modal);
  form.reset();
};

const removeBook = () => {
  tableBody.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentTarget = e.target;
    const title =
      e.target.parentNode.parentNode.parentNode.firstChild.innerHTML;
    if (currentTarget.classList.contains('fa-trash-can')) {
      library.removeBook(title);
      updateBooksTable();
    }
  });
};

const changeReadStatus = () => {
  tableBody.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentTarget = e.target;
    const title =
      e.target.parentNode.parentNode.parentNode.firstChild.innerHTML;
    console.log(e.target);
    if (currentTarget.classList.contains('fa-book')) {
      const book = library.getBook(title);
      if (book.readStatus === 'read') {
        book.readStatus = 'unread';
      } else {
        book.readStatus = 'read';
      }
      updateBooksTable();
    }
  });
};

updateBooksTable();

form.onsubmit = addBook;

openModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove('active');
  overlay.classList.remove('active');
  errorMsg.textContent = '';
}
