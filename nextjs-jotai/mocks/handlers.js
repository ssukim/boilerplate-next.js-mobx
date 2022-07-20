import { rest } from "msw";

const todos = Array.from({ length: 10 })
  .map((_, index) => ({
    id: index,
    title: `Log ${index}`,
  }))
  .reverse();

export const handlers = [
  rest.post("https://development/api/login", (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem("is-authenticated", "true");
    return res(
      // Respond with a 200 status code
      ctx.status(200)
    );
  }),
  rest.get("https://development/api/user", (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = sessionStorage.getItem("is-authenticated");
    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: "Not authorized",
        })
      );
    }
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        username: "admin",
      })
    );
  }),
  rest.get("https://development/api/posts", (req, res, ctx) => {
    return res(ctx.json(todos));
  }),
  rest.get("https://development/api/posts/:postId", (req, res, ctx) => {
    const { postId } = req.params;
    return res(
      ctx.json({
        id: postId,
      })
    );
  }),
  rest.post("https://development/api/posts", async (req, res, ctx) => {
    todos.push(req.body);

    // loading delay test
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return res(ctx.status(201));
  }),
];
