const express = require('express');
const { buildSchema } = require('graphql')


const app = express();

const courses = require('./courses');
const { graphqlHTTP } = require('express-graphql');


const schema = new buildSchema(`
    type Course {
        id: ID!
        title: String!
        views: Int
    }

    input CourseInput {
        title: String!
        views: Int
    }

    type Query {
        getCourses: [Course]
        getCourse(id: ID!): Course
    }

    type Mutation {
        addCourse(input: CourseInput): Course
        updateCourse(id: ID!, input: CourseInput): Course
    }
`);

const root = {
    getCourses(){
        return courses;
    },
    getCourse({ id }){
        console.log(id);
        const course = courses.find( (course) => id == course.id);
        return course;
    },
    addCourse({title, views}){
        const id = String(courses.length + 1);
        const course = { id, title, views };
        courses.push(course);
        return course;
    },
    updateCourse({id, title, views}){
        const courseIndex = courses.findIndex(course => course.id === id);
        const course = courses[courseIndex];

        const newCourse = Object.assign(course, { title, views });
        courses[courseIndex] = newCourse;

        return newCourse;
    }
}

app.get('/', (req, res) => {
    res.json(courses); 
})

app.use('/graphql', graphqlHTTP({
    schema, 
    rootValue: root,
    graphiql: true
}))

app.listen(4000, () => {
    console.log("Server running on 4000 port")
})