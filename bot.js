const twit = require('twit');
const config = require('./config.js');

const T = new twit(config);

const retweet = () => {
    let params = {
        q: 'tft OR Teamfight tactics AND tierlist OR guide',
        result_type: 'mixed',
        lang: 'en'
    };

    T.get('search/tweets', params, function(err, data, response) {
        if(!err) {
            if (data.statuses.length > 0) {
                for (let i=0; i<20; i++) {
                    if (data.statuses[i] === undefined) {
                        break;
                    } else if (data.statuses[i].retweeted_status === undefined) {
                        let retweetID = data.statuses[i].id_str;
                        T.post('statuses/retweet/:id', {id: retweetID}, function (err, data, response) {
                            if (response && !err) {
                                console.log('retweeted a tweet: ' + retweetID);
                            } if (err) {
                                console.log('Probably already rted!');
                            }
                        });
                    }  else {
                        console.log('Most likely trying to retweet a retweet... can\'t do that!');
                    }
                }
            } else {
                console.log('no tweet found!');
            }
        } else {
            console.log('search error');
        }
    });
};

retweet();
setInterval(retweet, 300000);

const stream = T.stream('statuses/filter', {track: '@PitzTFT'});

stream.on('tweet', function(tweet) {
   let user = tweet.user.screen_name;
   let userText = tweet.text;

   if (tweet.user.screen_name === 'PitzTft') {
      console.log('reply to self??? DON\'T EVEN THINK ABOUT IT');
   } else {
      if (/^PitzTft|comp/i.test(userText)) {
         console.log('looking for comp');
         reply = 'If you\'re looking for a comps list, I highly recommend tftactics.gg. Saintvicious'
         + ' usually has a very good list at https://twitter.com/LolStvicious. I also sometimes'
         + ' use blitz.gg and mobalytics.gg';
      } else if (/^PitzTft|guide/i.test(userText)) {
         console.log('looking for guide');
         reply = 'In my opinion https://mobalytics.gg/blog/category/guides/ offers the best guides to TFT'
         + ' that can be found. You can also find good guides retweeted on this twitter page and on youtube.';
      } else if (/^PitzTft|stream/i.test(userText)) {
         console.log('looking for stream');
         reply = 'You can find my personal stream at twitch.tv/thelarcenist. If you want to watch the streamers'
         + ' I learned the most from check out Kurumx, Saintvicious, Becca, and Superjj102 on Twitch!';
      } else {
         console.log('looking for nothing');
         reply = 'If you are trying to use the bot please mention PitzTft and say comps, guides, or streams. '
         + 'If you try to use more than one, you may get unexpected results. Please only use the specific term.'
         + ' see Twitter profile for more details';
      }
      T.post('statuses/update', { status: `@${user} ${reply}` }, function(err, data, response) {
         console.log(`@${user} ${reply}`);
      });
   }
});