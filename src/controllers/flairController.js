const flairQueries = require("../db/queries.flairs.js");

module.exports = {
    new(req, res, next){
        res.render("flairs/new", {postId: req.params.postId});
    },
    create(req, res, next){
        let newFlair= {
            name: req.body.name,
            color: req.body.color,
            postId: req.params.postId
        };
        flairQueries.addFlair(newFlair, (err, flair) => {
            if(err){
                console.log("The error is below...")
                console.log(err);
                res.redirect(500, `/posts/${req.params.postId}/flairs/new`);
            } else {
                res.redirect(303, `/posts/${req.params.postId}/flairs/${flair.id}`);
            }
        });
    },
    show(req, res, next){
        flairQueries.getFlair(req.params.flairId, (err, flair) => {
          if(err || flair == null){
            console.log("error below...")
            console.log(err)
            console.log("flair below..")
            console.log(flair)
            res.redirect(404, "/");
          } else {
            res.render("flairs/show", {flair});
          }
        });
    },
    destroy(req, res, next){
        flairQueries.deleteFlair(req.params.flairId, (err, deletedRecordsCount) => {
            if(err){
                res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.postId}/flairs/${req.params.flairId}`)
            } else {
                res.redirect(303, `/topics/${req.params.topicId}/posts/${req.params.postId}`)
            }
        });
    },
    edit(req, res, next){
        flairQueries.getFlair(req.params.id, (err, flair) => {
          if(err || flair == null){
            res.redirect(404, "/");
          } else {
            res.render("flairs/edit", {flair});
          }
        });
      },
    update(req, res, next){
        flairQueries.updateFlair(req.params.id, req.body, (err, flair) => {
          if(err || flair == null){
            res.redirect(404, `/posts/${req.params.postId}/flairs/${req.params.flairId}/edit`);
          } else {
            res.redirect(`/posts/${req.params.postId}/flairs/${req.params.flairId}`);
          }
        });
    }
}