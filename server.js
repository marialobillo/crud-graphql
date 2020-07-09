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

    type Query {
        getCourses: [Course]
        getCourse(id: ID!): Course
    }

    type Mutation {
        addCourse(title: String!, views: Int): Course
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
    addCourse(arguments){
        
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