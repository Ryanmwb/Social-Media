/* Defining tests for the create and getPosts methods. 
For the create method, test that when calling Topic.create 
with valid arguments, that a topic object is created and stored 
in the database. For getPosts, create and associate a post 
with the topic in scope. The getPosts method returns an array 
of Post objects that are associated with the topic the method 
was called on. The test should confirm that the associated 
post is returned when that method is called. */

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Post", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: "My first visit to Proxima Centauri b",
          body: "I saw some rocks.",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
  describe("#create()", () => {
    it("should create a topic object with a title and description of topic.", (done) => {
      Topic.create({
        title: "Pros of Cryosleep during the long journey",
        description: "1. Not having to answer the 'are we there yet?' question."
      })
      .then((topic) => {
        expect(topic.title).toBe("Pros of Cryosleep during the long journey");
        expect(topic.description).toBe("1. Not having to answer the 'are we there yet?' question.");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
  it("should not create a topic with missing title or description", (done) => {
    Topic.create({
      title: "testing for errors with missing description"
    })
    .then((post) => {

     // the code in this block will not be evaluated since the validation error
     // will skip it. Instead, we'll catch the error in the catch block below
     // and set the expectations there

      done();

    })
    .catch((err) => {

      expect(err.message).toContain("Topic.description cannot be null");
      done();

    })
  });
  /*describe("#setTopic()", () => {

    it("should associate a topic and a post together", (done) => {
      Topic.create({
        title: "Challenges of interstellar travel",
        description: "1. The Wi-Fi is terrible"
      })
      .then((newTopic) => {

// #2
        expect(this.post.topicId).toBe(this.topic.id);
// #3
        this.post.setTopic(newTopic)
        .then((post) => {
// #4
          expect(post.topicId).toBe(newTopic.id);
          done();

        });
      })
    });
  });*/
});