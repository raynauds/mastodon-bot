# mastodon-bot

:warning: **This bot has been permanently disabled**: It will not generate anything when mentioned in Mastodon anymore. However, you can still consult its gallery <a href="https://botsin.space/@chopokopx/with_replies">here</a>.

Made by Sébastien Raynaud in November 2018 [@seb_raynaud](https://twitter.com/seb_raynaud) (Twitter) & @kopox@mastodon.social & @chopokopx@botsin.space (Mastodon).
This mostly follows a series of tutorials by Daniel Shiffman: Mastodon Bot & Amazon EC2 Deployment.

In the EC2 Deployed version, there is also a .env file and only the 'application.linux64' folder of the processing sketch. A 'mastodon-bot.pem' file is also required on the computer. More information in the links below.

- <a href="https://www.youtube.com/watch?v=sKSxBd56H70&list=PLRqwX-V7Uu6byiVX7_Z1rclitVhMBmNFQ&index=1">Mastodon bot playlist</a>
- <a href="https://www.youtube.com/watch?v=26bajyD4fLg">Amazon EC2 Deployment</a>
- <a href="https://botsin.space/@chopokopx/with_replies">Mastodon of the bot</a> ```@chopokopx@botsin.space```

<br>

The bot is made with node.js, uses Mastodon API, and is (edit: was) living in the cloud using Amazon EC2.
The bot toots every week a drawing with random circles using a random color palette.
In addition, the bot interacts with people in Mastodon that follow or mention it with certain words:
- When followed, toot with a mention to following person
- When mentioned
  - If there is a "?" in the toot
    - If there is "How many" or "How much" in the toot, answer with a mention and some random number
    - Else if there is other keywords like "What" or "When", answer with a mention while saying it doesn't know, it only counts
  - If there is "Thank you", "Thanks", or "Thx" in the toot, answer with a mention and a you're welcome sentence
  - If there are 3 numbers in the toot (ideally between 0 and 255), answer with a mention and a picture generated using the numbers as RGB values
  - If there are nice words like "nice", "kitty", "beautiful", favorite the toot
  
Example: `@chopokopx@botsin.space Please draw me something with 200 red, 50 green, and 150 blue`
