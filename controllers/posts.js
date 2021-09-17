const mongo = require('mongodb')
const Post = require('../models/Post');
const {format} = require('date-fns');
const User = require('../models/User');


exports.getCreatePostView = (req, res) => {
    res.render("posts/createpost", {
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postCreatePostView = (req, res) => {
    const {post_title, post_body} = req.body;
    console.log(post_title);

    let errors = [];

    //Check if all fields have data in them
    if (!post_title || !post_body){
        errors.push({msg: "Please fill in all fields"});
        return res.render("posts/create", { errors: errors });
    }

    const newPost = new Post({
        userid: req.session.user._id,
        title: req.body.post_title,
        body: req.body.post_body
    });
    newPost.save()
    .then(post => {
        res.redirect('/posts');
    })
    .catch(err => console.log(err));
}


exports.getPosts = (req, res) => {
    const postsPerPage = 4;
    const currentPage = req.query.page || 1;
    let numPages;

    Post.countDocuments()
    .then((numPosts) => {
      numPages = Math.ceil(numPosts/postsPerPage);
      return Post.find()
        .skip((currentPage - 1) * postsPerPage)
        .limit(postsPerPage);
    })
    .then(posts => {
      // console.log(posts);
      res.render("posts/posts", {
        posts: posts,
        isAuthenticated: req.session.isLoggedIn,
        currentPage: currentPage,
        numPages: numPages
      });
    })
    .catch(err => {
      console.log(err);
    });

}

exports.getPost = (req, res) => {
    const postId = req.params.postId;
    Post.findOne({ _id: new mongo.ObjectId(postId) })
    .then(post => {
      let canEdit = false;

      if(typeof req.session.user == 'undefined'){
        loggedInUserId = "none";
      } else {
        loggedInUserId = req.session.user._id.toString();
      }

      if(post.userid.toString() == loggedInUserId){
        canEdit = true;
      }

      User.findById(post.userid)
      .then(postAuthorObject => {
        res.render("posts/post", {
          post: post,
          isAuthenticated: req.session.isLoggedIn,
          canEdit: canEdit,
          authorName: postAuthorObject.name
        });
      })
      .catch(err => {
          console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.editPost = (req, res) => {
  const postId = req.params.postId;
  const {post_title, post_body} = req.body;
  Post.findOne({ _id: new mongo.ObjectId(postId) })
    .then(post => {
      
      post.title = post_title;
      post.body = post_body;

      post.save()
      .then(post => {
        
        let canEdit = false;

        if(typeof req.session.user == 'undefined'){
          loggedInUserId = "none";
        } else {
          loggedInUserId = req.session.user._id.toString();
        }

        if(post.userid.toString() == loggedInUserId){
          canEdit = true;
        }

        User.findById(post.userid)
        .then(postAuthorObject => {
          res.render("posts/post", {
            post: post,
            isAuthenticated: req.session.isLoggedIn,
            canEdit: canEdit,
            authorName: postAuthorObject.name
          });
        })
        .catch(err => {
            console.log(err);
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.deletePost = (req, res) => {
  const postId = req.params.postId;

  Post.findOneAndDelete({ _id: new mongo.ObjectId(postId)})
  .then(deletedPost => {
    console.log(deletedPost);
    res.redirect('/posts');
  })
  .catch(err => {
    console.log(err);
  });
}
