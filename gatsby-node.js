var get_mdfiles_as_node = function(root, dir) {

  var filesystem = require("fs");
  var results = [];

  filesystem.readdirSync(dir).forEach(function(file) {
      var curr_file = file;
      file = dir+'/'+file;
      var stat = filesystem.statSync(file);

      if (stat && stat.isDirectory()) {
          results = results.concat(get_mdfiles_as_node(root, file))
      } else {
        if (curr_file.split(".")[1] === "md") {
          var title = curr_file.split(".")[0];
          var category = dir.split(root+'/')[1];
          results.push({postTitle: title, postCategory: category, filePath: root+'/'+category+'/'+curr_file, mediaPath: root+'/'+category+'/media'});
        };
      }

  });

  return results;
};

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