/*
  Made by Sébastien Raynaud in November 2018 @Chopokopx (Twitter) & @kopox@mastodon.social & @chopokopx@botsin.space (Mastodon)
  This mostly follows a series of tutorials by Daniel Shiffman: Mastodon Bot & Amazon EC2 Deployment
  Mastodon bot playlist: https://www.youtube.com/watch?v=sKSxBd56H70&list=PLRqwX-V7Uu6byiVX7_Z1rclitVhMBmNFQ&index=1
  Amazon EC2 Deployment: https://www.youtube.com/watch?v=26bajyD4fLg
  
  The bot is made with node.js, uses Mastodon API, and is living in the cloud using Amazon EC2
  The bot interacts with people in Mastodon that follow or mention it with certain words
  - When followed, toot with a mention to following person
  - When mentioned
    - If there is a "?" in the toot
      - If there is "How many" or "How much" in the toot, answer with a mention and some random number
      - Else if there is other keywords like "What" or "When", answer with a mention while saying it doesn't know, it only counts
    - If there is "Thank you", "Thanks", or "Thx" in the toot, answer with a mention and a you're welcome sentence
    - If there are 3 numbers in the toot, answer with a mention and a picture generated using the numbers as RGB values
*/

// SETTING UP EVERYTHING -------------------------------------------
require('dotenv').config(); // env for environment, to store the keys
const fs = require('fs'); // fs for file system, to create a read stream
const Mastodon = require('mastodon-api'); // Mastodon API
const util = require('util'); // To promisify 'child_process'
const exec = util.promisify(require('child_process').exec); // To execute terminal commands
// Command to execute in order to make the drawing using the processing sketch
const cmd = 'processing_sketch/processing_sketch'

console.log('Mastodon bot starting...');

const M = new Mastodon({
  client_key: process.env.CLIENT_KEY, // The keys are store in the .env file
  client_secret: process.env.CLIENT_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  //timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests
  api_url: 'https://botsin.space/api/v1/', // Mastodon API related to the botsin.space instance
})

// TOOT AUTOMATICALLY EVERY XX MS -----------------------------------------------------
const interval = 7 * 24 * 60 * 60 * 1000; // Interval of toot : 7 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second
automaticToot(); // Call it one time at the beginning
setInterval(automaticToot, interval); // Then call it every 'interval' ms
function automaticToot() {
  tootPicture()
    .then(response => console.log(response))
    .catch(error => console.error(error));
}

