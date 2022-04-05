
'use strict';

import xml2js from 'xml2js';

const builder = new xml2js.Builder();

console.log(builder.buildObject({
  rss: {
    $: {
      version: "2.0"
    },
    channel: {
      description: "None",
      link: "Haha",
      item: [
        {
          title: "Title",
          link: "Link",
          pubDate: "PubDate"
        },
        {
          title: "Title",
          link: "Link",
          pubDate: "PubDate"
        }
      ]
    }
  }
}));

