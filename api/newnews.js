const axios = require('axios');
const { parseStringPromise } = require('xml2js');
const { Parser } = require('htmlparser2');

const parser = new Parser({
  
  onreset() {
    console.info('reset');
  },
  onopentag(name, attribs) {
    
      console.info('opentag', name);
      console.info('attribs', attribs);
    
    
  },
  ontext(text) {
    console.info('text', text);
  }
}, {
  recognizeCDATA: true
});

module.exports = async (req, res) => {
  try {
    console.log('news')
    // const feed = await axios.get('https://latam.ign.com/xbox.xml')
    // const feed = await axios.get('https://www.somosxbox.com/feed')
    const feed = await axios(
      {
        method: 'get',
        url:'https://www.picuki.com/profile/xbox_taiwan',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-requested-with': 'XMLHttpRequest',
          'referer': 'https://www.instagram.com/accounts/login/',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
      },
        validateStatus: function (status) {
          //console.log(status)
          return status < 500; // Resolve only if the status code is less than 500
        }
      }
    )
      .then(res => res.data)
      .catch(err => { throw { error: err.response.data.error }; });
   
    parser.parseComplete(feed);

    // const result = await parseStringPromise(feed);
    // const news = result.rss.channel[0].item.map((n) => ({
    //   title: n.title[0],
    //   image: n['media:thumbnail'][0].$.url,
    //   description: n.description[0],
    //   link: n.link[0],
    // }));

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate');
    return res.status(200).json(news);
  } catch {
    return res.status(200).json({});
  }
}
