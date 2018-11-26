module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const topicRoutes = require("../routes/topics");
        const postRoutes = require("../controllers/postController");
        app.use(staticRoutes);
        app.use(topicRoutes);
        app.use(postRoutes);
    }
}