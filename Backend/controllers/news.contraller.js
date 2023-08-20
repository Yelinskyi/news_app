const newsModel = require('../models/News.model');

const news = async (req, res) => {
  const newsFromDB = await newsModel.find({});
  res.json(newsFromDB);
}

const addnews = async (req, res) => {
  if(!req.body) return response.sendStatus(400);
  try {
    const { body: news } = req;
    newNews = await newsModel.create(news);
    // console.log(newNews._id);
  } catch (dbErr) {
    res.status(500).send('Server error, try again later');
  }
  res.json({});
  // res.redirect("http://127.0.0.1:5501/Frontend/index.html");
}

const addcomment = async (req, res) => {
  if(!req.body) return response.sendStatus(400);
  try {

    // const userId = req?.loggedInUser?._id;
    const nickname = req?.loggedInUser?.nickname;
    // console.log('req?.loggedInUser?._id');
    // console.log(userId);
    // console.log(nickname);

    const { body: comment } = req;
    // console.log(comment);
    const news = await newsModel.findById(comment.newsid);
    // console.log(news)
    news.comments.push({
      // author: comment.author,
      author: nickname,
      text: comment.text,
      date: comment.date
    });
    await news.save();

    res.status(200).send({});
  } catch (dbErr) {
    res.status(500).send('Server error, try again later');
  }
}

module.exports = {
  news,
  addnews,
  addcomment
}