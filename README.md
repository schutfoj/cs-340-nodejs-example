# NodeJS with MySQL Example Webapp
This example application builds on the homework assignments from CS 290 (Web Development) taught at Oregon State University. It is meant to be an introduction to using Node.js with the Express web server and a MySQL persistence layer. After cloning this repository (or downloading the contents), be sure to install the required dependencies by running the following command:

```
npm install
```

You can then start the web application server by running the following command:

```
npm start
```

> **NOTE**: if you need to run the application on a different port, the following command is valid from a Bash terminal:
>
> ```
> PORT=<number> npm start
> ```

## A Note On `forever`
We can use the `forever` library to run our Node.js applications in the background. This allows us to log off the ENGR server without terminating our web application. After installing the required dependencies, you can use the following commands to run the application using forever.

| Action | Command |
|---|---|
| Start a new process | `npx forever start src/server.js` |
| List running processes | `npx forever list` |
| Stop a running process | `npx forever stop <index>` |
| Stop all running proccesses | `npx forever stopall` |