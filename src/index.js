
'use strict';

import { ca } from './ca.mjs';
import axios from 'axios';
import https from 'https';
import html from 'node-html-parser';
import xml2js from 'xml2js';

axios.get(
  'https://www2.ca3.uscourts.gov/oralargument/ListArguments30.aspx',
  {
    httpsAgent: new https.Agent({ca: ca})
  }
).then(resp => {
  const outItems = [ ];
  const outDoc = {
    rss: {
      $: {
        version: "2.0"
      },
      channel: {
        description: "Third Circuit oral arguments",
        item: outItems
      }
    }
  };
  
  const body = html.parse(resp.data);
  const grid = body.getElementById('GridArguments');
  for (const tr of grid.querySelectorAll('tr')) {
    const tds = tr.querySelectorAll('td');
    if (tds.length == 2) {
      const td1 = tds[0];
      const td2 = tds[1];
      const a = td1.querySelector('a');
      const href = a.attributes['href'];
      const argURL = new URL(href, 'https://www2.ca3.uscourts.gov/oralargument/ListArguments30.aspx');
      const fileName = href.split('/').at(-1);
      const dateString = td2.text;
      const dateMatch = dateString.match(/(\d+)\/(\d+)\/(\d+)/);
      const date = new Date(
        parseInt(dateMatch[3]),
        parseInt(dateMatch[1]) - 1,
        parseInt(dateMatch[2])
      );
      outItems.push({
        title: fileName,
        link: argURL.href,
        pubDate: date.toUTCString()
      });
    }
  }
  
  const builder = new xml2js.Builder();
  console.log(builder.buildObject(outDoc));
}).catch(error => {
  console.log('error', error);
});

