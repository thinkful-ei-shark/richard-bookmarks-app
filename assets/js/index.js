import BookmarkApp from './classes/BookmarkApp.js';


const app = new BookmarkApp({
    adding:false,
    error:null,
    filter:0
});

// initialize the app - create the main element, get stored bookmarks, render, etc
app.init( );