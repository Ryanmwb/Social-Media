const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("routes : posts", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Winter Games",
        description: "Post your Winter Games stories."
      })
      .then((topic) => {
        this.topic = topic;

        Post.create({
          title: "Snowball Fighting",
          body: "So much snow!",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          //done();
        Flair.create({
            name: "test flair name",
            color: "test flair color",
            postId: this.post.id
        })
        .then((flair) => {
            this.flair = flair;
            done();
        })
        .catch((err) => {
          console.log("before each err below...")
          console.log(err);
          done();
        });
        });
      });
    });
  });
  describe("POST /posts/postId/flairs/create", () => {

    it("should create a new post and redirect", (done) => {
       const options = {
         url: `${base}posts/${this.post.id}/flairs/create`,
         form: {
           name: "flair name creation test",
           color: "flair color creation test",
           postId: this.post.id
         }
       };
       request.post(options,
         (err, res, body) => {
           Flair.findOne({where: {name: "flair name creation test"}})
           .then((flair) => {
            console.log("/////")
            console.log("res is below")
            console.log(res)
           console.log("//////")
           console.log("Option is below")
           console.log(options)
            console.log("////")
            console.log("flair found with the .findOne method")
             console.log(flair)
             console.log("////")
             console.log("this.post below")
             console.log(this.post)
             console.log("////")
             console.log("this.flair below")
             console.log(this.flair)
             expect(flair).not.toBeNull();
             expect(flair.name).toBe("flair name creation test");
             expect(flair.color).toBe("flair color creation test");
             expect(flair.postId).not.toBeNull();
             expect(flair.postId).toBe(this.post.id)
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

