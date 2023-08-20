const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength:100,
    required: [true, 'title is required']
  },
  date: {
    type: String,
    default: new Date().toLocaleString()
    // default: () => {
    //   // const currentDate = new Date();
    //   // const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    //   // const day = String(currentDate.getDate()).padStart(2, '0');
    //   // const year = currentDate.getFullYear();
    //   // return `${month}/${day}/${year}`;
    //   return new Date().toLocaleString();
    // }
  },
  text: {
    type: String,
    required: [true, 'text is required']
  },
  comments: 
    [{
      author: {
        type: String,
        required: [true, 'author is required']
      },
      date: {
        type: String,
        default: new Date().toLocaleString()
        // default: () => {
        //   // const currentDate = new Date();
        //   // const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        //   // const day = String(currentDate.getDate()).padStart(2, '0');
        //   // const year = currentDate.getFullYear();
        //   // return `${month}/${day}/${year}`;
        //   return new Date().toLocaleString();
        // }
      },
      text: {
        type: String,
        required: [true, 'text is required']
      }
    }]
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
