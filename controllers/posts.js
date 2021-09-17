const mongo = require('mongodb')
const Post = require('../models/Post');


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
    console.log(newPost);
    newPost.save()
    .then(post => {
        res.redirect('/posts');
    })
    .catch(err => console.log(err));
}


exports.getPosts = (req, res) => {
    Post.find()
    .then(posts => {
      console.log(posts);
      res.render("posts/posts", {
        posts: posts,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });

    // res.render("posts", {
    //     isAuthenticated: false,
    // })
}

exports.getPost = (req, res) => {
    const postId = req.params.postId;
    Post.findOne({ _id: new mongo.ObjectId(postId) })
    .then(post => {
      console.log(post.userid);
      console.log(req.session.user._id)
      let canEdit = false;
      if(post.userid.toString() == req.session.user._id.toString()){
        canEdit = true;
      }
      console.log(canEdit)
      res.render("posts/post", {
        post: post,
        isAuthenticated: req.session.isLoggedIn,
        canEdit: canEdit
      });
    })
    .catch(err => {
      console.log(err);
    });

    // res.render("posts", {
    //     isAuthenticated: false,
    // })
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
        if(post.userid.toString() == req.session.user._id.toString()){
          canEdit = true;
        }
        res.render("posts/post", {
          post: post,
          isAuthenticated: req.session.isLoggedIn,
          canEdit: canEdit
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
