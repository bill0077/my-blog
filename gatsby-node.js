/** A function that converts all markdown files in a given folder into a list of Gatsby nodes.
    postTitle: title of the post.
    postCategory: category of the post.
    filePath: path to the markdown file.
    mediaPath: path to the folder of media files used in markdown file. */
var get_mdfiles_as_node = function(root, dir) {

  var filesystem = require("fs");
  var results = [];

  filesystem.readdirSync(dir).forEach(function(file) {
      var curr_file = file;
      file = dir+'/'+file;
      var stat = filesystem.statSync(file);

      if (stat && stat.isDirectory()) {
          results = results.concat(get_mdfiles_as_node(root, file)) // recursively navigate subfolders
      } else {
        if (curr_file.split(".")[1] === "md") { // make node only for markdown files
          var title = curr_file.split(".")[0];
          var category = dir.split(root+'/')[1];
          results.push({
            postTitle: title, 
            postCategory: category, 
            filePath: root+'/'+category+'/'+curr_file, 
            mediaPath: root+'/'+category+'/media'
          });
        };
      }

  });

  return results;
};

/** A function that creates each static page programmatically.
    Executed during the build process.
    Use the 'Post' component as a template and the markdown file as a content. */
exports.createPages = ({ actions }) => {
  const { createPage } = actions
  get_mdfiles_as_node("post-contents", "./public/post-contents").forEach(node => {
    createPage({
      path: `/posts/${node.postCategory}/${node.postTitle}`,
      component: require.resolve(`./src/templates/Post.js`),
      context: node
    })
  })
}