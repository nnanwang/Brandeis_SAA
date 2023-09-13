# Brandeis_SAA
The Brandeis Students and Alumni Association is a vibrant community that offers lifelong opportunities for students and alumni to stay connected to Brandeis and each other.

## Selected Functional Pages
![image](https://user-images.githubusercontent.com/74788199/233533020-7e73b541-28d7-45f6-ba50-acb0c40a95d5.png)
<img width="1282" alt="image" src="https://github.com/nnanwang/Brandeis_SAA/assets/74788199/0ffaac17-0694-4fbe-84c4-a8f5ad18fedc">
<img width="1282" alt="image" src="https://github.com/nnanwang/Brandeis_SAA/assets/74788199/2109a699-2f9f-48de-ba02-71b4360693b6">
<img width="1282" alt="image" src="https://github.com/nnanwang/Brandeis_SAA/assets/74788199/f4f1f0a2-4fed-4d91-be23-3c4464bbcdaa">
<img width="1282" alt="image" src="https://github.com/nnanwang/Brandeis_SAA/assets/74788199/c3dc52f1-2456-441e-b0e1-aee4a1a85d8d">
<img width="1282" alt="image" src="https://github.com/nnanwang/Brandeis_SAA/assets/74788199/34b32609-d64c-4e60-923a-e10b24347ce7">


## App Structure
```
.
├── README.md
├── controllers
│   ├── chatController.js
│   ├── errorController.js
│   ├── eventsController.js
│   ├── homeController.js
│   ├── jobsController.js
│   └── usersController.js
├── index.js
├── models
│   ├── event.js
│   ├── job.js
│   ├── message.js
│   └── user.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   │   ├── style.css
│   │   └── user.css
│   ├── image
│   │   └── BrandeisLogo.png
│   └── js
│       ├── BUSAAApp.js
│       ├── bootstrap.min.js
│       ├── chatApp.js
│       └── jquery.min.js
├── routes
│   ├── apiRoutes.js
│   ├── errorRoutes.js
│   ├── eventRoutes.js
│   ├── homeRoutes.js
│   ├── index.js
│   ├── jobRoutes.js
│   └── userRoutes.js
└── views
    ├── about.ejs
    ├── chat.ejs
    ├── contact.ejs
    ├── events
    │   ├── _eventsModal.ejs
    │   ├── edit.ejs
    │   ├── index.ejs
    │   ├── new.ejs
    │   └── show.ejs
    ├── events.ejs
    ├── index.ejs
    ├── jobs
    │   ├── edit.ejs
    │   ├── index.ejs
    │   ├── new.ejs
    │   └── show.ejs
    ├── jobs.ejs
    ├── layout.ejs
    └── users
        ├── edit.ejs
        ├── index.ejs
        ├── login.ejs
        ├── new.ejs
        └── show.ejs
   ```
   ## Run App
   - #### Install modules before running <br><br>```npm install```
   - #### Run this App <br><br>```nodemon```
