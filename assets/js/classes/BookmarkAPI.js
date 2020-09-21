export default class BookmarkAPI {
    constructor( ){
        this.url = `https://thinkful-list-api.herokuapp.com/paint/`;
    }

    send( evt,data ){
        window.dispatchEvent( new CustomEvent( evt, { detail: data } ) );
    }

    get(){
        // get array of stored bookmarks
        
        // set self to this so that we can use this inside the fetch function
        let self = this;
        fetch( `${self.url}bookmarks` )
            .then((r)=>r.json( ))
            .then( d =>{
                self.send('getRequestResult', d );
            })  
            .catch((e)=>{
                console.log('Request failed', e);
            });
    }

    post(data){
        // create bookmark
        // example data: { "title": "Yahoo", "url": "http://yahoo.com", "desc":"this is a temporary description", "rating":3 }

        // set self to this so that we can use this inside the fetch function
        let self = this;

        let options = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        }

        fetch( `${self.url}bookmarks`, options )
          .then( r => r.json( ) )
          .then( d => {
            self.send('postRequestResult', d );
          })
          .catch( e => {
            console.log('Request failed', e);
          });
    }

    patch(id,data){
        // update bookmark with id
        // example data to update: { "rating":5 }
        
        // set self to this so that we can use this inside the fetch function
        let self = this;

        let options = {
            method: 'PATCH',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        }

        fetch( `${self.url}bookmarks/${id}`, options )
          .then( r => r.json( ) )
          .then( d => {
            self.send('patchRequestResult', d );
          })
          .catch( e => {
            console.log('Request failed', e);
          });
    }

    delete(id){
        // delete bookmark with id

        // set self to this so that we can use this inside the fetch function
        let self = this;
        let options = {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        }

        fetch( `${self.url}bookmarks/${id}`, options )
            .then((r)=>r.json( ))
            .then((d)=>{
                self.send('deleteRequestResult', d );
            })  
            .catch((e)=>{
                console.log('Request failed', e);
            });
    }
}