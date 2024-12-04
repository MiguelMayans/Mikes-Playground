// CLASES

class Curso {
  constructor(titulo, dificultad) {
    this.titulo = titulo;
    this._dificultad = dificultad;
    // podemos definir atributos vacios que no estén en los parámetros
    this.lecciones = [];
  }

  // esta propiedad es propia de la clase, no de cada uno de los cursos
  static BASE_URL = "una URL cualquiera";

  // Getters y Setters

  // al poner _dificultad por covención estamos diciendo que este valor no debe tocarse directamente (tendrá su getter y su setter)

  get dificultad() {
    console.log("Getter");
    return this._dificultad;
  }

  // si yo no añado este setter no podría cambiar su valor (sería readonly)
  set dificultad(nuevaDificultad) {
    if (nuevaDificultad >= 0 && nuevaDificultad <= 5) {
      this._dificultad = nuevaDificultad;
    } else {
      return;
    }

    console.log("Setter");
  }

  agregarLección(lección) {
    this.lecciones.push(lección);
  }

  eliminarUlitmaLección(lección) {
    this.lecciones.pop();
  }
}

const cursoJS = new Curso("Javascript", "nivel medio");
const cursoTS = new Curso("TypeScript", "nivel medio-alto");

cursoJS.agregarLección("Variables");
cursoTS.agregarLección("Tipos");

cursoJS.dificultad = 2; // cambia
cursoJS.dificultad = 6; // no cambia

// Aun así yo peudo acceder al valor como yo quiera porque siempre puedo hacer:
cursoJS._dificultad = 9;

console.log(cursoJS);
console.log(cursoTS);

console.log(Curso.BASE_URL);

// HERITAGE

class Usuario {
  constructor(nombre, email, password) {
    this.nombre = nombre;
    this.email = email;
    this.password = password;
  }

  saludo() {
    console.log(`Hola,soy  ${this.nombre}`);
  }

  login(email, password) {
    if (email === this.email && password === this.password) {
      return true;
    } else {
      return false;
    }
  }
}

// no puedo llamar a los parámetros que ya tiene Usuario con this porque estoy en una clase hija, tengo que llamarlo con super

class Alumno extends Usuario {
  constructor(nombre, email, password) {
    super(nombre, email, password); // lo mismo que hacer super.nombre = nombre, super.email = email, super.password = password

    this.cursos = [];
    this.activo = false;
  }
  agregarCurso(curso) {
    this.cursos.push(curso);
  }
  activar() {
    this.activo = true;
  }

  login(email, password) {
    if (this.activo) {
      return super.login(email, password);
    } else {
      return false;
    }
  }
}

const pablo = new Usuario("Pablo", "pablo@gm.com", "1234");
const jose = new Alumno("Jose", "jose@gm.com", "1234");

console.log(pablo instanceof Usuario); // true
console.log(jose instanceof Alumno); // true
console.log(jose instanceof Usuario); // true (porque Alumno hereda de Usuario)
console.log(pablo instanceof Alumno); // false

console.log("Triying Neovim on Ubuntu");
