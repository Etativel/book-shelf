const STORAGE_KEY = 'BOOK_KEY';

const addBook = (() => {
    let bookList = [];

    const isStorageExist = () => {
        return typeof (Storage) !== "undefined";
    }

    const saveBookToStorage = () => {
        if (isStorageExist()) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(bookList));
        }
    }

    const loadDataFromStorage = () => {
        if (isStorageExist()) {
            const serializedData = localStorage.getItem(STORAGE_KEY);
            if (serializedData !== null) {
                bookList = JSON.parse(serializedData);
            }
        }
    }

    const generateBookObject = (id, title, author, year, isComplete) => {
        return {
            id,
            title,
            author,
            year,
            isComplete
        }
    }

    const getBookValue = () => {
        const title = document.querySelector("#inputBookTitle").value
        const author = document.querySelector("#inputBookAuthor").value
        const year = document.querySelector("#inputBookYear").value
        const isComplete = document.querySelector("#inputBookIsComplete").checked
        const bookId = +new Date()
        const bookObject = generateBookObject(bookId, title, author, parseInt(year), isComplete)
        bookList.push(bookObject);
        saveBookToStorage();
    };

    const deleteBookById = (id) => {
        bookList = bookList.filter(book => book.id !== parseInt(id));
        saveBookToStorage();
        renderBook.updateReadDOM();
        renderBook.updateUnreadDOM();
    }

    const markBookReadById = (id) => {
        const bookToUpdate = bookList.find(book => book.id === id);
        if (bookToUpdate.isComplete == true) {
            bookToUpdate.isComplete = false;
            saveBookToStorage();
            renderBook.updateReadDOM();
            renderBook.updateUnreadDOM();
        } else {
            bookToUpdate.isComplete = true;
            saveBookToStorage();
            renderBook.updateReadDOM();
            renderBook.updateUnreadDOM();
        }
    }

    const getBookObject = () => bookList;

    return {
        getBookValue,
        getBookObject,
        deleteBookById,
        isStorageExist,
        loadDataFromStorage,
        markBookReadById    
    }

})();

const editBook = (() => {
    const buttonEvent = () => {
        const selesaiBacaButton = document.querySelectorAll(".green");
        const hapusBukuButton = document.querySelectorAll(".red");

        selesaiBacaButton.forEach(button => {
            button.removeEventListener('click', markToReadHandler);
        });
        hapusBukuButton.forEach(button => {
            button.removeEventListener('click', deleteBookHandler);
        });

        selesaiBacaButton.forEach(button => {
            button.addEventListener('click', markToReadHandler);
        });
        hapusBukuButton.forEach(button => {
            button.addEventListener('click', deleteBookHandler);
        });
    };

    const markToRead = (id) => {
        addBook.markBookReadById(id);
    };

    const deleteBook = (id) => {
        addBook.deleteBookById(id);
    };

    const markToReadHandler = (e) => {
        const id = e.target.closest(".action").querySelector(".hidden").textContent;
        markToRead(parseInt(id));
    };

    const deleteBookHandler = (e) => {
        const id = e.target.closest(".action").querySelector(".hidden").textContent;
        deleteBook(id);
    };

    return {
        buttonEvent
    };
})();

const searchBook = (() => {
    const searchButton = document.querySelector("#searchSubmit");
    const searchInput = document.querySelector("#searchBookTitle");

    const searchEventHandler = (e) => {
        e.preventDefault();
        const searchValue = searchInput.value.trim().toLowerCase();
        const bookList = addBook.getBookObject();

        const filteredBooks = bookList.filter(book => book.title.toLowerCase().includes(searchValue));

        renderFilteredBooks(filteredBooks);
    }

    const renderFilteredBooks = (filteredBooks) => {
        const incompleteBookshelf = document.getElementById('incompleteBookshelfList');
        const completeBookshelf = document.getElementById('completeBookshelfList');

        incompleteBookshelf.innerHTML = '';
        completeBookshelf.innerHTML = '';

        filteredBooks.forEach(book => {
            const shelf = book.isComplete ? completeBookshelf : incompleteBookshelf;
            const bookItem = document.createElement('article');
            bookItem.classList.add('book_item');
            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>
                <div class="action">
                    <p class="hidden">${book.id}</p>
                    <button class="green">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
                    <button class="red">Hapus buku</button>
                </div>
            `;
            shelf.appendChild(bookItem);
        });

        editBook.buttonEvent();
    }

    searchButton.addEventListener('click', searchEventHandler);

    return {
        renderFilteredBooks
    };
})();

const renderBook = (() => {
    const updateDOM = (isComplete, targetElementId) => {
        const books = addBook.getBookObject().filter(book => book.isComplete === isComplete);
        const targetElement = document.getElementById(targetElementId);
        targetElement.innerHTML = '';
        for (const book of books) {
            const bookItem = document.createElement('article');
            bookItem.classList.add('book_item');
            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>
                <div class="action">
                    <p class="hidden">${book.id}</p>
                    <button class="green">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
                    <button class="red">Hapus buku</button>
                </div>
            `;
            targetElement.appendChild(bookItem);
        }
        editBook.buttonEvent()
    }

    const updateReadDOM = () => {
        updateDOM(true, 'completeBookshelfList');
    }

    const updateUnreadDOM = () => {
        updateDOM(false, 'incompleteBookshelfList');
    }

    return {
        updateReadDOM,
        updateUnreadDOM
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    if (addBook.isStorageExist()) {
        addBook.loadDataFromStorage();
    }
    renderBook.updateReadDOM();
    renderBook.updateUnreadDOM();
});

const bookForm = document.querySelector("#inputBook")
bookForm.addEventListener("submit", (e) => {
    addBook.getBookValue();
    bookForm.reset();
    renderBook.updateReadDOM();
    renderBook.updateUnreadDOM();
    e.preventDefault();
});
