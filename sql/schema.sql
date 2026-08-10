CREATE TABLE IF NOT EXISTS students(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS courses(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS assignments(
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id), 
    name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS student_courses(
    student_id INTEGER NOT NULL REFERENCES students(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),

    PRIMARY KEY (student_id, course_id)
);