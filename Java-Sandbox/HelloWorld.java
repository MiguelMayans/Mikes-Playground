import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HelloWorld {
    public static void main(String[] args)
    {
        System.out.println("Hello World");

        // Brais Primeros Pasos

        // Syntax

        String myString = "Hola, ¿Qué tal?";
        myString = "Como buena variable, puedo cambiar de valor";
        System.out.println(myString);

        int myInt = 10;
        Integer myInteger = 10; // mejor usar Integer porque es una clase y tiene más métodos

        int cincuenta = myInteger*5;
        System.out.println(cincuenta);
        
        
        Double myDouble = 10.56; // Double es un número con decimales

        // Float es un número con decimales pero con menos precisión que Double, hay que poner la f al final
        Float myFloat = 10.56f;

        float sumaValida = myFloat + myInt + myDouble.floatValue();
        System.out.println(sumaValida);

        Boolean myBoolean = true;

        List<Integer> myArray = new ArrayList<>(); // ArrayList es una clase que se usa para crear arrays
        myArray.add(1);
        myArray.add(2);
        System.out.println(myArray);
 
        // Siempre primero creo el objeto y luego ya interactúo con él
        Map<String, String> myMap = new HashMap<>(); // HashMap es una clase que se usa para crear diccionarios
        myMap.put("key", "value");
        myMap.put("key2", "value2");
        System.out.println(myMap);

        for (int i = 0; i < myArray.size(); i++) {
            System.out.println(myArray.get(i));
        }

       final int CONSTANTE = 10; // Las constantes se declaran con final y en mayúsculas

       HelloWorld miClasePrincipal = new HelloWorld();
        miClasePrincipal.myFunction(1, 2);
    }

    // El void es el tipo de retorno de la función, en este caso no devuelve nada

    public void myFunction(int oneNumber, int anotherNumber) {
        System.out.println(oneNumber + anotherNumber);
    }

    // En este caso la función devuelve un int

    public int myFunctionConReturn(int oneNumber, int anotherNumber) {
        return oneNumber + anotherNumber;
     }
 }