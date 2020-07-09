const express = require('express');
const { buildSchema } = require('graphql')

const app = express();

const courses = require('./courses');


const schema = new buildSchema(`
    type Course {
        id: ID!
        title: String!
        view: Int
    }

    type Query {
        getCourses: [Course]
    }
`);

app.get('/', (req, res) => {
    res.json(courses); 
})

app.listen(4000, () => {
    console.log("Server running on 4000 port")
})