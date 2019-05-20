// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const requestHttp = require('request');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  function welcome(agent) {
    return new Promise((resolve, reject) => {
      requestHttp.post({url:'https://687591f1.ngrok.io/api/enable'}, (error, response, body) => {
        agent.add(`<speak><audio src="https://alvintang.me/assets/transport.wav"></audio>Hi, I'm Mr. Teleporter. Ask me to take you to any city or country of your choice. For example, you can say teleport me to France.</speak>`);
        console.log('start');
        resolve();
      });
    });
  }
  
  function leave(agent) {
    return new Promise((resolve, reject) => {
      requestHttp.post({url:'https://687591f1.ngrok.io/api/disable'}, (error, response, body) => {
        agent.add(`<speak>Sorry to see you teleport out of my life, goodbye!<audio src="https://alvintang.me/assets/transport.wav"></audio></speak>`);
        console.log('end');
        resolve();
      });
    });
  }
 
  function fallback(agent) {
    agent.add(`Oh, sorry, I didn't quite catch that. I'm not Mr. Great Listener, I'm Mr. Teleporter. Please try again.`);
  }

  function teleportCountry(agent) {
    const country = request.body.queryResult.parameters["geo-country"];
    if(country !== '') {
      return new Promise((resolve, reject) => {
        requestHttp.put({url:`https://687591f1.ngrok.io/api/new-place/${country}`}, (error, response, body) => {
          agent.add(`<speak>Teleport. Teleport. Telephone. Teleport.<audio src="https://alvintang.me/assets/transport.wav"></audio><break time="17" />Anything else you want me to do?</speak>`);
          console.log('Teleported to (country): ' + country);
          resolve();
        });
      });
    } else {
      agent.add(`If you are trying to teleport to a city, say teleport to the city of Toronto for example.`);
    }
  }
  
  function teleportCity(agent) {
    const city = request.body.queryResult.parameters["geo-city"];
    if(city !== '') {
      return new Promise((resolve, reject) => {
        requestHttp.put({url:`https://687591f1.ngrok.io/api/new-place/${city}`}, (error, response, body) => {
          agent.add(`<speak>Teleport. Teleport. Telephone. Teleport.<audio src="https://alvintang.me/assets/transport.wav"></audio><break time="17" />Anything else you want me to do?</speak>`);
          console.log('Teleported to (city): ' + city);
          resolve();
        });
      });
    } else {
      fallback(agent);
    }
  }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Teleport To City Intent', teleportCity);
  intentMap.set('Teleport To Country Intent', teleportCountry);
  intentMap.set('CloseMrTeleporter', leave);
  agent.handleRequest(intentMap);
});
