const express = require('express');
const { buildSchema } = require('graphql')


const app = express();

let courses = require('./courses');
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

    type Alert{
        message: String
    }

    type Query {
        getCourses(page: Int, limit: Int = 1): [Course]
        getCourse(id: ID!): Course
    }

    type Mutation {
        addCourse(input: CourseInput): Course
        updateCourse(id: ID!, input: CourseInput): Course
        deleteCourse(id: ID!) : Alert
    }
`);

const root = {
    getCourses(page, limit){
        if(page !== undefined){
            return courses.slice(page * limit, (page + 1) * limit);
        }
        return courses;
    },
    getCourse({ id }){
        console.log(id);
        const course = courses.find( (course) => id == course.id);
        return course;
    },
    addCourse({input}){
        const id = String(courses.length + 1);
        const course = { id, ...input };
        courses.push(course);
        return course;
    },
    updateCourse({id, title, views}){
        const courseIndex = courses.findIndex(course => course.id === id);
        const course = courses[courseIndex];

        const newCourse = Object.assign(course, input);
        courses[courseIndex] = newCourse;

        return newCourse;
    },
    deleteCourse({id}){
        courses = courses.filter( course => course.id != id);
        return {
            message: `The course id ${id} was deleted`
        }
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