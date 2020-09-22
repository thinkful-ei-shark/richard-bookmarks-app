import BookmarkAPI from './BookmarkAPI.js';

export default class Bookmark {
    constructor( data ){
        this.id = data.id || '';
        this.title = data.title || '';
        this.rating = data.rating || 1;
        this.url = data.url || '';
        this.desc = data.desc || '';
        this.expanded = false;
        this.deleted = false;
        this.html = {};
        this.r = new BookmarkAPI( );

        // initialize the bookmark
        this.init( );
    }

    init( ){
        // build the html
        this.templateHTML( );

        // setup the event handlers for this bookmark
        this.setupTemplateEventHandlers( );
    }
    
    templateHTML( ){
        // build the html for the bookmark
        this.html.body = this.$(`<div class="section--row bookmark--item ${this.expanded ? 'section--expanded' : ''}"></div>`);
        this.html.title = this.$(`<div tabindex="1" class="bookmark--title">${this.title}</div>`)
        this.html.rating = this.$(`<div class="bookmark--rating">
                                        ${this.templateRatings( )}
                                    </div>`);
        this.html.delete = this.$(`<div class="bookmark--delete hidden"></div>`);
        this.html.info = this.$(`<div class="section--column bookmark--info">
                                        <a href="${this.url}" target="_blank" class="bookmark--url hidden">Visit Site</a>
                                        <div class="rating--detailed hidden">${this.rating}</div>
                                    </div>`);
        this.html.desc = this.$(`<textarea class="bookmark--description hidden">${this.desc}</textarea>`);
        this.html.info.appendChild( this.html.desc );
        this.html.body.appendChild( this.html.title );
        this.html.body.appendChild( this.html.delete );
        this.html.body.appendChild( this.html.info );
        this.html.body.appendChild( this.html.rating );
    }

    templateRatings( ){
        let s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let N = 8;
        let r1 = Array.apply(null, Array(N)).map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
        let r2 = Array.apply(null, Array(N)).map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
        let r3 = Array.apply(null, Array(N)).map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
        let r4 = Array.apply(null, Array(N)).map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
        let r5 = Array.apply(null, Array(N)).map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');

        // create the radio button inputs for the star ratings
        return `<label class="uselesslabel" for="${r1}">r1</label>
                <label class="uselesslabel" for="${r2}">r2</label>
                <label class="uselesslabel" for="${r3}">r3</label>
                <label class="uselesslabel" for="${r4}">r4</label>
                <label class="uselesslabel" for="${r5}">r5</label>
                <input id="${r1}" type="radio" name="rating-${this.id}" value="1" class="rating--star" ${(this.rating === 1) ? 'checked="checked"':''}></input>
                <input id="${r2}" type="radio" name="rating-${this.id}" value="2" class="rating--star" ${(this.rating === 2) ? 'checked="checked"':''}></input>
                <input id="${r3}" type="radio" name="rating-${this.id}" value="3" class="rating--star" ${(this.rating === 3) ? 'checked="checked"':''}></input>
                <input id="${r4}" type="radio" name="rating-${this.id}" value="4" class="rating--star" ${(this.rating === 4) ? 'checked="checked"':''}></input>
                <input id="${r5}" type="radio" name="rating-${this.id}" value="5" class="rating--star" ${(this.rating === 5) ? 'checked="checked"':''}></input>`;
    }

    setupTemplateEventHandlers( ){
        this.html.rating.onclick = e => {
            if ( e.target.value >= 1 && e.target.value <= 5) this.r.patch(this.id,{ "rating": e.target.value } );
        }

        this.html.desc.onchange = e => {
            this.r.patch(this.id,{ "desc": this.html.desc.value } )
        }

        this.html.title.onclick = (e)=>{
            this.expanded = !this.expanded;
            this.html.body.classList.toggle("section--expanded");
            this.html.body.classList.toggle("section--row");
            this.html.body.classList.toggle("section--column");
            this.html.delete.classList.toggle("hidden");
            this.html.info.childNodes[1].classList.toggle("hidden");
            this.html.info.childNodes[3].classList.toggle("hidden");
            this.html.info.childNodes[5].classList.toggle("hidden");
            this.html.rating.classList.toggle("hidden");
        }

        this.html.delete.onclick = (e)=>{
            this.r.delete( this.id );
        };
    }

    $( txt ){
        let t = document.createElement( "template" );
        txt = txt.trim();
        t.innerHTML = txt;
        return t.content.firstChild;
    }
}