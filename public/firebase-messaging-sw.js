/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyDdpunvFFFH5BSxXhI_dTYLgUyRxfY91o8',
  authDomain: 'team-msgs.firebaseapp.com',
  projectId: 'team-msgs',
  storageBucket: 'team-msgs.appspot.com',
  messagingSenderId: '190148468086',
  appId: '1:190148468086:web:df547429c2f77f0c462e57',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    image: payload.data.image,
    icon: 'https://team-msgs.web.app/android-chrome-192x192.png',
    badge: 'https://team-msgs.web.app/logo.svg',
    tag: notificationTitle,
    vibrate: [200, 100, 200],
    data: { url: payload.data.click_action },
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        if (event.notification.data.url) {
          let client = null;

          for (let i = 0; i < clientList.length; i++) {
            let item = clientList[i];

            if (item.url) {
              client = item;
              break;
            }
          }

          if (client && 'navigate' in client) {
            client.focus();
            event.notification.close();
            return client.navigate(event.notification.data.url);
          } else {
            event.notification.close();
            // if client doesn't have navigate function, try to open a new browser window
            return clients.openWindow(event.notification.data.url);
          }
        }
      })
  );
});
