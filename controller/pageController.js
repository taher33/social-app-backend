const handleasync = require("../utils/handleAsync");
const Page = require("../models/pagesM");
const Post = require("../models/postsM");
const appError = require("../utils/appError");

exports.createPages = handleasync(async (req, res, next) => {
  console.log(req.body);
  const newpage = await Page.create({
    name: req.body.name,
    admins: req.user._id,
  });
  res.status(201).json({
    status: "success",
    newpage,
  });
});

exports.getAllPages = handleasync(async (req, res, next) => {
  const pages = await Page.find();
  res.json({
    status: "success",
    result: pages.length,
    pages,
  });
});

exports.getOnePage = handleasync(async (req, res, next) => {
  const page = await Page.findById(req.params.pageId);
  if (!page) return next(new appError("page not found", 404));
  const pagePosts = await Post.find({ page: req.params.pageId });

  res.json({
    status: "success",
    page,
    postsNum: pagePosts.length,
    pagePosts,
  });
});

// follow and unfollow pages
exports.followPages = handleasync(async (req, res, next) => {
  const page = await Page.findById(req.params.postId);
  if (!page) return next(new appError("page was not found", 404));

  if (page.followers.includes(req.user._id)) {
    const index = page.followers.indexOf(req.user._id);
    page.followers.splice(index, 1);
    page.save();
    res.json({
      status: "success",
      msg: `you unfollowed ${page.name} page`,
    });
  } else {
    page.followers.push(req.user._id);
    page.save();

    res.json({
      status: "success",
      msg: `you are following ${page.name} page`,
    });
  }
});

exports.restrictPagePosters = (req, res, next) => {
  if (!req.isAdmin) return next(new appError("you are not auth", 403));

  next();
};

exports.checkIfAdmin = async (req, res, next) => {
  const page = await Page.findById(req.params.pageId);
  console.log(page);
  req.isAdmin = true;
  if (!page || !page.admins.includes(req.user._id)) req.isAdmin = false;
  next();
};

exports.deletePage = handleasync(async (req, res, next) => {
  await Page.deleteOne({ _id: req.params.pageId });
  res.status(200).json({
    status: "success",
    msg: "page is deleted",
  });
});
