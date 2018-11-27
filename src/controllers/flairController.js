const flairQueries = require("../db/queries.flairs.js");

module.exports = {
    new(req, res, next){
        res.render("flairs/new", {topicId: req.params.topicId, postId: req.params.postId});
    },
    create(req, res, next){
        let newFlair= {
            name: req.body.name,
            color: req.body.color,
            postId: req.params.postId
        };
        postQueries.addFlair(newFlair, (err, flair) => {
            if(err){
                res.redirect(500, "/flairs/new");
            } else {
                res.redirect(303, `/topics/${req.params.topicId}/posts/${req.params.postId}/flairs/${flair.id}`);
            }
        });
    },
    show(req, res, next){
        postQueries.getFlair(req.params.id, (err, flair) => {
          if(err || flair == null){
            res.redirect(404, "/");
          } else {
            res.render("flairs/show", {flair});
          }
        });
    },
    destroy(req, res, next){
        postQueries.deleteFlair(req.params.flairId, (err, deletedRecordsCount) => {
            if(err){
                res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.postId}/flairs/${req.params.flairId}`)
            } else {
                res.redirect(303, `/topics/${req.params.topicId}/posts/${req.params.postId}`)
            }
        });
    },
    edit(req, res, next){
        postQueries.getFlair(req.params.id, (err, flair) => {
          if(err || flair == null){
            res.redirect(404, "/");
          } else {
            res.render("flairs/edit", {flair});
          }
        });
      },
    update(req, res, next){
        postQueries.updateFlair(req.params.id, req.body, (err, flair) => {
          if(err || flair == null){
            res.redirect(404, `/topics/${req.params.topicId}/posts/${req.params.postId}/flairs/${req.params.flairId}/edit`);
          } else {
            res.redirect(`/topics/${req.params.topicId}/posts/${req.params.postId}/flairs/${req.params.flairId}`);
          }
        });
    }
}