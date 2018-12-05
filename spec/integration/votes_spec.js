const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

describe("routes : votes", () => {

  beforeEach((done) => {

 // #2
    this.user;
    this.topic;
    this.post;
    this.vote;

 // #3
    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((res) => {
        this.user = res;

        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: "posts"
          }
        })
        .then((res) => {
          this.topic = res;
          this.post = this.topic.posts[0];
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

   // #1
   describe("guest attempting to vote on a post", () => {

     beforeEach((done) => {    // before each suite in this context
       request.get({
         url: "http://localhost:3000/auth/fake",
         form: {
           userId: 0 // ensure no user in scope
         }
       },
         (err, res, body) => {
           done();
         }
       );
     })
     describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {

       it("should not create a new vote", (done) => {
         const options = {
           url: `${base}${this.topic.id}/posts/${this.post.id}/votes/upvote`
         };
         request.get(options,
           (err, res, body) => {
             Vote.findOne({            // look for the vote, should not find one.
               where: {
                 userId: this.user.id,
                 postId: this.post.id
               }
             })
             .then((vote) => {
               expect(vote).toBeNull();
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           }
         );
       });
     });
   });
   describe("signed in user voting on a post", () => {

    beforeEach((done) => {  // before each suite in this context
      request.get({         // mock authentication
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member",     // mock authenticate as member user
          userId: this.user.id
        }
      },
        (err, res, body) => {
          done();
        }
      );
    })

    describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {

      it("should create an upvote", (done) => {
        const options = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/votes/upvote`
        };
        request.get(options,
          (err, res, body) => {
            Vote.findOne({          
              where: {
                userId: this.user.id,
                postId: this.post.id
              }
            })
            .then((vote) => {               // confirm that an upvote was created
              expect(vote).not.toBeNull();
              expect(vote.value).toBe(1);
              expect(vote.userId).toBe(this.user.id);
              expect(vote.postId).toBe(this.post.id);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });
    });

    describe("GET /topics/:topicId/posts/:postId/votes/downvote", () => {

      it("should create a downvote", (done) => {
        const options = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/votes/downvote`
        };
        request.get(options,
          (err, res, body) => {
            Vote.findOne({
              where: {
                userId: this.user.id,
                postId: this.post.id
              }
            })
            .then((vote) => {               // confirm that a downvote was created
              expect(vote).not.toBeNull();
              expect(vote.value).toBe(-1);
              expect(vote.userId).toBe(this.user.id);
              expect(vote.postId).toBe(this.post.id);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });
    });
    describe("create a vote ", () => {
      it("with a value other than 1 or -1.  Should not be successful.", (done) => { //test 1
        Vote.create({
          value: 10,
          userId: this.user.id,
          postId: this.post.id
        })
        .then((vote) => {
          expect(vote).toBeNull();
          done();
        })
        .catch((err) => {
          //console.log(err);
          done();
        })
      })
      it(", then another vote on the same post.", (done) => { // test 2 
        console.log("hi");
        const optionsVote = {
            url: `${base}${this.topic.id}/posts/10/votes/upvote`
        };
        const optionsPost = {
            url: `${base}${this.topic.id}/posts/new`,
            form: {
              id: 10,
              userId: this.user.id,
              body: "This is the bodyyyy....",
              title: "This is the tittlellee"
            }
        };
        Post.create({
            title: "Hey there guys!",
            body: "Hey there ladies!",
            topicId: this.topic.id,
            userId: this.user.id,
            id: 10
        })
        .then(() => {
            request.get(optionsVote, (err, res, body) => {
                console.log("Creating 1...");
                console.log(body);
                request.get(optionsVote, (err, res, body) => {
                    console.log("Creating 2...");
                    console.log(body);
                    Vote.findAll({
                        where: {
                            postId: this.post.id
                        }
                    })
                    .then((votes) => {
                        console.log(votes);
                        expect(votes.length).toBe(1);
                        console.log("this.user below");
                        console.log(this.user);
                        done();
                    })
                })
            })
            done();        
        })
        .catch((err) => {
            console.log(err);
            done();
        })
    })
    });
  }); //end context for signed in user
  describe("#getPoints method", () => { //test 3
    it("should return integer value", (done)=> {
      Vote.create({
        value: 1,
        postId: this.post.id,
        userId: this.user.id
      })
      .then((vote) => {
        var points = this.post.getPoints();
        expect(points).toBeGreaterThan(0)
        done()
      })
      .catch((err) => {
        done()
      })
    })
  })

  // below are two tests created for the voting exercise that don't have methods mentioned in the exercise.
  /*describe("hasUpvoteFor() method", () => {
    it("should return a value of true", (done) => {
      const optionsVote = {
        url: `${base}${this.topic.id}/posts/10/votes/upvote`
      };
      request.get(optionsVote, (err, res, body) => {
        Vote.getUpvoteFor(10) // this method would have an argument of 'postId' which would have retrieved the true or false value.
        .then((getUpvote) => {
          expect(getUpvote).toBe(true);
        })
      })
    })
  })*/
  /*describe("hasUpvoteFor() method", () => {
    it("should return a value of true", (done) => {
      const optionsVote = {
        url: `${base}${this.topic.id}/posts/10/votes/downvote`
      };
      request.get(optionsVote, (err, res, body) => {
        Vote.getDownvoteFor(10) // this method would have an argument of 'postId' which would have retrieved the true or false value.
        .then((getDownvote) => {
          expect(getDownvote).toBe(true);
        })
      })
    })
  })*/
});

