const postQueries = require("../db/queries.posts.js");

module.exports = {
    new(req, res, next){
        res.render("posts/new", {topicId: req.params.topicId});
    },
    create(req, res, next){
        let newPost= {
            title: req.body.title,
            body: req.body.body,
            topicId: req.params.topicId
        };
        postQueries.addPost(newPost, (err, post) => {
            if(err){
                res.redirect(500, "/posts/new");
            } else {
                res.redirect(303, `/topics/${newPost.topicId}/posts/${post.id}`);
            }
        });
    },
    show(req, res, next){
        postQueries.getPost(req.params.postId, (err, post) => {
          if(err || post == null){
            res.redirect(404, "/");
          } else {
            res.render("posts/show", {post});
          }
        });
    },
    destroy(req, res, next){
        postQueries.deletePost(req.params.postId, (err, deletedRecordsCount) => {
            if(err){
                res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.postId}`)
            } else {
                res.redirect(303, `/topics/${req.params.topicId}`)
            }
        });
    },
    edit(req, res, next){
        postQueries.getPost(req.params.postId, (err, post) => {
          if(err || post == null){
            res.redirect(404, "/");
          } else {
            res.render("posts/edit", {post});
          }
        });
      },
    update(req, res, next){
        postQueries.updatePost(req.params.postId, req.body, (err, post) => {
          if(err || post == null){
            res.redirect(404, `/topics/${req.params.topicId}/posts/${req.params.postId}/edit`);
          } else {
            res.redirect(`/topics/${req.params.topicId}/posts/${req.params.postId}`);
          }
        });
    }
}