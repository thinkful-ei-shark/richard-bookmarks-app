import Bookmark from './Bookmark.js';
import BookmarkAPI from './BookmarkAPI.js';

export default class BookmarkApp {
    constructor( data ){
        this.r = new BookmarkAPI( );

        this.bookmarks = null;
        this.adding = data.adding || false;
        this.error = data.error || null;
        this.filter = data.filter || 0;

        this.html = {};
        this.currentPage = "main"; // add
    }

    init( ){
        // add the main element, set it as the app element and set the ID, and append it to the body
        this.el = document.createElement("main");
        this.el.setAttribute("id","bookmark--app");
        document.body.appendChild( this.el );

        // define the templates for the pages, main - for the main page, and add - for adding a new bookmark
        this.templates( );

        // setup the event handlers to handle the custom 
        this.setupEventHandlers( );

        // grab the stored bookmarks and run render
        this.r.get(); 
    }

    setupEventHandlers( ){
        // use get requests to also call render after updating the bookmarks list
        window.addEventListener( "getRequestResult", ( e )=>{
            this.currentPage = "main";
            // this creates a new bookmark using the Bookmark class from Bookmark.js for each bookmark returned from the API
            this.bookmarks = e.detail.map( b => new Bookmark(b) )
            this.render( );
        }, false );

        // after each post request to create a bookmark, run the get request to get the updated list
        window.addEventListener( "postRequestResult", ( e )=>{
            this.r.get();
        }, false );

        // after each patch request to update a bookmark, run the get request to get the updated list
        window.addEventListener( "patchRequestResult", ( e )=>{
            this.r.get();
        }, false );

        // after each delete request to remove a bookmark, run the get request to get the updated list
        window.addEventListener( "deleteRequestResult", ( e )=>{
            this.r.get();
        }, false );
    }

    templates( page ){
        // build the main page html
        this.html.body = this.$(`<div class="section--column"></div>`);
        this.html.title = this.$(`<div class="section--row"><h1>My Bookmarks</h1></div>`);
        this.html.buttons = this.$(`<div id="buttonsection" class="section--row"></div>`);
        this.html.newBookmark = this.$(`<button class="drawn--box" tabindex="1" id="newbookmark">New</button>`);
        this.html.filter = this.$(`<select id="filter" placeholder="Filter By" tabindex="1" class="drawn--box" name="filter">
                                    <option value="" disabled selected hidden>Filter By</option>
                                    <option value="1">1+ star</option>
                                    <option value="2">2+ stars</option>
                                    <option value="3">3+ stars</option>
                                    <option value="4">4+ stars</option>
                                    <option value="5">5 stars</option>
                                </select>`);

        this.html.bookmarks = this.$(`<div id="bookmark--list"></div>`);

        this.html.body.appendChild( this.html.title );
        
        this.html.buttons.appendChild( this.html.newBookmark );
        this.html.buttons.appendChild( this.html.filter );

        this.html.body.appendChild( this.html.buttons );
        this.html.body.appendChild( this.html.bookmarks );

        // build bookmark form html for adding bookmark
        this.html.form = this.$(`<form id="addnewbookmark" class="section--column">
                                        <h1>My Bookmarks</h1>
                                        <label for="url">Add New Bookmark:</label>
                                        <input placeholder="https://yourbookmark.here/" tabindex="1" type="url" name="url" id="url" required></input>
                                        <label class="uselesslabel" for="title">label</label>
                                        <input placeholder="Bookmark Title" type="text" tabindex="1" name="title" id="title" required></input>
                                    </form>`);

        this.html.formratings = this.$(`<div id="formratingrow" class="section--row">
                                            <label class="uselesslabel" for="radiostar1">radiostar1</label>
                                            <label class="uselesslabel" for="radiostar2">radiostar2</label>
                                            <label class="uselesslabel" for="radiostar3">radiostar3</label>
                                            <label class="uselesslabel" for="radiostar4">radiostar4</label>
                                            <label class="uselesslabel" for="radiostar5">radiostar5</label>
                                            <input id="radiostar1" type="radio" tabindex="1" name="rating" value="1" class="rating--star" checked="checked"></input>
                                            <input id="radiostar2" type="radio" tabindex="1" name="rating" value="2" class="rating--star"></input>
                                            <input id="radiostar3" type="radio" tabindex="1" name="rating" value="3" class="rating--star"></input>
                                            <input id="radiostar4" type="radio" tabindex="1" name="rating" value="4" class="rating--star"></input>
                                            <input id="radiostar5" type="radio" tabindex="1" name="rating" value="5" class="rating--star"></input>
                                        </div>`);
        this.html.formdesc = this.$(`<textarea placeholder="Add a description (optional)" tabindex="1" name="description" id="description"></textarea>`);
        this.html.formbuttons = this.$(`<div id="formbuttons" class="section--row"></div>`);
        this.html.formcancel = this.$(`<button class="button--rectangle" tabindex="1" id="cancelbutton">Cancel</button>`);
        this.html.formcreate = this.$(`<button type="submit" class="button--rectangle" tabindex="1" id="createbutton">Create</button>`);

        this.html.formbuttons.appendChild( this.html.formcancel )
        this.html.formbuttons.appendChild( this.html.formcreate )

        this.html.form.appendChild( this.html.formratings );
        this.html.form.appendChild( this.html.formdesc );
        this.html.form.appendChild( this.html.formbuttons );

        // after creating templates, add the event handlers for them
        this.setupTemplateEventHandlers( );
    }

    setupTemplateEventHandlers( ){

        // when the filter value on the main page is changed, update the list with only bookmarks matching the filter
        this.html.filter.onchange = e => {
            this.filter = this.html.filter.value;
            this.render();
        }

        // in the add new bookmark form, if cancel is pressed return to main
        this.html.formcancel.onclick = e => {
            this.currentPage = "main";
            this.render( );
        }

        // on main page, if new button is clicked, go to add new bookmark form
        this.html.newBookmark.onclick = e => {
            this.currentPage = "add";
            this.render( );
        }

        // on add new bookmark form submit, get values and use a post request to the API to create a new bookmark
        this.html.form.onsubmit = (e)=>{
            e.preventDefault();
            let formData = new FormData( e.target );
            let url = formData.get("url")
            let title = formData.get("title")
            let desc = formData.get("description")
            let rating = formData.get("rating");

            this.r.post({ "title": title, "url": url, "desc":desc, "rating":rating });
        }
    }

    renderAddNewPage( ){
        // render the add new bookmark page
        this.el.innerHTML = '';
        this.el.appendChild( this.html.form );
    }

    renderMainPage( ){
        // render the html of the page
        this.el.innerHTML = '';
        this.html.bookmarks.innerHTML = '';

        this.el.appendChild( this.html.body );

        this.bookmarks.forEach( b => ( b.rating >= this.filter ) ? this.html.bookmarks.appendChild( b.html.body ) : false );
    }

    render( ){
        // depending on the page, render the proper template
        if ( this.currentPage === "main" ) this.renderMainPage( );
        if ( this.currentPage === "add" ) this.renderAddNewPage( );
    }


    $( txt ){
        // creates an html node from text
        let t = document.createElement( "template" );
        txt = txt.trim();
        t.innerHTML = txt;
        return t.content.firstChild;
    }
}