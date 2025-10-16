# Auth router
- POST /signup
- POST /login
- POST /logout .

# Profile router
- GET /profile/view 
- PATCH /profile/edit 
- PATCH /profile/password 

# ConnectionRequest router
- POST /request/send/:status/:userId

# ConnectionReview router
- POST /request/review/:status/:requestId


# User router
- GET /user/connection
- GET /user/requests

# Feed router
- GET /user/feed - profiles of other users on platform

status : unintrested, interested, accepted, rejected