const express = require('express');
const mqtt = require('mqtt');
const path = require('path')
const cors = require('cors');
const app = express();
app.use(express.static('public'));

// Kết nối MQTT client đến HiveMQ
const clientID = 'mqttjs_' + Math.random().toString(16).substring(2, 8);
const options = {
    protocol: 'mqtts',
    host: 'd97fd69d9d9a487197f7397ca145eca4.s1.eu.hivemq.cloud',
    port: 8883,
    keepalive: 60,
    clientId: clientID,
    clean: true,
    connectTimeout: 4000,
    username: 'datpham',
    password: 'Dat123456',
    reconnectPeriod: 1000,
}
const client = mqtt.connect(options);

client.on('connect', () => {
    console.log("connect to HiveMQ")
})
client.on('message', (topic, message) => {
    console.log('message from topic', topic, ': ', message.toString());
})

client.on('error', (err) => {
    console.error('connection failed', err);
    client.end();
})
client.on('reconnect', () => {
    console.log('reconnecting');
})

const publishMessage = (req, res, state) => {
    client.publish('led_state', state, (error) => {
        if (error) {
            console.error('Error publishing message:', error);
            res.status(500).send('Error publishing message');
        } else {
            console.log('Message published:', state);
            res.status(200).send('Message published successfully.');
        }
    });
};
const publishMode = (req, res, mode) => {
    client.publish('led_mode', mode, (error) => {
        if (error) {
            console.error('Error publishing message:', error);
            res.status(500).send('Error publishing message');
        } else {
            console.log('Message published:', mode);
            res.status(200).send('Message published successfully.');
        }
    })
}

app.post('/api/publish/on', (req, res) => {
    publishMessage(req, res, 'on')
});
app.post('/api/publish/off', (req, res) => {
    publishMessage(req, res, 'off')
});
app.post('/api/mode/sensor', (req, res) => {
    publishMode(req, res, 'sensor');
});
app.post('/api/mode/mqtt', (req, res) => {
    publishMode(req, res, 'mqtt');
});


app.get('/', (req, res) => {
    res.render('index.html');
})


const port = 3000;
app.listen(port, () => {
    console.log(`Server listening at port: http://localhost:${port}`);
});

