const resolvers = {
  Query: {
    hello: () => "Hello from Apollo over HTTPS!",
    me: (_parent, _args, ctx) => {
      // ctx.user set by auth middleware / context function
      return ctx.user ?? null;
    },
  },
  Mutation: {
    login: async (_, { username, password }) => {
      if (username === "admin" && password === "password") {
        const user = { id: "1", username: "admin", name: "Admin User" };

        // Create token
        const jwt = require("jsonwebtoken");
        const token = jwt.sign(
          { sub: user.id, username: user.username },
          process.env.JWT_SECRET || "dev-secret",
          { expiresIn: "2h" }
        );

        return { token, user };
      }
      throw new Error("Invalid credentials");
    },
  },
};
