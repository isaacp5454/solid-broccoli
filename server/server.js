const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const path = require('path');

const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const startApolloServer = async (typeDefs, resolvers) => {
	await server.start();
	server.applyMiddleware({ app });

	db.once("open", () => {
		app.listen(PORT, () => {
			console.log(
				`🌍 Now listening on http://localhost:${PORT}${server.graphqlPath}`
			);
		});
	});
};



const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: authMiddleware,
});

startApolloServer(typeDefs, resolvers);
  
 
  
  