// USING STREAM TO LISTEN FOR EVENTS -----------------------------------------------------
const listener = M.stream('streaming/user');
listener.on('error', err => console.log(err));
listener.on('message', msg => {
  if (msg.event === 'notification') {
    const acct = msg.data.account.acct; // Get the account that wrote the message

    if (msg.data.type === 'follow') {
      // Do something when followed
      toot(`@${acct} nice seeing you there!`)
    } else if (msg.data.type === 'mention') {
      // Do something when mentioned
      const content = msg.data.status.content; // Get the content of the message
      const id = msg.data.status.id; // Get the id of the message, to be able to reply to it
      console.log(`Mention id: ${id}, content: ${content}`);

      // Favorite toot when mentioned with some nice words
      const regexNiceWords = /like|favou?rite|love|nice|cute|beautiful|cool|good|train|rainbow|unicorn|kitty?|cat|dog|color/i; // |❤️|✌️|😀|😁|😃|😄|😆|😉|😊|😋|😎|😍|😘|😗|😙|😚|🙂|🤗
      if (regexNiceWords.test(content)) {
        console.log('Mentioned with nice words');
        M.post(`statuses/${id}/favourite`, (error, data) => {
          if (error) console.log(error);
          else console.log(`Favorited id: ${id}, data.id: ${data.id}`);
        })
      }

      // Reply to questions
      const regexQuestionMark = /\?/;
      const regexHowManyMuch = /How many|How much/i;
      const regexOtherQuestions = /What|Where|When|Who|Why|Which|Whose/i;
      if (regexQuestionMark.test(content)) {
        console.log('I got a question!');
        if (regexHowManyMuch.test(content)) {
          // Answer to "how many" / "how much" questions with a random number
          const differentAnswers = [
            `Mhmhmhm... something like`,
            `I'm pretty sure it's`,
            `I'd say at least`,
            `Mhmhmhm... something like`
          ];
          const answerIndex = Math.floor(Math.random() * differentAnswers.length);
          const replyBegin = differentAnswers[answerIndex];
          const num = Math.floor(Math.random() * 100);
          const reply = `@${acct} ${replyBegin} ${num}`;
          toot(reply, id);
        } else if (regexOtherQuestions.test(content)) {
          // Cannot answer to other kind of questions
          const differentAnswers = [
            `I don't know, I just count...`,
            `I cannot answer that, try "how much" / "how many" questions`,
            `I don't know, but I can draw you something if you like`,
          ];
          const answerIndex = Math.floor(Math.random() * differentAnswers.length);
          const replyBegin = differentAnswers[answerIndex];
          const reply = `@${acct} ${replyBegin}`;
          toot(reply, id);
        }
      }

      // Answer to thanks
      const regexThanks = /Thank you|Thanks|Thx/i;
      if (regexThanks.test(content)) {
        console.log('I have been thanked!');
        const differentAnswers = [
          `You're welcome 🤖`,
          `It's been a pleasure`,
          `Oooh stop it you, I just do what I've been created to do 🤭`,
        ];
        const answerIndex = Math.floor(Math.random() * differentAnswers.length);
        const replyBegin = differentAnswers[answerIndex];
        const reply = `@${acct} ${replyBegin}`;
        toot(reply, id);
      }

      // Reply with a picture
      const regexNumbers = /\d+/g; // \d+ for numbers with any amount of digits, g to continue looking after first match
      const rgbValues = content.match(regexNumbers); // Returns an array with each /\d+/ match in a different cell
      if (rgbValues != null && rgbValues.length >= 3) {
        // Use the first 3 numbers as rgb values to make a drawing
        console.log('Someone asked for a drawing!');
        tootPicture(rgbValues, acct, id);
      }
    }
  }
})

// TOOT PICTURE FUNCTION -----------------------------------------------------
// Optional arguments: col (color, array with at least 3 numbers), account (account to mention (@account), 
// and responseId (id of the message to reply to)
async function tootPicture(col, account, responseId) {
  // Execute the processing sketch and get data from it
  let fullCmd = cmd;
  if (col != undefined && col.length >= 3) fullCmd = `${fullCmd} ${col[0]} ${col[1]} ${col[2]}`; // Potentially send arguments to the processing sketch
  const response1 = await exec(fullCmd); // Execute the processing sketch
  const stream = fs.createReadStream('processing_sketch/img.png'); // Get the output of the processing sketch as read stream
  const rgbDescription = response1.stdout.split('\r')[0]; // Get the color description of the output from a console.log in the processing sketch

  // Upload the output of the processing sketch
  const params1 = {
    file: stream,
    description: `Randomly generated circles on a white background, with ${rgbDescription}`
  }
  const response2 = await M.post('media', params1);
  const id = response2.data.id // Get the id of the output of the processing sketch that has just been uploaded

  // Toot with the output of the processing sketch attached, potential mention and in_reply_to_id
  const params2 = {
    status: `Here is a magnificent canvas with ${rgbDescription}`,
    media_ids: [id] // Reference the id of the file that was uploaded
  }
  if (account != undefined && responseId != undefined) {
    // If the toot is a reply, mention the user and signal that the toot is in reply to another toot
    params2.status = `@${account} ${params2.status}`;
    params2.in_reply_to_id = responseId;
  }
  const response3 = await M.post('statuses', params2);

  return {
    success: true,
    status: params2.status
  };
}

// TOOT FUNCTION -------------------------------------------------------
function toot(content, id) {
  const params = {
    status: content,
  }
  if (id) params.in_reply_to_id = id;

  M.post('statuses', params, (error, data) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Success! id: ${data.id}, timestamp: ${data.created_at}`)
    }
  })
}