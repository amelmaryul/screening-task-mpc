## 1. What assumptions did you make?

The task did not specify a database schema and only provided the required endpoints, so I designed the schema and relationships myself.

- Students and courses have a many-to-many relationship represented through a join table. Students can have multiple courses, and courses can have multiple students.
- Each assignment belongs to one course, creating a one-to-many relationship between courses and assignments.
- Each student has a role which can either be student or admin.
- Admins have access to all endpoints. Students only have access to GET endpoints.
- The api/auth/signup end point was provided for testing only. Ideally, the database should have admin already and only admins can create student entries.
- PATCH on assignments only updates fields explicitly provided in the request body.
- PUT on students requires the full object and replaces the existing values.

## 2. What was the hardest part?

The hardest part was setting up the overall structure and putting the different pieces together including middleware, authentication, PostgreSQL and Docker

Once the basic structure was in place, the remaining endpoints were fairly easy.

## 3. If you had another week, what would you improve?

I would decouple the routing and API logic by introducing a controllers module. This would allow routers to focus on routing requests while controllers handle the application logic, making the code more modular and easier to maintain.

I would also consider introducing Redis for caching frequently accessed data and rate limiting authentication requests.

## 4. What would you refactor first?

I would start by introducing controllers and moving the database and business logic out of the route files. Some of the current route handlers contain quite a lot of logic, so separating these responsibilities would make the code easier to read, test, and maintain.


## 5. What AI tools did you use, and how did they help?
I used Gemini to search for information and help me debug errors during development


## 6 What did you deliberately choose not to build?
In the schema I defined a students and courses relationship. I decided against building API endpoints for this relationship because it was out of the scope and would have required more time.
I also decided on adding a role attributed to student instead of redefining student to be a generic user. This was to not sway away from the written requirements too much. Having a user entity with a role student or admin felt more natural then a student with a role student or admin.

