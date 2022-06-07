const router = require("express").Router();
const GameModel = require("../models/Game.model");
const axios = require("axios");
const isAuthenticated = require("../middlewares/isAuthenticated");
const CommentModel = require("../models/Comment.model");
let page = 1;

//! Const de llamada
const root = "https://api.rawg.io/api/"; //* ---> Constante base
const allGames = `${root}games?key=${process.env.API_KEY}&page=${page}&page_size=40`;


// ! GET "api/videogames"
router.get("/", async (req, res, next) => {
  try {
    const response = await axios.get(allGames);
    res.json(response.data);
  } catch (error) {
    navigate(error);
  }
});

// ! GET "api/videogames/:id/details"
router.get("/:id/details", async (req, res, next) => {

  const {id} = req.params
  console.log(id);
  const gamesDetails = `https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`;

  try {
    const response = await axios.get(gamesDetails);
    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    next(error);
  }
});

// ! GET "api/videogames/:id/trailers" ---> RUTA DE BACK DISTINTA PERO LA MISMA EN FRONT.
router.get("/:id/trailers", async (req, res, next) => {

    const {id} = req.params
    console.log(id);
    const gamesTrailers = `https://api.rawg.io/api/games/${id}/movies?key=${process.env.API_KEY}`;
  
    try {
      const response = await axios.get(gamesTrailers);
      res.json(response.data);
      console.log(response.data)
    } catch (error) {
      next(error);
    }
  });

  //! RUTA DE COLECCIONES
  // POST "api/videogames/:id/collections"
router.post("/:id/collections", isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id
  const {gameApiId, title, status} = req.body
    
  try {

      console.log("Me cago!")
    
    await GameModel.create({
      userId,
      gameApiId,
      title,
      state: status
    })
      res.json("Se ha actualizado el estado correctamente");
    
  } catch (error) {
    next(error);
  }
});

//! RUTAS DE COMMENTS
  // GET "api/videogames/:id/comments"
  router.get("/:commentId/comments", isAuthenticated, async (req, res, next) => {
    
    const {commentId} = req.params


    try {
  
        console.log("Comentariooo")
        const response = await CommentModel.findById(commentId)
        res.json(response)
      
    } catch (error) {
      next(error);
    }
  });


  // POST "api/videogames/:id/comments"
  router.post("/:commentId/comments", isAuthenticated, async (req, ser, next) =>{
    const userId = req.payload._id
    const {videogame, username, comment, timestamps} = req.body

    try {

      console.log("Post de comment")

      await CommentModel.create({
        userId,
        videogame,
        username,
        comment,
        timestamps
      })
      res.json("Comentario añadido")
    } catch(error) {
      next(error)
    }
  })

module.exports = router;

