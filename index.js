import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
let posts = [];
let blogIndex = 0;
let editing = false;

app.get("/",(req,res)=>{
  res.render("index.ejs", {blogPosts: posts});
});


app.post("/submit", (req, res)=>{
    const blogTitle = req.body["blog-title"];
    const blogContent = req.body["blog-content"];
    if(blogTitle == "" || blogTitle == "Enter a title!"){
      res.render("index.ejs", {blogPosts: posts, titleMessage: "Enter a title!", contentMessage: blogContent});
    } else if(blogContent == "" || blogContent == "Enter some content!" ){
      res.render("index.ejs", {blogPosts: posts, titleMessage: blogTitle, contentMessage: "Enter some content!"});
    } else{
      const blogPost = {"blogTitle": blogTitle, "blogContent": blogContent};
      if(editing){
        posts[blogIndex] = blogPost;
        editing = false;
      } else{
        posts.push(blogPost);
      }
      res.redirect("/");
    }
});

app.post("/delete", (req, res)=>{
  posts = posts.filter((item, index) => {
    return ("b"+index) != req.body.blogId;
  });
  res.redirect("/");
});

app.post("/edit", (req, res)=>{
  var blogTitle = "";
  var blogContent = "";
  posts.map((item, index) => {
    if(("b"+index) == req.body.blogId){
      blogIndex = index;
      blogTitle = item.blogTitle;
      blogContent = item.blogContent;
    }
  });
  editing = true;
  res.render("edit.ejs", {editableTitle : blogTitle, editableContent: blogContent });
});

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});