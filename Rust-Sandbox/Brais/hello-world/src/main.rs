use std::collections::{HashMap, HashSet};

fn main() {
    // Esto es un comentario

    // Hola mundo
    println!("Hola, Rust!");

    // Variables
    let mut my_string = "Esto es un string";
    println!("{my_string}");

    my_string = "Aqui cambio el valor del string porque le he puesto mut delante";
    println!("{my_string}");

    // my_string = 6 => error

    let my_string2: String =
        String::from("Esto es otra cadena de texto String con un espacio fijo infereido con from");
    println!("{my_string2}");

    let mut my_int = 7;
    my_int = my_int + 4;
    println!("{my_int}");
    println!("Este es el valor de my_int: {}", my_int);

    let my_float = 5.43;
    // my_float = my_float + my_int; => esto da error porque no te deja sumar dos tipos distintos

    let my_bool = false;
    println!("{my_bool}");

    // Constantes
    const MY_CONST: &str = "Mi propriedad constante";
    println!("{MY_CONST}");

    // Control de Flujo
    if my_int == 10 && my_string == "Hola" {
        println!("el valor es 10")
    } else if my_int == 11 || my_string == "Hola" {
        println!("el valor es 11 o el string es hola")
    } else {
        println!("el valor no es 10")
    }

    // Lista => se usan vectores
    let mut my_list = vec!["Miguel", "Mayans", "Vilches"];
    my_list.push("Hervás");
    println!("{:?}", my_list);
    println!("{}", my_list[1]);

    // Sets (No están orndeandos y no admite repetidos)
    let mut my_set: HashSet<&str> = vec!["Miguel", "Mayans", "Vilches"].into_iter().collect();
    my_set.insert("Hervás");
    println!("{:?}", my_set);

    // Mapas
    let mut my_map: HashMap<&str, i32> = vec![("Miguel", 35), ("Brais", 36)].into_iter().collect();
    my_map.insert("Paco", 26);
    println!("{:?}", my_map);

    // Bucles => aqui le tenemos que oiner el ampersand a mylist para ponerle el puntero y decirle que lueog lo vamos a volver a utilizar abajo
    for value in &my_list {
        println!("{}", value);
    }

    for (key, value) in my_map {
        println!("{} {}", key, value);
    }

    let mut my_counter = 0;
    while my_counter < my_list.len() {
        println!("{}", my_list[my_counter]);
        my_counter += 1
    }

    // Funciones
    my_function();

    // Estructuras (ver declaración más abajo)
    let my_struct = MyStruct::new("Miguel", 35);
    println!("{} {}", my_struct.name, my_struct.age)
}

fn my_function() {
    println!("Esto es una función")
}

// Estructuras (objetos)
struct MyStruct {
    name: String,
    age: i32,
}

// Seria como un constructor
impl MyStruct {
    fn new(name: &str, age: i32) -> MyStruct {
        MyStruct {
            name: String::from(name),
            age,
        }
    }
}
