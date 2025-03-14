# TradeTrackerJournal

Hello! This stock market trading journal project is one of my learning projects that I have completed during my studies as a computer science student aspiring to be a software engineer.

Purpose: Track long financial investments by entering stock trade data and by analyzing trends and performance stats.

Tools used:
- Javascript
- React
- HTML
- CSS
- Recharts library for the line chart
- ZeroMQ to handle the two microservices that generate the pie chart and mini stats window which was a requirement during class to integerate a microservice architecture.

Features:
- Login/Register page
- Json Web Token Authentication
- Add, Edit, Delete buttons and forms for trade data entry
- Line graph detailing results trend
- Average performance by win rate, breakeven win rate, and current win rate
- Pie chart of wins vs losses

To use:
- Make a copy of the repository / download the files
- Create .env file, Connect to a mongoDB cluster by adding the string to MONGO_URI="<string>", JWT_SECRET
- Npm start in the backend and frontend
- In a new terminal type node microserviced.js to start the pie chart microservice file.
- In a new terminal type python microservicea.js to start the statistics microservice file.


Screenshots of the login page, homepage, trade form page, and contact page:
![Login Page](https://github.com/user-attachments/assets/1fdddf8e-55f0-4050-b4b6-abf45c134b08)
![HomePage](https://github.com/user-attachments/assets/e149faed-d154-4797-819e-2c3560524d66)
![Home Page Stats](https://github.com/user-attachments/assets/d365e73c-c7c9-416b-9996-4ee59ea427c9)
![trade form page](https://github.com/user-attachments/assets/2fca166b-c45f-4b29-956f-8130195746ac)
![Contact page](https://github.com/user-attachments/assets/09596ddd-c610-4739-863e-00371d043c98)
