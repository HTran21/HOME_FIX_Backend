const db = require('../app/models/index');

class BlogService {
    async getBlogService() {
        return new Promise(async (resolve, reject) => {
            try {
                let listService = await db.Blog.findAll();
                resolve({ listService });
            }
            catch (error) {
                reject(error);
            }
        })

    }
}

module.exports = new BlogService();
