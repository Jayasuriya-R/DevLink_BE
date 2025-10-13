# Auth router
- POST /signup
- POST /login
- POST /logout .

# Profile router
- GET /profile/view 
- PATCH /profile/edit 
- PATCH /profile/password

# ConnectionRequest router
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# User router
- GET /user/connection
- GET /user/requests
- GET /user/feed - profiles of other users on platform

status : ignore, interested, accepted, rejected