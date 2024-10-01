import express from "express"; // Using import instead of require
import axios from "axios"; // Import Axios using ES6 syntax
import path from "path"; // For handling file paths

const app = express();

app.set("view engine", "ejs");

// Middleware to parse URL-encoded bodies from POST requests
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(process.cwd(), "public")));

// Home route - displays the input form
app.get("/", (req, res) => {
  res.render("index");
});

// Route to handle form submission and fetch joke
app.post("/joke", async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    // Fetch a joke from the JokeAPI using Axios
    const response = await axios.get("https://v2.jokeapi.dev/joke/Any", {
      params: {
        blacklistFlags: "nsfw,religious,political,racist,sexist,explicit",
      },
    });

    let jokeData = response.data;

    // Personalize the joke with the user's name if possible
    if (jokeData.type === "single") {
      jokeData.joke = jokeData.joke.replace(
        /Chuck Norris/gi,
        `${firstName} ${lastName}`
      );
    } else {
      jokeData.setup = jokeData.setup.replace(
        /Chuck Norris/gi,
        `${firstName} ${lastName}`
      );
      jokeData.delivery = jokeData.delivery.replace(
        /Chuck Norris/gi,
        `${firstName} ${lastName}`
      );
    }

    // Render the joke page with the fetched joke data
    res.render("joke", { jokeData, firstName });
  } catch (error) {
    console.error("Error fetching joke:", error);
    res.render("error", {
      errorMessage: "Sorry, something went wrong. Please try again later.",
    });
  }
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).render("error", { errorMessage: "Page not found." });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
