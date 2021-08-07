const compression = require("compression")
const express = require("express");
const expressJSDocSwagger = require('express-jsdoc-swagger');
const session = require('express-session')
const cors = require("cors");
const errorMiddleware = require('./middleware/error.middleware');
const fileupload = require('express-fileupload');
const engine = require("ejs-mate");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoDBSession = require('connect-mongodb-session')(session)
const HttpException = require('./utils/HttpException.utils');
const dotenv = require('dotenv');

const aboutRouter = require('./routes/about.route');
const categoryRouter = require('./routes/category.route');
const draftRouter = require('./routes/draft.route');
const chapterRouter = require('./routes/chapter.route');
const userRouter = require('./routes/user.route');
const userOptionRouter = require('./routes/useroption.route');
const authRouter = require('./routes/auth.route');
const optionRouter = require('./routes/option.route');
const themeRouter = require('./routes/theme.route');
const menuRouter = require('./routes/menu.route');
const messageRouter = require('./routes/message.route');
const mailRouter = require('./routes/mail.route');
const forumRouter = require('./routes/forum.route');
const newsRouter = require('./routes/news.route');
const libraryRouter = require('./routes/library.route');
const logRouter = require('./routes/log.route');
const multipartRouter = require('./routes/multipart.route');
const db = require("./db/db-connection");

const { serverLogger } = require('./utils/logger.utils');

db();

const store = new MongoDBSession({
    uri: process.env.DB_HOST,
    collection: "sessions"
})

const options = {
    info: {
      version: '1.0.0',
      title: "Wizard's Orbit",
      license: {
        name: 'MIT',
      },
    },
    security: {
      BasicAuth: {
        type: 'http',
        scheme: 'basic',
      },
      BearerAuth: {
        type: 'http',
        scheme: 'basic',
      },
      CookieAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'connect.sid'
      }
    },
    baseDir: __dirname,
    // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
    filesPattern: './**/*.js',
    // URL where SwaggerUI will be rendered
    swaggerUIPath: '/api-docs',
    // Expose OpenAPI UI
    exposeSwaggerUI: true,
    // Expose Open API JSON Docs documentation in `apiDocsPath` path.
    exposeApiDocs: false,
    // Open API JSON Docs endpoint.
    apiDocsPath: '/v3/api-docs',
    // Set non-required fields as nullable by default
    notRequiredAsNullable: false,
    // You can customize your UI options.
    // you can extend swagger-ui-express config. You can checkout an example of this
    // in the `example/configuration/swaggerOptions.js`
    swaggerUiOptions: {},
    // multiple option in case you want more that one instance
    multiple: true,
    docExpansion: "full"
  };

// Init express
const app = express();
app.disable('etag');
dotenv.config();

app.use(compression())

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET_JWT,
    cookie: {
        // domain: '.wizardorbit.com;',
        domain: 'localhost',
        maxAge: 24 * 60 * 60 * 1000,
    },
    saveUninitialized: false,
    resave: false,
    store: store
}))
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json({ limit: '50mb' }));
// enabling cors for all requests by using cors middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://sihirbazblog.com",
        "https://sihirbazblog.com",
        "http://sihirbazforum.com",
        "https://sihirbazforum.com",
        "http://wizardorbit.com",
        "https://wizardorbit.com",
        "http://panel.sihirbazforum.com",
        "https://panel.sihirbazforum.com",
        "http://panel.wizardorbit.com",
        "https://panel.wizardorbit.com",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    optionsSuccessStatus: 200,
    preflightContinue: true,
    credentials: true,
    allowedHeaders: "Origin, X-Requested With, Content-Type, Accept",
    exposedHeaders: ['set-cookie']
}));
// Enable pre-flight
app.options("*", cors());

app.engine("ejs", engine);
app.set("views", "./src/views");
app.set("view engine", "ejs")

app.use(fileupload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

const port = Number(process.env.PORT || 5000);

expressJSDocSwagger(app)(options);

app.use(`/api/v1/abouts`, aboutRouter);
app.use(`/api/v1/categories`, categoryRouter);
app.use(`/api/v1/drafts`, draftRouter);
app.use(`/api/v1/chapters`, chapterRouter);
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/useroptions`, userOptionRouter);
app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/options`, optionRouter);
app.use(`/api/v1/themes`, themeRouter);
app.use(`/api/v1/menus`, menuRouter);
app.use(`/api/v1/messages`, messageRouter);
app.use(`/api/v1/mail`, mailRouter);
app.use(`/api/v1/forums`, forumRouter);
app.use(`/api/v1/news`, newsRouter);
app.use(`/api/v1/libraries`, libraryRouter);
app.use(`/api/v1/logs`, logRouter);
app.use(`/api/v1/multiparts`, multipartRouter);

// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    serverLogger.error(`${err.status} : ${err.message} (${req.url})`)
    next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, '127.0.0.1', () => {
    console.log(`🚀 Server running on port ${port}!`)
    serverLogger.info(`🚀 Server running on port ${port}!`)
});


module.exports = app;