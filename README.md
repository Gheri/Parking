Prereq To run the project
1. NodeJs
2. VSCode
3. Mongo running on localhost (mongodb://localhost:27017/parking)
4. PM2 to run cronjob (install pm2 and use command pm2 start src/cronJob.js --cron "* * * * *")

Steps to Run the Project
1. Open folder in VS Code
2. npm install
3. Open Visual Studio and hit the debug buttion or npm start from terminal
4.  pm2 start src/cronJob.js --cron "* * * * *")


HL Design:
1. Created two collections in mongodb parking & users to track users and parking spaces.
2. Parking document has bookings array as well to track the bookings for that parking space.
3. Whenever user create booking, booking is selected based on given criteria(preference to) and is being updated in bookings array of parking space with expiresOn as 30 minutes / 15 minutes based on availability of parking space.
4. When user confirms the booking, expiresOn field is updated to (Now + 9 hours) as I have assumed that its being built for corporate parking spaces. In future we can allow user to send booking hours as well.
5. When user cancels, booking is removed from parking space.
6. There is cron job which keeps on looking at expiresOn field of booking array of parking document and if its less than Date.Now then it will remove the booking from parking document.








Scenario Tested  with minimal data
Set for now ParkingSpaces as 6 in default.js in config folder
1. Created Six Users two  pregnant and one differentlyAbled and 4 others
    POST http://localhost:4000/v1/users
    RequestBody:  
{
    "firstName": "Ramesh",
    "lastName": "Tendurkar",
    "employeeId": "123456",
    "email": "ramesh@abc.com",
    "company": "ABC India",
    "phone": "000765890",
    "gender": "male",
    "differentlyAbled": "false",
    "pregnant": "false"
}


2. To get all registered Users
   GET http://localhost:4000/v1/users

3. Create 5 Parking Spaces 2 reserved and 3 unreserved
    POST http://localhost:4000/v1/parkings
   RequestBody
   {
       "name": "L12",
       "reserved": "true",
        "dimensions" : {"breadth": 10, "width": 10}
    }

4. To get all parking spaces
    GET http://localhost:4000/v1/parkings



5. Booking of first pregnant woman
    POST http://localhost:4000/v1/bookings
  RequestBody
  {
      “userId”: “<id of pregnant woman>”
   }
   

   Response: Booking with Parking record.
                       Verify the given parking is reserved and has booking into bookings                array

6. Booking of second pregnant woman
    POST http://localhost:4000/v1/bookings
   {
      “userId”: “<id of pregnant woman>”
   }
   
   Response: Booking with Parking record.
                       Verify the given parking is reserved and has booking into bookings array

7. Booking of differentlyAbled person
    POST http://localhost:4000/v1/bookings
   {
      “userId”: “<id of differentlyAbled person>”
   }
   
   Response: Booking with Parking record.
                       Verify unreserved parking has been allocated as there is no reserved parking space left.

8. Booking of another person
    POST http://localhost:4000/v1/bookings
   {
      “userId”: “<id of another person>”
   }
   
   Response: Booking with Parking record.
                       Verify unreserved parking has been allocated for another person.

9. GET occupied parking
    GET http://localhost:4000/v1/parkings?occupied=true

10. GET empty parking
   GET http://localhost:4000/v1/parkings?occupied=true

10. Confirm one of booking 
  POST http://localhost:4000/v1/bookings/{bookingId}/confirm 

11. Cancel one for the booking
  POST http://localhost:4000/v1/bookings/{bookingId}/cancel

if cron job is working properly, only one booking (confirmed one) would be present in parking
All other parkings would be deleted by cron job when expiresOn becomes less than Date.Now
