//CRUD Create Read Update Delete

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = "task_manager";


MongoClient.connect(connectionURL,{ useNewUrlParser: true}, (error,client) => {
    
    if(error){
        return console.log('Unable to connect to database!');
    }

    //console.log('Connected correctly!');

    const db = client.db(databaseName);

    db.collection("users").deleteMany(
        {
          description: "Task2"
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  
});

