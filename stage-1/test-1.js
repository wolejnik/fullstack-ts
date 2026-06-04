const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mock data
let tasks = [
    { id: 1, title: "Learn Node.js", completed: false },
    { id: 2, title: "Build an API", completed: false }
];

// ==========================================
// 1. APP ROUTES
// ==========================================

// GET all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// GET task by ID (Moved up here so it actually runs!)
app.get('/tasks/:id', (req, res, next) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));

    if (!task) {
        const error = new Error('Zadanie o podanym ID nie istnieje.');
        error.status = 404;
        return next(error); // Passes the error to the global handler
    }

    res.json(task);
});

// POST a new task
app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id !== parseInt(id));
    res.status(204).send();
});

// ==========================================
// 2. ERROR HANDLING MIDDLEWARE
// ==========================================

// 404 Catch-all for routes that don't exist
app.use((req, res, next) => {
    const error = new Error('Nie znaleziono takiej strony!');
    error.status = 404;
    next(error);
});

// Global Error Handler (Added the missing timestamp)
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        error: { 
            message: err.message, 
            status: status,
            timestamp: new Date().toISOString() // Added to match your test notes!
        }
    });
});

// ==========================================
// 3. START SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// TESTS IN POWER SHELL
// GET
// curl http://localhost:3000/tasks                                                                   

// StatusCode        : 200
// StatusDescription : OK
// Content           : [{"id":1,"title":"Learn Node.js","completed":false},{"id":2,"title":"Build an API","completed":false}]
// RawContent        : HTTP/1.1 200 OK
//                     Connection: keep-alive
//                     Keep-Alive: timeout=5
//                     Content-Length: 102
//                     Content-Type: application/json; charset=utf-8
//                     Date: Mon, 18 May 2026 18:37:52 GMT                                                                                     ETag: W/"66-yWz2KcFta4AAnwUul4G...                                                                  Forms             : {}                                                                                                  Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Content-Length, 102], [Content-Type, applicati                     on/json; charset=utf-8]...}
// Images            : {}
// InputFields       : {}
// Links             : {}
// ParsedHtml        : mshtml.HTMLDocumentClass
// RawContentLength  : 102

//POST
// curl -Method Post -Uri "http://localhost:3000/tasks" -ContentType "application/json" -Body '{"title":"Kupic mleko"}'


// StatusCode        : 201
// StatusDescription : Created
// Content           : {"id":3,"title":"Kupic mleko","completed":false}
// RawContent        : HTTP/1.1 201 Created
//                     Connection: keep-alive
//                     Keep-Alive: timeout=5
//                     Content-Length: 48
//                     Content-Type: application/json; charset=utf-8
//                     Date: Mon, 18 May 2026 18:38:38 GMT
//                     ETag: W/"30-lcqGcZ2oK1TG+Sr...
// Forms             : {}
// Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Content-Length, 48], [Content-Type, applicatio
//                     n/json; charset=utf-8]...}
// Images            : {}
// InputFields       : {}
// Links             : {}
// ParsedHtml        : mshtml.HTMLDocumentClass
// RawContentLength  : 48

//DELETE
//  curl -Method Delete -Uri "http://localhost:3000/tasks/1"


// StatusCode        : 204
// StatusDescription : No Content
// Content           : {}
// RawContent        : HTTP/1.1 204 No Content
//                     Connection: keep-alive
//                     Keep-Alive: timeout=5
//                     Date: Mon, 18 May 2026 18:38:50 GMT
//                     X-Powered-By: Express


// Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Date, Mon, 18 May 2026 18:38:50 GMT], [X-Powered-By, Express]}
// RawContentLength  : 0