/** Simple function to get YAML frontmatter markdown.
    Return parsed object when success.
    Return undefined when there is no frontmatter for parsing is failed. */
var get_yaml_frontmatter = function(markdown) {
  markdown = markdown.trim();
  if (!markdown.startsWith('---') || !markdown.indexOf('---', 3)) { // check if markdown has frontmatter
    return;
  }

  const yaml = require('js-yaml');
  try {
    const frontmatterString = markdown.slice(3, markdown.indexOf('---', 3)).trim();
    const frontmatter = yaml.load(frontmatterString);
    return frontmatter;
  } catch (error) {
    return;
  }
}

/** Simple function to get excerpt of the post.
    return first 300 char after frontmatter. */
var get_excerpt = function(markdown) {
  const frontmatterIndex = markdown.indexOf('---', 3)+3;
  return markdown.substring(frontmatterIndex, frontmatterIndex+300)+"...";
}

/** A function that converts all markdown files in a given folder into a list of Gatsby nodes.
    postTitle: title of the post.
    postDate: date of the post.
    postAuthor: author of the post.
    slug: human friendly url of the post.
    category: category of the post.
    filePath: path to the markdown file.
    mediaPath: path to the folder of media files used in markdown file. */
var get_post_as_node = function(root, dir) {
  var filesystem = require("fs");
  var category = dir.split(root+'/')[1];
  var results = [];

  filesystem.readdirSync(dir).forEach(function(file) {
    var curr_file = file;
    file = dir+'/'+file;
    var stat = filesystem.statSync(file);

    if (stat && stat.isDirectory() && curr_file != 'media') {
      results = results.concat(get_post_as_node(root, file)) // recursively navigate subfolders
    } else {
      if (curr_file.split(".")[1] === "md") { // make node only for markdown files
        const markdown = filesystem.readFileSync(file, 'utf-8');
        const frontmatter = get_yaml_frontmatter(markdown);
        
        var title, date, author;
        if (frontmatter) {
          title = frontmatter.title !== undefined ? frontmatter.title : curr_file.split(".")[0];
          date = frontmatter.date !== undefined ? frontmatter.date : 'once upon a time..';
          author = frontmatter.author !== undefined ? frontmatter.author : 'anonymous';
        } else {
          title = curr_file.split(".")[0];
          date = 'once upon a time..';
          author = 'anonymous';
        }
        
        results.push({
          postTitle: title,
          postDate: date,
          postAuthor: author,
          category: category,
          slug: curr_file.split(".")[0],  
          filePath: root+'/'+category+'/'+curr_file, 
          mediaPath: root+'/'+category+'/media'
        });
      };
    }
  });

  return results;
};

/** A function that gets a list of posts as Gatsby nodes.
    category: category of the posts.
    postList: list of the post. 
    post.postTitle: title of the post.
    post.postDate: date of the post.
    post.postAuthor: author of the post.
    post.postExcerpt: excerpt of the post.
    post.postLink: link to the post. */
var get_postList_as_node = function(root, dir) {
  var filesystem = require("fs");
  var results = [];
  var post_list = [];
  var category = dir.split(root+'/')[1];

  filesystem.readdirSync(dir).forEach(function(file) {
    var curr_file = file;
    file = dir+'/'+file;
    var stat = filesystem.statSync(file);

    if (stat && stat.isDirectory() && curr_file != 'media') {
      results = results.concat(get_postList_as_node(root, file)) // recursively navigate subfolders
    } else {
      if (curr_file.split(".")[1] === "md") { // make node only for markdown files
        const markdown = filesystem.readFileSync(file, 'utf-8');
        const frontmatter = get_yaml_frontmatter(markdown);

        if (!frontmatter) {
          post_list.push({
            postTitle: curr_file.split(".")[0],
            postDate: 'once upon a time..',
            postAuthor: 'anonymous',
            postExcerpt: get_excerpt(markdown),
            postLink: category+'/'+curr_file.split(".")[0]
          });
        }
        
        post_list.push({
          postTitle: frontmatter.title !== undefined ? frontmatter.title : curr_file.split(".")[0],
          postDate: frontmatter.date !== undefined ? frontmatter.date : 'once upon a time..',
          postAuthor: frontmatter.author !== undefined ? frontmatter.author : 'anonymous',
          postExcerpt: get_excerpt(markdown),
          postLink: category+'/'+curr_file.split(".")[0]
        });
      };
    }
  });

  post_list.sort((a, b) => (a.postDate+a.postTitle).localeCompare(b.postDate+b.postTitle));
  results.push({
    category: category,
    postList: post_list
  });

  return results;
};

/** A function that creates each static page programmatically.
    Executed during the build process.
    Use the 'Post' component as a post page template and the markdown file as a content. 
    Use the 'PostList' component as a article list page template. */
exports.createPages = ({ actions }) => {
  const { createPage } = actions
  get_post_as_node("post-contents", "./public/post-contents").forEach(node => {
    createPage({
      path: `/${node.category}/${node.slug}`,
      component: require.resolve(`./src/templates/Post.js`),
      context: node
    });
  });

  get_postList_as_node("post-contents", "./public/post-contents").forEach(node => {
    createPage({
      path: `/${node.category}`,
      component: require.resolve(`./src/templates/PostList.js`),
      context: node
    });
  });
}