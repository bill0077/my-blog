var get_mdfiles_as_node = function(dir) {

  var filesystem = require("fs");
  var results = [];

  filesystem.readdirSync(dir).forEach(function(file) {
      var curr_file = file;
      file = dir+'/'+file;
      var stat = filesystem.statSync(file);

      if (stat && stat.isDirectory()) {
          results = results.concat(get_mdfiles_as_node(file))
      } else {
        if (curr_file.split(".")[1] === "md") {
          results.push({postTitle: curr_file.split(".")[0], filePath: file.split("public/")[1]});
        };
      }

  });

  return results;
};

exports.createPages = ({ actions }) => {
  const { createPage } = actions
  get_mdfiles_as_node("./public/post-contents").forEach(node => {
    createPage({
      path: `/posts/${node.postTitle}`,
      component: require.resolve(`./src/templates/Post.js`),
      context: node
    })
  })
}