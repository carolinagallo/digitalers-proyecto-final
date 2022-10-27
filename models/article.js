const mongoose = require("mongoose");
const { marked } = require("marked");

//slug: lo que viene despues de nuestro dominio . ejemplo= https://midominio.com/SLUG/
// y se refiere a una pagina o publicacion especifica
const slugify = require("slugify");

//dompurify= desinfectar un fragmento de HTML, eliminando cargas utiles XSS(cross site scripting)
const createDOMPurify = require("dompurify");

const { JSDOM } = require("jsdom");
//es una herraminta que nos permite crear un dom dentro
// de un entorno en el que no contamos con un navegador(ej. server)

const dompurify = createDOMPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    markdown: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      require: true,
      //construye indices unicos pero no es una validacion
      unique: true,
    },
    sanitizarHtml: {
      type: String,
      require: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);
//middelware .pre()
articleSchema.pre("validate", function (next) {
  if (this.title) {
    // lower= convertirlo en minuscula
    //strict= eliminar caracteres especiales
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.markdown) {
    //lo que hacemos es convertir nuestro doc html y luego limpiar ese doc
    // que le pasamos y se deshace de cualq codigo malicioso
    this.sanitizarHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
});
module.exports = mongoose.model("Article", articleSchema);
