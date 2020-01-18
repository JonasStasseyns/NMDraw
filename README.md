# NMDraw: websockets-based drawing web-application

NMDraw is a drawing web-app/game that uses websockets to display connected users' drawings on a standalone monitor (TV).
 
### Features
- Free drawing with customizable brush
- Add simple predefined shapes
- Add predefined emoji's
- Customize any placed object's scale, position, shape and rotation
- Remove selected shape
- Save your drawings
- Load your drawings when reconnecting (or overwrite them)

### Deployment guide
1. Navigate your CLI to the root of the project.
2. Install all dependencies by running `npm install` or `yarn install`.
3. Start the Node.js-server by running `yarn server:start` or `npm run server:start`.
4. Open the monitor in your browser at `http://localhost:5000/monitor.html`.
5. Look up the local ip of your device that is running the server.
6. Finally, open the client on any mobile device that is connected to the same Wi-Fi network at `http://<server-device-ip>:5000`.

### Maintenance
- You might want to clean out the server every once in a while. You can do this easily with toe following command: `yarn flush` or `npm run flush`.
