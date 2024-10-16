package main

// Abreviatura de "format"

// en Go estamos constantemente importando paquetes para conseguir el mejor redimiento
// reflect es un paquete que nos permite inspeccionar variables
import (
	"fmt"
	"reflect"
)

func main() {

	fmt.Println("Hello, World!")

	// Variables

	var myString string = "Esto es un string"
	fmt.Println(myString)

	// Tambien puede inferir el tipo de variable
	var myString2 = "Esto es otro string"
	fmt.Println(myString2)

	// Por defecto int son de 32 bits
	var myInt int = 10

	//si sabemos que pueden tener menos de 32 bits poder usar int8, int16, int32, int64
	var myInt8 int8 = 25

	fmt.Println(myInt + int(myInt8))

	// Para saber el tipo de una variable
	fmt.Println(reflect.TypeOf(myInt8))

	var myFloat float64 = 3.14
	fmt.Println(myFloat + float64(myInt))

	var myBool bool = true
	fmt.Println(myBool)

	// operador para declarar e inicializar una variable
	myVar := "esto es lo mismo que var myVar string = 'esto es un string'"
	fmt.Println(myVar)

	// Constantes

	// las constantes no hace falta usarlas para que compile
	const myConst string = "Esto es una constante"

	// Control de flujo

	if myInt > 5 {
		fmt.Println("Es mayor que 5")
	} else {
		fmt.Println("Es menor que 5")
	}

	// Estrucutras de datos

	// Arrays

	// array de 3 elementos de tipo int
	// sino especifico ningun valor, se inicializa a 0
	var myArray [3]int
	myArray[0] = 1
	myArray[1] = 2
	myArray[2] = 3
	fmt.Println(myArray)

	// array de 3 elementos de tipo string
	// si no especifico ningun valor, se inicializa a ""
	myArray2 := [3]string{"a", "b"}
	fmt.Println(myArray2)

	// Map

	// map de string a int
	myMap := make(map[string]int)
	myMap["a"] = 1
	myMap["b"] = 2
	fmt.Println(myMap)

	myMap2 := map[string]int{"a": 1, "b": 2}
	fmt.Println(myMap2)

	// Lista

	myList := []int{1, 2, 3}
	myList = append(myList, 4)
	fmt.Println("Lista", myList)

	// Bucles

	for i := 0; i < 5; i++ {
		fmt.Println(i)
	}

	for key, value := range myMap {
		fmt.Println(key, value)
	}

	// Funciones

	fmt.Println(myFunction())

	// Estructuras (equivalante a clases)

	type MyStruct struct {
		name string
		age  int
	}

	miguel := MyStruct{name: "Miguel", age: 25}
	fmt.Println(miguel)
}

func myFunction() string {
	return "Hola desde la función"
}
