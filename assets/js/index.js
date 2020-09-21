import BookmarkApp from './classes/BookmarkApp.js';


const app = new BookmarkApp({
    adding:false,
    error:null,
    filter:0
});

// initialize the app - create the main element (line 19 in BookmarkApp.js), get stored bookmarks, render (line 163 in BookmarkApp.js), etc
app.init( );