# my-blog
This is a simple blog project for my personal use. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), but ported to [Gatsby](https://github.com/gatsbyjs/gatsby) for SSG.
Also, the contents of the post are not committed to the git repo, but you can make `post-contents` folder under `public` folder and add markdowns to make your own posts.

You can visit my blog [here](https://bill0077.github.io/my-blog/)!

## Useful Scripts
To run the scripts below, proper .env.production and .env.development file with `GATSBY_PUBLIC_URL`, 
`GATSBY_FILESERVER_URL` env variable at project root folder is required.

`npm run develop`: same as `npm run start` in create react app.

`npm run build`: same as `npm run build` in create react app. Gatsby generates static pages using createPages function in gatsby-node.js

`npm run deploy`: deploy project to remote git repo using gh-pages.

you can find more scripts available at package.json