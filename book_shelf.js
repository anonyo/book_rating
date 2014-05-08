Books = new Meteor.Collection("books");

Meteor.methods({
  upvote: function (bookId) {
  	var book = Books.findOne(bookId);
  	Books.update(bookId, 
  				  {$set: {votes: book.votes + 1}}
  );				  
  }, 
    downvote: function (bookId) {
  	var book = Books.findOne(bookId);
  	Books.update(bookId, 
  				  {$set: {votes: book.votes - 1}}
  );				  
  }

});

if (Meteor.isServer) {
  
    Books.allow({
      insert: function (userId, book) {
        return book.votes === 0; 
      }
    
    });

  Meteor.publish("books", function() {
    return Books.find();
  });

} else if (Meteor.isClient) {

    Meteor.subscribe("books");
    Template.BookList.books = function() {
      return Books.find({}, { sort: {votes: -1}}); 
    };

   Template.BookList.events({
      "click .upvote": function() {
      	Meteor.call("upvote", this._id);
      }, 
        "click .downvote": function() {
      	Meteor.call("downvote", this._id);
      }
   });

  Template.newBook.events({
     "submit .newBookForm": function (evt) {
     	evt.preventDefault();
     	Books.insert({
          title: $(".title").val(),
          author: $(".author").val(), 
          votes: 0
     	}, function (err) {
     		if (! err)
     			$("input[type=text]").val();
     	});
     }
   });

}